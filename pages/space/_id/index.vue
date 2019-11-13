<template>
  <v-app>
    <v-layout column shrink>
      <v-layout v-if="spaceInfo">
        <v-flex md6 xs3 shrink hidden-sm-and-down>
          <v-card-title class="pt-0 pb-0">
            <v-layout column>
              <v-row align="center" justify="start">
                <SpaceMenu :space-info="spaceInfo"></SpaceMenu>
                <v-icon small>mdi-feather</v-icon>
                <v-btn
                  class="ml-2"
                  :to="
                    '/question/ask?spaceId=' +
                      spaceInfo.spaceId +
                      '&spaceName=' +
                      spaceInfo.spaceName
                  "
                  small
                  text
                  color="primary"
                  >发布问题</v-btn
                ><v-divider vertical></v-divider>
                <v-btn
                  small
                  :to="
                    '/blog/postBlog?spaceId=' +
                      spaceInfo.spaceId +
                      '&spaceName=' +
                      spaceInfo.spaceName
                  "
                  text
                  color="blue"
                  >撰写文章</v-btn
                >
              </v-row>
              <v-row
                ><v-text-field
                  v-model="keywords"
                  style="max-width: 60%"
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
            centered
            center-active
            height="38"
            grow
            @change="loadBQ"
          >
            <v-tab @click="sortType = 'RECENT'">{{
              keywords ? '相关' : '最新'
            }}</v-tab>
            <v-tab @click="sortType = 'RECOMMEND'">推荐</v-tab>
            <v-tab @click="sortType = 'ACTIVE'">热度</v-tab>
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
        <BQCardList v-if="bqList" :bq-list="bqList"> </BQCardList>
      </v-flex>
      <v-flex lg2 justify-end shrink hidden-md-and-down class="ml-3">
        <v-textarea
          v-if="spaceInfo"
          v-model="spaceInfo.description"
          solo
          readonly
          no-resize
          style="font-size: 0.9rem"
        >
        </v-textarea>
        <HotTag :load-hot="false"></HotTag>
        <RelatePost></RelatePost>
      </v-flex>
    </v-layout>
    <InfoDialog
      :msg="['退出成功', '退出失败']"
      :succeed="
        confirmExit.result.resp != null && confirmExit.result.resp.succeed
      "
      :dialog="confirmExit.result.dialog"
      @update:dialog="
        confirmExit.result.dialog = $event
        $router.push('/')
      "
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import InfoDialog from '../../../components/InfoDialog'
import HotTag from '../../../components/HotTag'
import BQCardList from '../../../components/BQCardList'
import RelatePost from '../../../components/RelatePost'
import SpaceMenu from '../../../components/SpaceMenu'
export default {
  components: {
    SpaceMenu,
    RelatePost,
    BQCardList,
    HotTag,
    InfoDialog
  },
  data: () => ({
    sortType: 'RECENT',
    currentTab: 0,
    bqList: null,
    blogList: null,
    keywords: null,
    likeKeywords: null,
    confirmExit: {
      dialog: false,
      result: {
        dialog: false,
        resp: null
      }
    },
    spaceInfo: null,
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
    this.loadLikeTags()
    this.loadSpaceInfo()
    this.loadBQ()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    loadBQ() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      if (this.sortType === 'RECENT' && this.keywords) {
        this.sortType = 'RELEVANCE'
      }
      this.$axios
        .$post('/es/searchFromSpace', {
          current: this.page.current,
          size: this.page.size,
          sortType: this.sortType,
          keywords:
            this.sortType === 'RECOMMEND' ? this.likeKeywords : this.keywords,
          spaceId: this.$route.params.id
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
    loadSpaceInfo() {
      this.$axios
        .$post('/spaceInfo/getSpaceInfo', {
          spaceId: this.$route.params.id
        })
        .then((resp) => {
          if (resp.succeed) {
            this.spaceInfo = resp.data
          }
        })
        .catch((e) => {
          this.$router.push('/')
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
      this.loadBQ()
    },
    scroll() {
      window.onscroll = () => {
        if (!/\/space\/\d+/.test(this.$route.path)) {
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
            .$post('/es/searchFromSpace', {
              current: ++this.page.current,
              size: this.page.size,
              sortType: this.sortType,
              keywords:
                this.sortType === 'RECOMMEND'
                  ? this.likeKeywords
                  : this.keywords,
              spaceId: this.$route.params.id
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
