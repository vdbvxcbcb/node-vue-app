<template>
  <div class="home">
    <div class="container">
      <h1 class="title">电 影</h1>
      <p class="slogan"></p>
    </div>
  </div>
</template>

<script>
import Typed from 'typed.js'
export default {
  name: 'home',
  mounted() {
    let typed = new Typed('.slogan', {
      strings: ['窗户和镜子、故事和梦'],
      typeSpeed: 250,
      backSpeed: 250,
      loop: true,
    })
  },
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  background: url(../assets/showcase.jpg) no-repeat center center;
  background-size: 100% 100%;
  overflow: hidden;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
.title {
  font-size: 30px;
}
.slogan {
  display: inline-block;
  margin-top: 50px;
  font-size: 22px;
}
</style>
