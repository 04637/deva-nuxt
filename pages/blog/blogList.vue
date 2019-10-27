<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-flex md7 xs4 shrink hidden-sm-and-down>
          <v-card-title class="pt-0 pb-0">
            <v-layout column>
              <v-row align="center" class="mb-2" justify="end">
                <v-btn small color="primary" to="/blog/postBlog"
                  ><v-icon small>mdi-file-document-edit-outline</v-icon
                  >发布博文</v-btn
                >
              </v-row>
              <v-row
                ><v-text-field
                  v-model="keywords"
                  translate="yes"
                  class="pt-0 mt-0 mr-2"
                  placeholder="搜索博文"
                  hide-details
                  prepend-inner-icon="search"
                  flat
                  @keyup.enter.native="searchQuestions"
                ></v-text-field
              ></v-row>
            </v-layout>
          </v-card-title>
        </v-flex>
        <v-flex md5 lg3 align-self-end>
          <v-tabs center-active height="38" @change="loadBlogs">
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
            <v-tab
              @click="
                listType = 'MY_POST'
                currentTitle = '我的发布'
              "
              >我的</v-tab
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
    listType: 'RECENT',
    blogList: null,
    keywords: null,
    hotQuestionList: null,
    currentTitle: '最新问题',
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
  created() {},
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
    scroll() {
      window.onscroll = () => {
        if (document.documentElement.scrollTop > 200) {
          this.$store.commit('setShowFooter', true)
        } else {
          this.$store.commit('setShowFooter', false)
        }

        if (!/^\/$/.test(this.$route.path)) {
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
          let _url = '/questionInfo/listQuestions'
          let _sortType = null
          if (this.listType === 'RECOMMEND') {
            _url = '/esQuestionInfo/search'
            _sortType = 'NEWEST'
          }
          this.$axios
            .$post(_url, {
              current: ++this.page.current,
              size: this.page.size,
              listType: this.listType,
              sortType: _sortType,
              keywords: this.likeKeywords
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
