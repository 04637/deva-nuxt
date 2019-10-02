<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    fixed
    direction="left"
    open-on-hover
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" color="primary" fab>
        <v-icon v-if="fab" title="回到顶部">vertical_align_top</v-icon>
        <v-icon v-else>mdi-comment-text</v-icon>
      </v-btn>
    </template>
    <v-btn fab dark small color="green">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn fab dark small color="indigo">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn fab dark small color="red">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>
<script>
export default {
  data: () => ({
    fab: false
  })
}
</script>
<style>
.v-speed-dial {
  bottom: 70px !important;
  right: 40px !important;
}
.v-btn-floating {
  position: relative;
}
</style>
