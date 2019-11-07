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
                  placeholder="搜索博文"
                  hide-details
                  append-icon="search"
                  flat
                  @click:append="searchBlogs"
                  @keyup.enter.native="searchBlogs"
                ></v-text-field
                ><v-btn class="ml-5" small color="primary" to="/blog/postBlog"
                  ><v-icon small>mdi-file-document-edit-outline</v-icon
                  >发布博文</v-btn
                ></v-row
              >
            </v-layout>
          </v-card-title>
        </v-flex>
        <v-flex md6 lg4 align-self-end>
          <v-tabs
            v-if="search.flag"
            grow
            centered
            center-active
            height="38"
            @change="searchBlogs"
          >
            <v-tab @click="listType = 'RELEVANCE'">相关</v-tab>
            <v-tab @click="listType = 'NEWEST'">最新</v-tab>
            <v-tab @click="listType = 'ACTIVE'">活跃</v-tab>
          </v-tabs>
          <v-tabs
            v-else
            v-model="currentTab"
            grow
            centered
            center-active
            height="38"
            @change="loadBlogs"
          >
            <v-tab
              @click="
                listType = 'RECENT'
                currentTitle = '最新博文'
              "
              >最新</v-tab
            >
            <v-tab @click="clickRecommend">推荐 </v-tab>
            <v-tab
              @click="
                listType = 'WEEK_HOT'
                currentTitle = '一周热门'
              "
              >周榜</v-tab
            >
            <v-tab
              @click="
                listType = 'MONTH_HOT'
                currentTitle = '月度榜单'
              "
              >月榜</v-tab
            >
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center justify-space-around class="mt-4">
      <v-flex xs11 lg9 justify-start shrink>
        <BlogCardList v-if="blogList" :blog-list="blogList"></BlogCardList>
      </v-flex>
      <v-flex lg2 justify-end shrink hidden-md-and-down class="ml-3">
        <HotTag></HotTag>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import HotTag from '../../components/HotTag'
import BlogCardList from '../../components/BlogCardList'
export default {
  components: { BlogCardList, HotTag },
  data: () => ({
    currentTab: 0,
    listType: 'RECENT',
    search: {
      flag: false
    },
    blogList: null,
    keywords: null,
    hotBlogList: null,
    likeKeywords: null,
    page: {
      current: 1,
      size: 15
    },
    loadMore: {
      isLoading: false,
      noMore: false
    }
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
      let _url = '/blogInfo/listBlogs'
      let _sortType = null
      if (this.listType === 'RECOMMEND') {
        _url = '/esBlogInfo/search'
        _sortType = 'NEWEST'
      }
      this.$axios
        .$post(_url, {
          current: this.page.current,
          size: this.page.size,
          listType: this.listType,
          sortType: _sortType,
          keywords: this.likeKeywords
        })
        .then((resp) => {
          if (resp.succeed) {
            if (this.listType === 'RECOMMEND') {
              this.blogList = resp.data.content
            } else {
              this.blogList = resp.data.records
            }
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
    clickRecommend() {
      if (!this.$store.getters.getUserInfo) {
        this.$router.push('/user/login')
      } else {
        this.listType = 'RECOMMEND'
        this.currentTitle = '推荐'
      }
    },
    searchBlogs() {
      if (!this.keywords) {
        this.search.flag = false
        this.listType = 'RECENT'
        this.loadBlogs()
        return
      }
      if (!this.search.flag) {
        this.listType = 'RELEVANCE'
        this.search.flag = true
        return
      }
      // 第一次搜索
      this.search.flag = true
      const _url = '/esBlogInfo/search'
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post(_url, {
          keywords: this.keywords,
          current: this.page.current,
          size: this.page.size,
          sortType: this.listType
        })
        .then((resp) => {
          if (resp.succeed) {
            this.blogList = resp.data.content
          } else {
            this.blogList = []
          }
        })
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
          this.loadMore.isLoading = true
          let _url = '/blogInfo/listBlogs'
          let _sortType = null
          if (this.listType === 'RECOMMEND') {
            _url = '/esBlogInfo/search'
            _sortType = 'NEWEST'
            this.keywords = this.likeKeywords
          } else if (this.search.flag) {
            _url = '/esBlogInfo/search'
            _sortType = this.listType
          }
          this.$axios
            .$post(_url, {
              current: ++this.page.current,
              size: this.page.size,
              listType: this.listType,
              sortType: _sortType,
              keywords: this.keywords
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                if (this.listType === 'RECOMMEND') {
                  this.blogList = this.blogList.concat(resp.data.content)
                } else {
                  this.blogList = this.blogList.concat(resp.data.records)
                }
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
