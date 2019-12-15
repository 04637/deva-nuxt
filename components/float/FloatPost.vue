<template>
  <client-only>
    <v-flex class="float" hidden-sm-and-down>
      <v-btn to="/question/ask" color="my_green" class="white--text" small
        ><v-icon small>mdi-forum</v-icon>&nbsp;提问题</v-btn
      >
      <br />
      <v-btn to="/blog/postBlog" color="blue" class="white--text mt-4" small
        ><v-icon small>mdi-file-document</v-icon>&nbsp;写文章</v-btn
      >
    </v-flex>
  </client-only>
</template>

<script>
export default {}
</script>

<style scoped>
.float {
  position: fixed;
  right: 30px;
  bottom: 550px;
}
</style>
