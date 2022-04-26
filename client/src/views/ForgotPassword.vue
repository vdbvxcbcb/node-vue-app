<template>
  <div class="forgotpwd">
    <section class="form_title">
      <div class="manage_title">
        <span class="title">影片资金后台管理系统</span>
        <!-- 主要修改 :model rules ref v-model prop 添加 placeholder 与 html 代码无异-->
        <el-form
          :model="forgotPass"
          :rules="rules"
          ref="forgotPassForm"
          label-width="80px"
          class="registerForm"
          hide-required-asterisk
          @submit.native.prevent="forgetPass('forgotPassForm')"
        >
          <div class="forgot_title">
            <h3>忘记密码</h3>
          </div>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="forgotPass.email"
              prefix-icon="el-icon-message"
              placeholder="请输入邮箱"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              :type="pwdType"
              v-model="forgotPass.password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
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
          <el-form-item label="确认密码" prop="password2">
            <el-input
              :type="pwdType"
              v-model="forgotPass.password2"
              prefix-icon="el-icon-lock"
              placeholder="请确认密码"
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
          <el-form-item label="验证码" prop="verifyCode">
            <div class="vertify">
              <el-input
                prefix-icon="el-icon-key"
                v-model="forgotPass.verifyCode"
                placeholder="验证码"
                auto-complete="off"
              ></el-input>
              <el-button
                type="primary"
                plain
                @click="getCode('forgotPassForm')"
                :disabled="isDisabled"
                class="emailcode"
              >
                {{ btnMsg }}
              </el-button>
            </div>
          </el-form-item>
          <div class="forgot_button">
            <el-button type="primary" native-type="submit" class="confirm"
              >确定</el-button
            >
          </div>
          <div class="tip_area">
            <router-link to="/">想起密码，登录</router-link>
            <p>注：若未收到验证码，请查看垃圾箱</p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'forgot',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.forgotPass.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      pwdType: 'password',
      isShowPwd: false,
      btnMsg: '获取邮箱验证码',
      isDisabled: false,
      time: 30,
      forgotPass: {
        email: '',
        password: '',
        password2: '',
        verifyCode: '',
      },
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
            message: '密码长度必须在6到10之间',
            trigger: 'blur',
          },
        ],
        password2: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '确认密码长度必须在6到10之间',
            trigger: 'blur',
          },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    showPwd() {
      return this.isShowPwd ? 'third-icon-alieye' : 'third-icon-alino_eye'
    },
  },
  methods: {
    togglePwd() {
      this.pwdType === 'password'
        ? (this.pwdType = '')
        : (this.pwdType = 'password')
      this.isShowPwd = !this.isShowPwd
    },
    // 验证码发送
    getCode(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .get('/api/users/getEmailCode', {
              params: {
                email: this.forgotPass.email,
              },
            })
            .then((res) => {
              // console.log(res)
              if (res.data.succ) {
                this.$message({
                  message: '邮件已发送，请查收',
                  type: 'success',
                })
                this.isDisabled = true
                let interval = setInterval(() => {
                  this.btnMsg = '' + this.time + '秒'
                  --this.time
                  if (this.time < 0) {
                    this.btnMsg = '获取邮箱验证码'
                    this.time = 30
                    this.isDisabled = false
                    clearInterval(interval)
                  }
                }, 1000)
              }
            })
        }
      })
    },
    // 修改密码
    forgetPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .put('/api/users/resetPass', this.forgotPass)
            .then((res) => {
              // console.log(res)
              if (res.data.success) {
                this.$message({
                  message: res.data.message,
                  type: 'success',
                })
                setTimeout(() => {
                  history.pushState({}, '', '/login') //跳转到登录界面
                  location.reload()
                }, 1000)
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                })
              }
            })
            .catch((err) => {
              this.$message({
                message: '系统错误!',
                type: 'error',
              })
              console.log('Error', err)
            })
        }
      })
    },
  },
}
</script>

<style scoped>
.forgotpwd {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/login-bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_title {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 5%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_title .manage_title .title {
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 26px;
  color: #111;
}
.forgot_title {
  margin-bottom: 20px;
  text-align: center;
  color: #505458;
}
.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.vertify {
  display: flex;
  justify-content: space-between;
}
.vertify >>> .emailcode {
  margin-left: 10px;
  font-size: 10px;
}
.forgot_button {
  padding-left: 80px;
}
.confirm {
  width: 100%;
}
.tip_area {
  text-align: left;
  font-size: 12px;
  color: #333;
  margin-top: 20px;
}
.tip_area a {
  color: #409eff;
}
.tip_area p {
  margin-top: 15px;
  color: gray;
}
</style>
