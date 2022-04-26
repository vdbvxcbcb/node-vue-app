// passport 是一个针对密码验证中间件，无缝衔接基于 Express的 web 服务
// passport-jwt 是一个针对 jsonwebtoken 的插件
const JwtStrategy = require("passport-jwt").Strategy,
ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const keys = require("./key");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretKey;

module.exports = passport => {
  // passport.js 有策略(strategy)设计模式的概念. strategy 是一些预定义的方法, 
  // 策略会在请求抵达真正的路由之前执行.
  // 如果定义的 strategy（针对 jwt）认定某个请求非法, 则该路由不会被执行, 而是返回 401 Unauthorized.
  // 第一个参数 opts 包含用于控制如何从请求中提取 token 的对象或者被验证的选项的对象
  // 第二个参数是具有参数 (jwt_payload, done)的 verify函数
  // 第三个参数是 callback, done 是 Passport 错误，第一个回调接受参数( 错误，用户，信息)
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const user = await User.findById(jwt_payload.id)
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      }
      catch (ex) {
        console.log(ex);
      }              
    })
  )
}
