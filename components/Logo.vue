<template>
  <!-- logo 设计 https://www.logogenie.net/-->
  <!-- 雪碧图 http://www.spritecow.com/-->
  <v-layout v-if="type === 'form'" justify-center style="height: 48px">
    <div class="logo" @click="$router.push('/', () => ({}))"></div>
  </v-layout>
  <div v-else-if="type === 'simple'" @click="$router.push('/', () => ({}))">
    <img src="/deva2.png" alt="" class="logo-md" />
  </div>
  <div v-else class="logo" @click="$router.push('/', () => ({}))"></div>
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
  background: url('/logo2.png') no-repeat 0 0;
  width: 140px;
  height: 48px;
  background-size: auto 115px;
  background-position: -40px;
  cursor: pointer;
  margin: 0 auto;
}
</style>
