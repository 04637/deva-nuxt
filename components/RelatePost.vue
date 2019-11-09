<template>
  <div>
    <v-layout v-if="items && items.length > 0" align-center
      ><v-icon small color="orange">mdi-meteor</v-icon>&nbsp;<span
        >{{ keywords || tagKeywords ? '相关' : '热门' }}推荐</span
      ></v-layout
    >
    <transition-group name="list">
      <div
        v-for="post in items"
        :key="post.blogId || post.questionId"
        class="mt-4"
      >
        <v-layout
          v-if="excludeId !== post.blogId && excludeId !== post.questionId"
          align-center
          ><router-link
            class="hover-line"
            style="font-size: 0.9rem;"
            :to="
              post.blogId
                ? '/blog/' + post.blogId
                : '/question/' + post.questionId
            "
            >{{ post.title }}</router-link
          ></v-layout
        >
      </div>
    </transition-group>
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
