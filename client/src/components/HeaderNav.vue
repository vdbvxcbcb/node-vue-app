<template>
  <header class="head-nav">
    <el-row>
      <!-- 一行分为 12份 -->
      <el-col :span="6" class="logo-container">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
          <i v-if="collapse" class="el-icon-s-fold"></i>
          <i v-else class="el-icon-s-unfold"></i>
        </div>
        <img src="../assets/logo.png" alt="logo" class="logo" />
        <h1 class="title">影片资金后台管理系统</h1>
      </el-col>
      <el-col :span="6" class="user">
        <div class="userinfo">
          <img class="avatar" :src="user.avatar" alt="avatar" />
          <div class="welcome">
            <p class="name comename">欢迎</p>
            <p class="name avatarname">{{ user.name }}</p>
          </div>
          <span class="username">
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                下拉菜单<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </header>
</template>

<script>
import bus from './bus'
export default {
  name: 'header-nav',
  data() {
    return {
      collapse: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  methods: {
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    // 点击指令为 info 时调用 showInfo ，点击指令为 logout 时调用 logout
    setDialogInfo(cmdItem) {
      switch (cmdItem) {
        case 'info':
          this.showInfo()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    showInfo() {
      // 跳转到个人信息页
      this.$router.push('/info')
    },
    logout() {
      bus.$emit('userLogout')
      bus.$emit('refreshCaptcha')
      // 清除 token
      localStorage.removeItem('eleToken')
      // 清除 vuex 的 state
      this.$store.dispatch('clearState')
      // 跳转到登录页
      this.$router.push('/login')
    },
  },
  mounted() {
    // 默认左侧菜单栏折叠
    if (document.body.clientWidth < 1500) {
      this.collapseChage()
    }
  },
}
</script>

<style scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
}
.collapse-btn {
  float: left;
  width: 22px;
  font-size: 18px;
  padding: 0 15px;
  cursor: pointer;
  line-height: 65px;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 40px;
  width: 40px;
  margin-left: 7px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  display: inline-block;
  vertical-align: middle;
  font-size: 22px;
  font-family: 'Microsoft YaHei';
  letter-spacing: 3px;
}
.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 16px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 16px;
}
.comename {
  font-size: 16px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.username {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
</style>
