<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-flex md6 xs4 shrink hidden-sm-and-down>
          <v-card-title>{{ currentTitle }}</v-card-title>
        </v-flex>
        <v-flex md6 lg4 align-self-end>
          <v-tabs
            v-model="currentTab"
            centered
            center-active
            height="38"
            grow
            @change="loadBQ"
          >
            <v-tab
              @click="
                sortType = 'RECENT'
                currentTitle = '最新'
              "
              >最新</v-tab
            >
            <v-tab @click="clickRecommend">推荐 </v-tab>
            <v-tab
              @click="
                sortType = 'UN_RESOLVED'
                currentTitle = '待解决'
              "
              >待解决</v-tab
            >
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
      <v-flex xs11 lg9 justify-start shrink>
        <BQCardList v-if="bqList" :bq-list="bqList"></BQCardList>
      </v-flex>
      <v-flex lg2 justify-end shrink hidden-md-and-down class="ml-3">
        <HotTag :hot-size="7"></HotTag>
        <v-divider class="my-3"></v-divider>
        <RelatePost :keywords="likeKeywords"></RelatePost>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import HotTag from '../components/HotTag'
import BQCardList from '../components/BQCardList'
import RelatePost from '../components/RelatePost'
export default {
  components: { RelatePost, BQCardList, HotTag },
  data: () => ({
    currentTab: 0,
    sortType: 'RECENT',
    bqList: null,
    currentTitle: '最新',
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
    this.loadBQ()
  },
  mounted() {
    this.loadLikeTags()
    this.scroll()
  },
  methods: {
    loadBQ() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post('/es/search', {
          current: this.page.current,
          size: this.page.size,
          sortType: this.sortType,
          keywords: this.sortType === 'RECOMMEND' ? this.likeKeywords : null
        })
        .then((resp) => {
          if (resp.succeed) {
            this.bqList = resp.data.content
            this.totalElements = resp.data.totalElements
          } else {
            this.bqList = []
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
          this.$axios
            .$post('/es/search', {
              current: ++this.page.current,
              size: this.page.size,
              sortType: this.sortType,
              keywords: this.sortType === 'RECOMMEND' ? this.likeKeywords : null
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.bqList = this.bqList.concat(resp.data.content)
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
