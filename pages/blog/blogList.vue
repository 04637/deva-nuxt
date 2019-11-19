<template>
  <v-app>
    <v-layout column shrink>
      <v-layout class="mt-4">
        <v-flex
          md6
          xs3
          shrink
          hidden-sm-and-down
          style="position: relative; top: 8px"
        >
          <v-card-title class="pt-0 pb-0">
            <v-layout column>
              <v-row align="end" class="mb-2" justify="start">
                <v-text-field
                  v-model="keywords"
                  style="max-width: 50%"
                  translate="yes"
                  class="pt-0 mt-0 mr-2"
                  hide-details
                  append-icon="search"
                  flat
                  clearable
                  @click:append="searchBtn"
                  @keyup.enter.native="searchBtn"
                ></v-text-field
              ></v-row>
            </v-layout>
          </v-card-title>
        </v-flex>
        <v-flex md6 lg4 align-self-end>
          <v-tabs
            v-model="currentTab"
            grow
            centered
            center-active
            height="38"
            @change="loadBlogs"
          >
            <v-tab
              @click="
                sortType = 'RECENT'
                currentTitle = '最新博文'
              "
              >{{ keywords ? '相关' : '最新' }}</v-tab
            >
            <v-tab @click="clickRecommend">推荐 </v-tab>
            <v-tab
              @click="
                sortType = 'ACTIVE'
                currentTitle = '热度'
              "
              >热度</v-tab
            >
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <span class="my_gray--text" style="font-size: 0.7rem"
        >找到相关结果约 {{ totalElements }} 个</span
      >
    </v-layout>
    <v-layout justify-center justify-space-around class="mt-4">
      <v-flex xs12 sm11 lg9 justify-start shrink>
        <BQCardList v-if="blogList" :bq-list="blogList"></BQCardList>
      </v-flex>
      <v-flex lg2 justify-end shrink hidden-md-and-down class="ml-3">
        <HotTag :load-hot="false"></HotTag><RelatePost></RelatePost>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import HotTag from '../../components/HotTag'
import BQCardList from '../../components/BQCardList'
import RelatePost from '../../components/RelatePost'
export default {
  components: { RelatePost, BQCardList, HotTag },
  data: () => ({
    currentTab: 0,
    sortType: 'RECENT',
    blogList: null,
    keywords: null,
    likeKeywords: null,
    page: {
      current: 1,
      size: 15
    },
    loadMore: {
      isLoading: false,
      noMore: false
    },
    totalElements: 0
  }),
  created() {
    this.loadBlogs()
  },
  mounted() {
    this.loadLikeTags()
    this.scroll()
  },
  methods: {
    loadBlogs() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      if (this.sortType === 'RECENT' && this.keywords) {
        this.sortType = 'RELEVANCE'
      }
      this.$axios
        .$post('es/search', {
          current: this.page.current,
          size: this.page.size,
          sortType: this.sortType,
          keywords:
            this.sortType === 'RECOMMEND' ? this.likeKeywords : this.keywords,
          indices: 'BLOG'
        })
        .then((resp) => {
          if (resp.succeed) {
            this.blogList = resp.data.content
            this.totalElements = resp.data.totalElements
          } else {
            this.blogList = []
          }
        })
    },
    loadLikeTags() {
      if (this.$store.getters.getUserId) {
        this.$axios.$post('/tagLike/listLikeTags').then((resp) => {
          let likeTags = resp.data
          const randTag = []
          if (likeTags.length > 5) {
            for (let i = 0; i < 5; ++i) {
              const rand = Math.floor(Math.random() * likeTags.length)
              randTag.push(likeTags[rand])
            }
            likeTags = randTag
          }
          this.likeKeywords = likeTags.map((item) => item.tagName).join(' ')
        })
      }
    },
    searchBtn() {
      this.currentTab = 0
      this.sortType = 'RECENT'
      this.loadBlogs()
    },
    clickRecommend() {
      if (!this.$store.getters.getUserInfo) {
        this.$router.push('/user/login')
      } else {
        this.sortType = 'RECOMMEND'
        this.currentTitle = '推荐'
      }
    },
    scroll() {
      window.onscroll = () => {
        if (document.documentElement.scrollTop > 200) {
          this.$store.commit('setShowFooter', true)
        } else {
          this.$store.commit('setShowFooter', false)
        }

        if (!/\/blogList$/.test(this.$route.path)) {
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
          if (this.sortType === 'RECENT' && this.keywords) {
            this.sortType = 'RELEVANCE'
          }
          this.loadMore.isLoading = true
          this.$axios
            .$post('/es/search', {
              current: ++this.page.current,
              size: this.page.size,
              sortType: this.sortType,
              keywords:
                this.sortType === 'RECOMMEND'
                  ? this.likeKeywords
                  : this.keywords,
              indices: 'BLOG'
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.blogList = this.blogList.concat(resp.data.content)
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
