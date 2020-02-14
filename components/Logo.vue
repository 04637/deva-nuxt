<template>
  <div>
    <!-- logo 设计 https://www.logogenie.net/-->
    <!-- logo做头像 米色背景色 #e9e5de -->
    <!-- 雪碧图 http://www.spritecow.com/-->
    <v-layout v-if="type === 'form'" justify-center style="height: 48px;">
      <div @click="$router.push('/', () => ({}))" class="logo"></div>
    </v-layout>
    <div v-else-if="type === 'simple'" @click="$router.push('/', () => ({}))">
      <img src="/logo-transparent.png" alt="" class="logo-md" />
    </div>
    <div v-else @click="$router.push('/', () => ({}))" class="logo"></div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
<style scoped>
.logo {
  background: url('/black_logo.png') no-repeat 0 0;
  width: 115px;
  height: 48px;
  background-size: auto 50px;
  background-position: 0px;
  cursor: pointer;
  margin: 0 auto;
}
.logo-md {
  height: 47px;
  display: block;
  cursor: pointer;
}
</style>
