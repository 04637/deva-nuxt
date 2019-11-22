<template>
  <v-app dark>
    <v-layout justify-center align-start style="margin-top:20vh">
      <v-layout justify-center style="height: 100%">
        <v-flex xs11 md6 lg4>
          <v-layout justify-center>
            <div v-if="error.statusCode === 404">
              <svg class="icon" style="width: 200px; height: 100px;">
                <use xlink:href="#icon-undraw_page_not_found_suk"></use>
              </svg>
            </div>
            <h1 v-else class="display-3">
              <strong>{{ error.statusCode }}</strong>
            </h1>
          </v-layout>
          <v-layout justify-center class="mt-5">
            <h3>
              {{ error.statusCode === 404 ? pageNotFound : otherError }}
            </h3>
          </v-layout>
          <v-layout justify-center align-end class="mt-5">
            <v-btn to="/" width="100%" color="primary">
              <strong>回到主页</strong>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  row: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data() {
    return {
      pageNotFound: '您查找的资源不存在，可能已被删除',
      otherError: '系统异常，请联系管理员 admin@aid.dev'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
