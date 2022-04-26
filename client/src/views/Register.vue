<template>
  <div class="register">
    <section class="form_title">
      <div class="manage_title">
        <span class="title">影片资金后台管理系统</span>
        <!-- 主要修改 :model rules ref v-model prop 添加 placeholder 与 html 代码无异-->
        <el-form
          :model="registerUser"
          :rules="rules"
          ref="registerForm"
          label-width="80px"
          class="registerForm"
          hide-required-asterisk
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="registerUser.name"
              prefix-icon="el-icon-user"
              placeholder="请输入用户名"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="email"
              v-model="registerUser.email"
              prefix-icon="el-icon-message"
              placeholder="请输入邮箱"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              :type="pwdType"
              v-model="registerUser.password"
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
              v-model="registerUser.password2"
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
          <el-form-item label="选择身份">
            <el-select
              v-model="registerUser.identity"
              placeholder="请选择身份"
              class="select-identity"
            >
              <el-option label="管理员" value="manager"></el-option>
              <el-option label="员工" value="employee"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode">
            <div class="vertify">
              <el-input
                prefix-icon="el-icon-key"
                v-model="registerUser.verifyCode"
                placeholder="验证码"
                auto-complete="off"
              ></el-input>
              <el-button
                type="primary"
                plain
                @click="getCode('registerForm')"
                :disabled="isDisabled"
                class="emailcode"
              >
                {{ btnMsg }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click="submitForm('registerForm')"
            >
              注册
            </el-button>
          </el-form-item>
          <div class="tip_area">
            <p><router-link to="/login">已有账号？马上登录</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'register',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
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
      registerUser: {
        name: '',
        email: '',
        password: '',
        password2: '',
        identity: '',
        verifyCode: '',
      },
      rules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '用户名长度必须在2到8之间',
            trigger: 'blur',
          },
        ],
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
        identity: [
          { required: true, message: '请选择身份', trigger: 'change' },
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
            .get('/api/users/getRegisterCode', {
              params: {
                email: this.registerUser.email,
              },
            })
            .then((res) => {
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
            .catch((err) => {
              this.$message({
                message: '系统错误!',
                type: 'error',
              })
              //  console.log('Error', err)
            })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.$axios
          .post('/api/users/register', this.registerUser)
          .then((res) => {
            if (res.data.success) {
              this.$message({
                message: '账号注册成功',
                type: 'success',
              })
              this.$router.push('/login')
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
              })
            }
          })
          .catch((err) => {
            this.$message({
              message: '邮箱已注册!',
              type: 'error',
            })
            this.$router.push('/register')
          })
      })
    },
  },
}
</script>

<style scoped>
.register {
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
.form_title .title {
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 26px;
  color: #111;
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
.tip_area {
  text-align: left;
  font-size: 12px;
  color: #333;
}
.tip_area a {
  color: #409eff;
}
.submit_btn {
  width: 100%;
}
</style>
<style>
.select-identity input {
  padding-left: 30px;
}
</style>
