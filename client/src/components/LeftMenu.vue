<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="collapse"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff"
        :unique-opened="false"
        mode="vertical"
        :collapse-transition="true"
      >
        <!-- 数据结构：一个数组包含两个对象，两个对象有包含自己的子集（数组） -->
        <router-link to="/home">
          <el-menu-item index="home">
            <i class="fa fa-margin el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </router-link>
        <template v-for="item in items">
          <el-submenu v-if="item.children" :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="'fa fa-margin ' + item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <router-link
              v-for="(citem, cindex) in item.children"
              :to="citem.path"
              :key="cindex"
            >
              <el-menu-item :index="citem.path">
                <span slot="title">{{ citem.name }}</span>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </template>
        <router-link to="/tabs">
          <el-menu-item index="tabs">
            <i class="fa fa-margin el-icon-s-comment"></i>
            <span slot="title">消息</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import bus from './bus'
export default {
  name: 'left-menu',
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-s-finance',
          name: '资金管理',
          path: 'fund',
          children: [{ path: 'fundlist', name: '资金流水' }],
        },
        {
          icon: 'el-icon-s-order',
          name: '信息管理',
          path: 'info',
          children: [{ path: 'info', name: '个人信息' }],
        },
      ],
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  },
}
</script>

<style scoped>
.menu_page {
  position: absolute;
  top: 70px;
  left: 0;
  min-height: 600px;
  /*问题 一定要设置好最小高度，收缩侧边栏高度才不会变小 */
  background-color: #324057;
  /* z-index: 2; */
}
.el-menu {
  border: none;
}
.fa {
  font-size: 18px;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 600px;
  /*问题 一定要设置好宽度，展开侧边栏过渡动画才不会有白框的问题 */
  /*问题 一定要设置好最小高度，收缩侧边栏过渡动画才不会有上下不一致、缺边的问题 */
}
/* 
不能乱改折叠侧边栏收缩的宽度，否则展开宽度不够则会出现白边
.el-menu-vertical-demo {
  width: 80px;
} */
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}

a {
  text-decoration: none;
}
</style>
