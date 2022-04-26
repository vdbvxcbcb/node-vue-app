// 引入 express
const express = require('express')
// 创建路由实例
const router = express.Router()
// 引入 User 模型
const User = require('../../models/User')
// 引入 bcrypt
const bcrypt = require('bcrypt')
// 引入全球公认头像
const gravatar = require('gravatar')
// 引入 jwt
const jwt = require('jsonwebtoken')
// 引入原始 key
const keys = require('../../config/key')
// 引入 passport中间件
const passport = require('passport')
// 引入验证码
const svgCaptcha = require('svg-captcha')
const { registerEmail, codeEmail } = require('./code')

const fs = require('fs')
const path = require('path')
// multer是 express 官方推荐的文件上传中间件（另外还有 formidable），用于处理 multipart/form-data 类型的表单数据
// 基于 busboy 开发
const multer = require('multer')
// 先自定义头像上传的路径
const upload = multer({ dest: 'tmp_uploads/' })

// 创建测试路由
// 公共接口  GET api/users/test
// 返回 json 数据
// router.get("/test", (req, res) => {
//   res.json({msg: "Test"})
// })

// 创建注册路由
// 公共接口  Post api/users/register
// 返回 json 数据
router.post('/register', async (req, res) => {
  const verifyCode = req.body.verifyCode // 邮箱验证码
  if (verifyCode === '') {
    return res.json({ error: true, message: '验证码不能为空!' })
  }
  // 查询数据库中是否已有该邮箱
  const user = await User.findOne({ email: req.body.email })
  // 接收返回的文档对象 user 后，继续处理
  if (user) {
    return res.status(400).send('邮箱已注册!')
  }
  if (req.session.registerCode === verifyCode) {
    // 存放默认头像图片
    const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'g',
      d: 'mm',
    })
    const nowDate = String(new Date().getTime())
    // 把表单的请求数据结合模型存进数据库
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      identity: req.body.identity,
      password: req.body.password,
      date: nowDate,
    })
    // 加盐，对 newUser 密码进行哈希加密后返回 newUser 的 JSON 数据
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          res.json({ error: true, message: '系统错误!' })
        }
        newUser.password = hash
        newUser
          .save()
          .then((user) =>
            res.json({ user, success: true, message: '注册用户成功' })
          )
          .catch((err) => console.log(err))
      })
    })
    // 验证通过，删除保存的验证码
    delete req.session.registerCode
  } else {
    if (!req.session.registerCode) {
      res.json({
        error: true,
        message: '验证码已过期，请重新获取!',
      })
    } else {
      res.json({
        error: true,
        message: '验证码错误!',
      })
    }
  }
})

// 创建登录路由
// 公共接口  POST api/users/login
// 返回 json 数据
// 先查询数据库中该邮箱是否存在，再匹配密码是否一致，最后才登录成功
router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const captcha = req.body.inputCaptcha.toLowerCase()
  if (captcha !== req.session.captcha) {
    return res.json({ error: true, message: '验证码错误!' })
  }
  // 验证通过，删除保存的验证码
  delete req.session.captcha
  const user = await User.findOne({ email })
  if (!user) {
    return res.json({ error: true, message: '邮箱或密码错误!' })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  // 如果登录密码一致
  if (isMatch) {
    const rule = {
      id: user.id,
      name: user.name,
      identity: user.identity,
      avatar: user.avatar,
    }
    // 数字签名生成 token
    // 四个参数：认证依据,私有key, 过期时间, 生成 token 后的回调
    jwt.sign(rule, keys.secretKey, { expiresIn: 3600 }, function (err, token) {
      // 生成并返回 token
      res.json({
        success: true,
        // 使用 passport时，token前面一定要有 Bearer 持有人
        token: 'Bearer ' + token,
      })
    })
    // res.json({msg: "success"})
  } else {
    return res.json({ error: true, message: '邮箱或密码错误!' })
  }
})

