<template>
  <v-app v-show="tagList">
    <v-layout style="min-width: 200px;max-width:400px" shrink>
      <v-text-field
        v-model="searchKey"
        @click:append="loadTagList"
        @keyup.enter.native="loadTagList"
        hide-details
        placeholder="搜索标签"
        append-icon="search"
        rounded
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap shrink class="mt-3" justify-space-around>
      <tag-card
        v-for="tagInfo in tagList"
        :key="tagInfo.tagId"
        :tag-info="tagInfo"
        class="mb-4 mr-2"
      ></tag-card>
    </v-layout>
  </v-app>
</template>
<script>
import TagCard from '../../components/tag/TagCard'
export default {
  components: { TagCard },
  data: () => ({
    tagList: null,
    likeTags: null,
    searchKey: null,
    page: {
      current: 1,
      size: 50
    },
    loadMore: {
      isLoading: false,
      noMore: false
    }
  }),
  computed: {},
  created() {
    this.loadTagList()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    renderLiked() {
      this.tagList.forEach((item) => {
        let liked = false
        this.likeTags.some((_item) => {
          if (_item.tagId === item.tagId) {
            liked = true
            return true
          }
        })
        this.$set(item, 'liked', liked)
      })
    },
    loadLikeTags() {
      if (this.$store.getters.getUserId) {
        this.$axios.$post('/tagLike/listLikeTags').then((resp) => {
          if (resp.succeed) {
            this.likeTags = resp.data
            this.renderLiked()
          }
        })
      }
    },
    loadTagList() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post('/tagInfo/listTags', {
          current: this.page.current,
          size: this.page.size,
          searchKey: this.searchKey
        })
        .then((resp) => {
          if (resp.succeed) {
            this.tagList = resp.data
            this.loadLikeTags()
          } else {
            this.tagList = []
          }
        })
    },
    scroll() {
      window.onscroll = () => {
        if (!/\/tags/.test(this.$route.path)) {
          return false
        }
        // 距离底部200px时加载一次
        const bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          200
        if (
          bottomOfWindow &&
          !this.loadMore.isLoading &&
          !this.loadMore.noMore
        ) {
          this.loadMore.isLoading = true
          this.$axios
            .$post('/tagInfo/listTags', {
              current: ++this.page.current,
              size: this.page.size,
              searchKey: this.searchKey
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.tagList = this.tagList.concat(resp.data)
              } else {
                this.loadMore.noMore = true
              }
            })
            .catch((e) => {
              this.loadMore.isLoading = false
            })
        }
      }
    }
  }
}
</script>

<style scoped>
.theme--light .no-shadow-box {
  box-shadow: none;
  border: 1px solid #e7e7e7;
}
.theme--dark .no-shadow-box {
  box-shadow: none;
  border: 1px solid #4b4b4b;
}
</style>
