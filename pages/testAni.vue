<template>
  <v-app>
    <v-layout>
      <button @click="show = !show">
        Toggle
      </button>
    </v-layout>
    <v-layout>
      <transition name="my">
        <p :key="show" style="position:absolute; top:0;left:0;">
          {{ show }}
        </p>
      </transition>
    </v-layout>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    show: false
  })
}
</script>
<style scoped>
.my-enter-active {
  transition: all 0.6s ease;
}
.my-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.my-enter
        /* .slide-my-leave-active below version 2.1.8 */ {
  transform: translateX(20px);
  opacity: 0;
}
.my-leave {
  opacity: 0;
}
.my-leave-to
        /* .slide-my-leave-active below version 2.1.8 */ {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
