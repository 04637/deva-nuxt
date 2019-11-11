<template>
  <div>
    <v-layout v-if="items && items.length > 0" align-center
      ><v-icon small color="new_orange">mdi-meteor</v-icon>&nbsp;<span
        class="my_gray--text"
        >{{ keywords || tagKeywords ? '相关' : '热门' }}推荐</span
      ></v-layout
    >
    <div class="with-bg py-1 px-2 mt-2">
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
              class="hover-color"
              :class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
              style="font-size: 0.9rem; text-decoration: none"
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
<style>
.theme--light .with-bg {
  background-color: rgba(231, 231, 231, 0.35);
}
.theme--dark .with-bg {
  background-color: rgba(75, 75, 75, 0.35);
}
.hover-color:hover {
  color: #01a687 !important;
}
</style>
