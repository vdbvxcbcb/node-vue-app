<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">影片资金后台管理系统</span>
      </div>
      <el-form
        label-position="top"
        :model="loginUser"
        :rules="rules"
        ref="loginForm"
        class="loginForm"
        label-width="60px"
        hide-required-asterisk
      >
        <div class="login_title">
          <h3>账号密码登录</h3>
        </div>
        <el-form-item label="邮箱" prop="email" style="margin-bottom: 10px;">
          <el-input
            v-model="loginUser.email"
            prefix-icon="el-icon-message"
            placeholder="邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="margin-bottom: 10px;">
          <el-input
            v-model="loginUser.password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            :type="pwdType"
          >
            <i
              slot="suffix"
              title="显示或隐藏密码"
              :class="showPwd"
              :style="{ color: '#409eff', cursor: 'pointer' }"
              @click="togglePwd"
            >
            </i>
          </el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="inputCaptcha"
          style="margin-bottom: 21px;"
        >
          <div class="verification">
            <el-input
              prefix-icon="el-icon-key"
              v-model="loginUser.inputCaptcha"
              placeholder="验证码"
            ></el-input>
            <img
              width="80"
              style="background:#EEE9E9;margin-left:30px;cursor:pointer;"
              ref="captcha"
              height="40"
              src="http://localhost:5001/api/users/getCaptcha"
              @click="refreshCaptcha"
            />
          </div>
        </el-form-item>
        <div class="remember_pwd">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <div class="login_btn">
          <el-button
            type="primary"
            @click="submitForm('loginForm')"
            class="submit_btn"
            >登 录
          </el-button>
        </div>
        <div class="tip_area">
          <p><router-link to="/forgot">忘记密码</router-link></p>
          <p><router-link to="/register">还没有账号？现在注册</router-link></p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import bus from '../components/bus'
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js'
export default {
  name: 'login',
  data() {
    const validateCaptcha = (rule, value, callback) => {
      if (!this.loginUser.inputCaptcha.trim().length) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      loginUser: {
        email: '',
        password: '',
        inputCaptcha: '',
      },
      pwdType: 'password',
      isShowPwd: false,
      checked: false,
      reminder: null,
      rules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '密码长度为 6 到 10 个字符',
            trigger: 'blur',
          },
        ],
        inputCaptcha: [
          { required: true, validator: validateCaptcha, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    showPwd() {
      return this.isShowPwd ? 'third-icon-alieye' : 'third-icon-alino_eye'
    },
  },
  created() {
    bus.$on('userLogout', this.loadAccountInfo())
  },
  mounted() {
    // console.log('mounted调用了')
    // this.showTip()
    bus.$on('refreshCaptcha', this.refreshCaptcha())
  },
  methods: {
    togglePwd() {
      this.pwdType === 'password'
        ? (this.pwdType = '')
        : (this.pwdType = 'password')
      this.isShowPwd = !this.isShowPwd
    },
    // showTip() {
    //   const h = this.$createElement
    //   this.reminder = this.$notify({
    //     title: '提示',
    //     message: h(
    //       'i',
    //       { style: 'color: teal' },
    //       '管理员账号和员工账号分别为：123452@qq.com 和 123453@qq.com，密码为邮箱账号名，注册和忘记密码需真实邮箱'
    //     ),
    //     duration: 5000,
    //     iconClass: 'el-icon-s-opportunity',
    //   })
    //   // console.log('提示调用了')
    // },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.loginUser.inputCaptcha)
          // console.log(this.getCookie("captcha"))
          // 验证 验证码与邮箱、密码
          this.$axios
            .post('/api/users/login', this.loginUser)
            .then((res) => {
              if (res.data.error) {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                })
                this.refreshCaptcha()
              }
              // 登录成功
              // 获取响应的 token
              const { token } = res.data
              // 将 token 存放到 localStorage
              localStorage.setItem('eleToken', token)
              // 使用 jwt_decode 解析token
              const decode = jwt_decode(token)
              // token 存储到 Vuex 中
              // decode 不为空时才授权，将 Vuex 的 state 的 isAuthenticated 设为 true
              this.$store.dispatch('setIsAuthenticated', !this.isEmpty(decode))
              // 将 token 存储到 Vuex 的 state 的 user 里
              this.$store.dispatch('setUser', decode)
              this.$message.success('登录成功')
              // 页面跳转
              this.$router.push('/index')
              if (this.reminder) {
                this.reminder.close()
              }
              this.reminder = null
            })
            .catch((err) => {
              console.log('Error', err)
            })
          //定义要存入cookie的对象
          let accountInfo = ''
          // 拿到输入框中的密码，使用AES加密
          let pwd = this.loginUser.password
          let newPwd = CryptoJS.AES.encrypt(pwd, 'secret key 123')
          // 若勾选记住密码
          if (this.checked === true) {
            // console.log('选择记住密码，checked == true')
            accountInfo = this.loginUser.email + '&' + newPwd //将加密后的密码存入cookie对象中
            this.setUserCookie('accountInfo', accountInfo, 1440 * 7) //传入账号名，密码，和保存天数3个参数（7天）
          } else {
            // console.log('清空Cookie')
            this.clearUserCookie('accountInfo') // 清空Cookie
          }
        }
      })
    },
    // 工具函数，判断 token 是否为空，如果为空则为 true
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      )
    },
    // 刷新验证码
    refreshCaptcha() {
      this.loginUser.inputCaptcha = ''
      this.$refs.captcha.src =
        'http://localhost:5001/api/users/getCaptcha?d=' + Math.random()
    },
    // 获取验证码cookie
    getCookie(cname) {
      let name = cname + '='
      let ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim()
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
      }
      return ''
    },
    setUserCookie(cookieName, value, expiremMinutes) {
      var exdate = new Date()
      exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000)
      document.cookie =
        cookieName +
        '=' +
        escape(value) +
        (expiremMinutes == null ? '' : ';expires=' + exdate.toGMTString())
    },
    getUserCookie(cookieName) {
      if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(cookieName + '=')
        if (c_start != -1) {
          c_start = c_start + cookieName.length + 1
          var c_end = document.cookie.indexOf(';', c_start)
          if (c_end == -1) c_end = document.cookie.length
          return unescape(document.cookie.substring(c_start, c_end))
        }
      }
      return ''
    },
    clearUserCookie(cookieName) {
      var exp = new Date()
      exp.setTime(exp.getTime() - 1)
      var cval = this.getCookie(cookieName)
      if (cval != null) {
        document.cookie =
          cookieName + '=' + cval + ';expires=' + exp.toGMTString()
      }
    },
    //预读取cookie中用户信息
    loadAccountInfo() {
      let self = this
      //admin%26U2FsdGVkX1+/ZtAGWFVi37gNwA7TUZmQM+yazInCPxs%3D
      let accountInfo = self.getUserCookie('accountInfo')
      // 如果cookie里没有账号信息
      if (Boolean(accountInfo) === false) {
        // console.log('cookie中没有检测到用户账号信息！')
        return false
      } else {
        // 如果cookie里有账号信息
        // console.log('cookie中检测到账号信息！现在开始预填写！')
        let userEmail = ''
        let pwd = ''
        let index = accountInfo.indexOf('&')
        userEmail = accountInfo.substring(0, index)
        pwd = accountInfo.substring(index + 1) // 拿到加密后的密码
        // 解密
        let bytes = CryptoJS.AES.decrypt(pwd.toString(), 'secret key 123')
        // 拿到解密后的密码（登录时输入的密码）
        let newPwd = bytes.toString(CryptoJS.enc.Utf8)
        self.loginUser.email = userEmail
        self.loginUser.password = newPwd
        self.checked = true
      }
    },
  },
}
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/login-bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 5%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
}
.manage_tip {
  text-align: center;
}
.manage_tip .title {
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 26px;
  color: #111;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 25px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.login_title {
  margin-bottom: 7px;
  text-align: center;
  color: #505458;
}
.verification {
  display: flex;
  justify-content: space-between;
}
.remember_pwd {
  text-align: left;
  margin-bottom: 20px;
  color: rgb(64, 158, 255);
}
.login_btn {
  margin-bottom: 20px;
}
.submit_btn {
  width: 100%;
}
.tip_area {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #333;
}
.tip_area a {
  color: #409eff;
}
.el-form--label-top >>> .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 0 0px;
}
</style>
<style>
.el-notification {
  width: auto !important;
}
.el-notification .el-icon-s-opportunity {
  color: #ffc107;
  font-size: 22px;
  margin-top: 2px;
}
.el-notification__title {
  margin: 5px 0px;
}
.el-notification__content {
  display: flex;
  width: 270px !important;
  justify-content: center;
}
</style>
