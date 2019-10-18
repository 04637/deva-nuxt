<template>
  <v-app dark>
    <v-layout justify-center align-start style="margin-top:20vh">
      <v-card width="50vw" height="30vh" min-height="200px" class="pa-5">
        <v-layout justify-center style="height: 100%">
          <v-layout justify-space-between column>
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
            <v-layout justify-center>
              <h3>
                {{ error.statusCode === 404 ? pageNotFound : otherError }}
              </h3>
            </v-layout>
            <v-layout justify-center align-end>
              <v-btn to="/" width="100%" color="primary">
                <strong>回到主页</strong>
              </v-btn>
            </v-layout>
          </v-layout>
        </v-layout>
      </v-card>
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
