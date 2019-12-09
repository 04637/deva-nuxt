<template>
  <v-layout :justify-end="justifyEnd" class="d-md-block hidden-sm-and-down">
    <v-card flat class="pa-2" :width="width">
      <v-layout align-center>
        <v-flex shrink>
          <v-avatar color="grey" tile>
            <v-img :src="user.avatar"></v-img>
          </v-avatar>
        </v-flex>
        <v-flex class="ml-3" grow>
          <v-layout align-center>
            <nuxt-link
              class="hover-line"
              :to="'/user/' + user.userId"
              style="text-decoration: none"
              >{{ user.nickname || user.username }}</nuxt-link
            ><b style="color: red">&nbsp;·&nbsp;</b
            ><span style="font-size: 12px;" title="声望">{{
              user.reputation
            }}</span>
          </v-layout>
          <v-layout>
            <small :title="$options.filters.moment(createTime)">
              {{ prefix }}于&nbsp; {{ createTime | timeago }}</small
            >
          </v-layout>
          <v-layout v-if="createTime !== modifiedTime">
            <small :title="$options.filters.moment(modifiedTime)">
              更新于&nbsp;
              {{ modifiedTime | timeago }}</small
            ></v-layout
          >
        </v-flex>
      </v-layout>
    </v-card>
    <small v-if="myBlogs && myBlogs.length > 0" class="my_gray--text mt-2 pl-2"
      >他的博文</small
    >
    <v-divider v-if="myBlogs && myBlogs.length > 0"></v-divider>
    <div v-if="myBlogs && myBlogs.length > 0" class="py-1 px-2 mt-1">
      <transition-group name="list">
        <div
          v-for="post in myBlogs"
          :key="post.blogId || post.questionId"
          class="mb-3 pl-4"
        >
          <div
            v-if="excludeId !== post.blogId && excludeId !== post.questionId"
          >
            <v-layout align-center
              ><router-link
                style="font-size: 14px;"
                class="d-block text-truncate hover-line"
                :to="'/blog/' + post.blogId"
                ><span style="font-weight:bold;" class="my_gray--text"
                  >·&nbsp;</span
                >{{ post.title }}</router-link
              >
            </v-layout>
            <small class="my_gray--text pl-3">阅读 {{ post.viewNum }}</small>
          </div>
        </div>
      </transition-group>
    </div>
  </v-layout>
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
