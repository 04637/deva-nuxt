<template>
  <div class="pa-4 right-box">
    <v-layout align-center
      ><span
        class="my_gray--text d-block"
        style="border-left: 5px solid #ff6600; padding-left: 10px"
        >{{ keywords || tagKeywords ? '相关' : '热门' }}推荐</span
      ></v-layout
    >
    <v-divider class="mt-2"></v-divider>
    <div v-if="items && items.length > 0" class="py-1 px-2 mt-2">
      <transition-group name="list">
        <div
          v-for="post in items"
          :key="post.blogId || post.questionId"
          class="mb-4"
        >
          <v-layout
            v-if="excludeId !== post.blogId && excludeId !== post.questionId"
            align-center
            ><router-link
              :to="
                post.blogId
                  ? '/blog/' + post.blogId
                  : '/question/' + post.questionId
              "
              style="font-size: 14px;"
              class="d-block text-truncate hover-line"
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
    keywords: {
      required: false,
      type: String,
      default: null
    },
    tags: {
      required: false,
      type: Array,
      default: null
    },
    excludeId: {
      required: false,
      type: String,
      default: null
    }
  },
  data: () => ({
    items: [],
    tagKeywords: null
  }),
  created() {
    this.loadItems()
  },
  methods: {
    loadItems() {
      if (this.tags) {
        this.joinTags()
      }
      this.$axios
        .$post('/es/search', {
          current: 1,
          size: 10,
          sortType: 'ACTIVE',
          keywords: this.keywords || this.tagKeywords
        })
        .then((resp) => {
          if (resp.succeed) {
            this.items = resp.data.content
          }
        })
    },
    joinTags() {
      this.tagKeywords = this.tags.map((item) => item.tagName).join(' ')
    }
  }
}
</script>
