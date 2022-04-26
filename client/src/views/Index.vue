<template>
  <div class="index">
    <Header-Nav></Header-Nav>
    <!-- 其实样式绑定放到 LeftMenu 的 <el-row> 也是一样的-->
    <Left-Menu :class="{ 'menu-collapse': collapse }"></Left-Menu>
    <!-- router-view 渲染 Index.vue 的子路由组件 -->
    <!-- 右侧内容区 -->
    <div class="rightContainer" :class="{ 'content-collapse': collapse }">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import HeaderNav from '../components/HeaderNav'
import LeftMenu from '../components/LeftMenu'
import bus from '../components/bus'
export default {
  name: 'index',
  components: {
    HeaderNav,
    LeftMenu,
  },
  data() {
    return {
      collapse: false,
    }
  },
  created() {
    bus.$on('collapse-content', (msg) => {
      this.collapse = msg
    })
  },
}
</script>

<style scoped>
.index {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rightContainer {
  position: absolute;
  top: 70px;
  left: 180px;
  right: 0;
  bottom: 0;
  transition: ease-in-out all 0.3s;
  overflow: auto;
}
.move-enter-active,
.move-leave-active {
  transition: opacity 0.3s;
}
.move-enter,
.move-leave {
  opacity: 0;
}
.content-collapse {
  left: 64px;
  /* transition: ease-in-out all .3s; */
  /* transition: ease-in-out all .3s; */
  /*问题 控制右边内容宽度不超出 */
}
.menu-collapse {
  width: 64px;
  /* 不能乱改折叠侧边栏收缩的宽度，否则展开宽度不够则会出现白边 */
}
</style>
