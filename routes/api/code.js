//引入 url模块解析 url 字符串
const url = require('url')
//引入 querystring 模块处理 query 字符串
const querystring = require('querystring')
// 引入 nodemailer
const nodemailer = require('nodemailer')
//ejs模版引擎
const ejs = require('ejs')
//文件读写
const fs = require('fs')
//路径配置
const path = require('path')

// 创建一个SMTP客户端配置
const config = {
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: '', // 填写自己的邮箱账号
    pass: '', // smtp 授权码，到邮箱设置下获取，不是注册时的密码
  },
}
// 创建一个 SMTP 客户端对象
const transporter = nodemailer.createTransport(config)

// 发送邮件
function codeEmail(req, res) {
  // console.log(req)
  let emailNum = Math.random().toString().slice(-6) // 生成6位随机数验证码

  //获取返回的url对象的query属性值 /getEmailCode?email=xxx%40qq.com
  let arg = url.parse(req.url).query

  // 将arg参数字符串 email=xxx%40qq.com 反序列化为一个对象
  let params = querystring.parse(arg)

  let email = params.email //邮箱
  // console.log(email)
  req.session.emailCode = emailNum //把验证码存储进session
  //传给EJS的数据
  let data = {
    verification: emailNum,
  }
  let template = ejs.compile(
    fs.readFileSync(path.resolve(__dirname, '../../views/email.ejs'), 'utf8')
  )
  let html = template(data)
  let mailOptions = {
    from: '', // 发送者，填写自己的邮箱账号
    to: email, // 接受者,可以同时发送多个,以逗号隔开
    subject: '重置账户密码', // 标题
    // text: '邮箱验证码有效期为10分钟,验证码:' + req.session.emailCode,
    html: html, //也可以用html发送
  }
  transporter.sendMail(mailOptions, function (error, info) {
    let succ = {}
    if (error) {
      succ.succ = false
      succ.msg = '发送失败'
    } else {
      succ.succ = true
      succ.msg = '发送成功'
    }
    res.json(succ)
  })
}

// 发送邮件
function registerEmail(req, res) {
  let emailNum = Math.random().toString().slice(-6) // 生成6位随机数验证码

  //获取返回的url对象的query属性值
  let arg = url.parse(req.url).query

  //将arg参数字符串反序列化为一个对象
  let params = querystring.parse(arg)

  let email = params.email //邮箱

  req.session.registerCode = emailNum //把验证码存储进session
  //传给EJS的数据
  let data = {
    verification: emailNum,
  }
  let template = ejs.compile(
    fs.readFileSync(
      path.resolve(__dirname, '../../views/registerEmail.ejs'),
      'utf8'
    )
  )
  let html = template(data)
  let mailOptions = {
    from: '', // 发送者，填写自己的邮箱账号
    to: email, // 接受者,可以同时发送多个,以逗号隔开
    subject: '注册验证码', // 标题
    html: html, //也可以用html发送
  }
  transporter.sendMail(mailOptions, function (error, info) {
    let succ = {}
    if (error) {
      succ.succ = false
      succ.msg = '发送失败'
    } else {
      succ.succ = true
      succ.msg = '发送成功'
    }
    res.json(succ)
  })
}
module.exports = {
  registerEmail,
  codeEmail,
}
