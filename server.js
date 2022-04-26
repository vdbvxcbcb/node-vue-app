// 引入 express
const express = require('express')
const helmet = require('helmet')
// 创建 express 实例
const app = express()
// 引入 mongoose
const mongoose = require('mongoose')
// 引入 body-parser中间件
const bodyParser = require('body-parser')
// 引入 passport中间件
const passport = require('passport')

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// 引入 users 路由中间件
const users = require('./routes/api/users')
// 引入 profiles 路由中间件
const profiles = require('./routes/api/profiles')

// 数据库地址
const db = require('./config/key').mongoURI
// 连接数据库
mongoose
  .set('useUnifiedTopology', true)
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log('已连接数据库'))
  .catch((err) => console.error('无法连接数据库', err))

// 设置跨域和相应数据格式
app.all('/api/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) //可以带cookies
  res.header('X-Powered-By', 'Express')
  if (req.method === 'OPTIONS') res.sendStatus(200)
  /*让 options 请求快速返回*/ else next()
})

app.use(helmet())
app.use(
  session({
    name: 'email',
    secret: 'sendEmailCode', // 用来对session id相关的cookie进行签名
    store: new MongoStore({
      url: db,
      touchAfter: 24 * 3600, // 不管发出多少请求，24小时内只更新一次 session，除非你改变 session
    }), // 数据库存储session
    saveUninitialized: false, // 强制将未初始化的 session 存储。当新建了一个 session 且未设定属性或值时，它就处于
    //未初始化状态。在设定一个 cookie 前，这对于登录验证，减轻服务端存储压力，权限控制是有帮助的。这里建议 false
    resave: false, // 是否每次都强制保存session
    cookie: {
      secure: false, // 只有https协议才设置为true
      httpOnly: true, // 禁止客户端JavaScript的访问，不能使用document.cookie
      maxAge: 10 * 60 * 1000, // 有效期，单位是毫秒，这里设为 10 分钟 10 * 60 * 1000
    },
    // rolling: true // 每次请求都强制对 session 续期
  })
)

// 使用 body-parser 中间件 必须写在路由中间件前面（问题解决）
app.use(bodyParser.urlencoded({ extended: false }))
// 请求 body 解析成 application/json
app.use(bodyParser.json())
// 使用 passport 中间件，初始化 passport
app.use(passport.initialize())
// 头像上传
app.use('/tmp_uploads', express.static('tmp_uploads'))
// 使用 passport 中间件验证 token
require('./config/passport')(passport)

// 测试路由
// app.get("/", (req, res) => {
//   res.send("Hello World!")
// })

// 使用 users 路由中间件
app.use('/api/users', users)
app.use('/api/profiles', profiles)
// 生产环境使用 port 作为端口，开发环境使用 5001 作为端口
// package.json 在生产环境使用 npm run start，在开发环境使用 npm run server
const port = process.env.port || 5001

// 监听端口
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