// 获取验证码
// 公共接口  Get api/users/getCaptcha
// 返回 cookie 和 验证码字符串
router.get('/getCaptcha', (req, res) => {
  var captcha = svgCaptcha.create({
    // 字体大小
    fontSize: 38,
    // 验证码去掉模糊人眼容易认错的字符
    ignoreChars: '0o1iLlI',
    // 噪声线条数
    noise: 3,
    // 宽度
    width: 80,
    // 高度
    height: 32,
  })
  // 保存到 session,忽略大小写
  req.session.captcha = captcha.text.toLowerCase()
  // console.log(req.session) // 打印生成的验证码，如 0xtg
  //保存到 cookie 方便前端调用验证
  res.type('svg')
  res.send(captcha.data)
  res.end()
})

// 发送重置邮箱验证码
router.get('/getEmailCode', (req, res) => {
  codeEmail(req, res)
})
// 发送注册邮箱验证码
router.get('/getRegisterCode', (req, res) => {
  registerEmail(req, res)
})
// 重置密码
router.put('/resetPass', async (req, res) => {
  const email = req.body.email
  const password = req.body.password2 //密码
  const verifyCode = req.body.verifyCode // 邮箱验证码
  // console.log(req.session.emailCode)
  if (verifyCode === '') {
    return res.json({ error: true, message: '验证码不能为空!' })
  }
  // 查询该账号是否存在
  const user = await User.findOne({ email: email })
  if (!user) {
    return
  } else {
    // 判断验证码是否正确、验证码时间是否超过10分钟
    if (req.session.emailCode === verifyCode) {
      // 加盐，对 newUser 密码进行哈希加密后返回 newUser 的 JSON 数据
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            res.json({ error: true, message: '系统错误!' })
          }
          // 更新数据库的用户信息，把用户名密码也存进去
          let nowDate = String(new Date().getTime()) //获取当前时间
          const newUser = await User.findByIdAndUpdate(
            user._id,
            { password: hash, date: nowDate },
            { new: true }
          ) // new: true返回修改后的数据
          if (newUser) {
            res.status(200).json({
              success: true,
              message: '修改密码成功,请登录',
            })
            // 验证通过，删除保存的验证码
            delete req.session.emailCode
          }
        })
      })
    } else {
      if (!req.session.emailCode) {
        res.json({
          error: true,
          message: '验证码已过期，请重新获取!',
        })
      } else {
        res.json({
          error: true,
          message: '验证码错误!',
        })
      }
    }
  }
})

// 创建 jwt 认证后生成当前用户的路由
// 私有接口  GET api/users/login
// 返回 当前 user
// 认证请求很简单，只需要调用 passport.authenticate() 中间件并且指定要应用的策略
// 成功认证之后，Passport 将建立一个持续的登录会话，请求提供凭证时不必要
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.name,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
    })
  }
)

// 创建上传头像的路由 单图上传
// 路由中间件 upload.single() 接受一个 name 以 fieldname 命名的文件，如 <input type="file" name="file">
router.post('/updateAvatar/:id', upload.single('file'), async function (
  req,
  res,
  next
) {
  // multer 会添加一个 body 对象 以及 file 或 files 对象 到 express 的 req 对象中。
  // body 对象包含表单的文本域信息，file 或 files 对象包含对象表单上传的文件信息。
  // file.originalname 用户上传的原始文件名
  var fileExtArray = req.file.originalname.split('.')
  // ext 上传文件的后缀
  var ext = fileExtArray[fileExtArray.length - 1]
  var targetPath = req.file.path + '.' + ext
  // multer 会自动生成新的上传文件名
  // req.file.path 要上传文件的路径：tmp_uploads\e2b65d86bba4a9ca951767463a1b50b1
  // targetPath ：tmp_uploads\e2b65d86bba4a9ca951767463a1b50b1.jpg
  await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { avatar: 'http://localhost:5001/' + targetPath } }
  )
  // 上传的文件由于不包含文件后缀，无法预览，所以需要重命名
  // 异步地把 oldPath 文件重命名为 newPath 提供的路径名。如果 newPath 已存在，则覆盖它。
  fs.rename(path.join(req.file.path), path.join(targetPath), function (err) {
    if (err) {
      return res.json('上传文件失败!')
    }
    res.status(200).json({
      tmp_path: targetPath,
      url: 'http://localhost:5001/' + targetPath,
    })
  })
})
// 导出路由中间件
module.exports = router
