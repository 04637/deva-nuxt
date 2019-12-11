<template>
  <div class="pa-4 right-box">
    <v-layout align-center
      ><span class="my_gray--text d-block" style="padding-left: 10px"
        >他的博文</span
      ></v-layout
    >
    <v-divider class="mt-2"></v-divider>
    <div v-if="myBlogs && myBlogs.length > 0" class="py-1 px-2 mt-2">
      <transition-group name="list">
        <div
          v-for="post in myBlogs"
          :key="post.blogId || post.questionId"
          class="mb-4"
        >
          <v-layout
            v-if="excludeId !== post.blogId && excludeId !== post.questionId"
            align-center
            ><router-link
              style="font-size: 14px;"
              class="d-block text-truncate hover-line"
              :to="
                post.blogId
                  ? '/blog/' + post.blogId
                  : '/question/' + post.questionId
              "
              ><span style="font-weight:bold;" class="my_gray--text"
                >·&nbsp;</span
              >{{ post.title }}</router-link
            ></v-layout
          >
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      required: true,
      type: Object
    },
    createTime: {
      required: true,
      type: Number
    },
    modifiedTime: {
      required: true,
      type: Number
    },
    prefix: {
      required: false,
      type: String,
      default: '创建'
    },
    justifyEnd: {
      required: false,
      type: Boolean,
      default: true
    },
    width: {
      required: false,
      type: String,
      default: ''
    },
    excludeId: {
      required: false,
      type: String,
      default: null
    }
  },
  data: () => ({
    myBlogs: null
  }),
  created() {
    this.loadMyBlogs()
  },
  methods: {
    loadMyBlogs() {
      this.$axios
        .$post('/blogInfo/listUserPublicBlogs', {
          userId: this.user.userId,
          size: 10
        })
        .then((resp) => {
          this.myBlogs = resp.data
        })
    }
  }
}
</script>
<style></style>
