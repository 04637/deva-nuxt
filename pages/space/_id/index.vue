<template>
  <v-app>
    <v-layout column shrink>
      <v-layout v-if="spaceInfo">
        <v-flex md6 xs3 shrink hidden-sm-and-down>
          <v-card-title class="pt-0 pb-0">
            <v-layout column>
              <v-row align="center" justify="start">
                <v-chip
                  small
                  style="margin-right: 100px; border-radius: 0; position: relative; left: -3px"
                  >{{ spaceInfo.spaceName }}</v-chip
                >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :to="
                        '/question/ask?spaceId=' +
                          spaceInfo.spaceId +
                          '&spaceName=' +
                          spaceInfo.spaceName
                      "
                      class="ml-5"
                      text
                      small
                      icon
                      v-on="on"
                      ><v-icon small
                        >mdi-comment-question-outline</v-icon
                      ></v-btn
                    >
                  </template>
                  <span>发布问题</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      :to="
                        '/blog/postBlog?spaceId=' +
                          spaceInfo.spaceId +
                          '&spaceName=' +
                          spaceInfo.spaceName
                      "
                      v-on="on"
                      ><v-icon small
                        >mdi-file-document-edit-outline</v-icon
                      ></v-btn
                    >
                  </template>
                  <span>撰写文章</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      :to="'/space/userView?spaceId=' + spaceInfo.spaceId"
                      v-on="on"
                      ><v-icon>mdi-account-supervisor-outline</v-icon></v-btn
                    >
                  </template>
                  <span>查看所有成员信息</span>
                </v-tooltip>
                <v-tooltip
                  v-if="spaceInfo.ownerUserId === $store.getters.getUserId"
                  top
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      small
                      icon
                      :to="'/space/manageSpace?spaceId=' + spaceInfo.spaceId"
                      v-on="on"
                      ><v-icon small>mdi-settings-outline</v-icon></v-btn
                    >
                  </template>
                  <span>管理空间</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      small
                      icon
                      @click="confirmExit.dialog = true"
                      v-on="on"
                      ><v-icon small>mdi-location-exit</v-icon></v-btn
                    >
                  </template>
                  <span>退出空间</span>
                </v-tooltip>
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
          style="font-size: 0.9rem"
        >
        </v-textarea>
        <HotTag :load-hot="false"></HotTag>
        <RelatePost></RelatePost>
      </v-flex>
    </v-layout>
    <ConfirmDialog
      :dialog="confirmExit.dialog"
      msg="确定退出该空间吗?"
      :todo="exitSpace"
      @update:dialog="confirmExit.dialog = $event"
    >
    </ConfirmDialog>
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
import ConfirmDialog from '../../../components/ConfirmDialog'
import InfoDialog from '../../../components/InfoDialog'
import HotTag from '../../../components/HotTag'
import BQCardList from '../../../components/BQCardList'
import RelatePost from '../../../components/RelatePost'
export default {
  components: {
    RelatePost,
    BQCardList,
    HotTag,
    InfoDialog,
    ConfirmDialog
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
    exitSpace() {
      this.$axios
        .$post('/spaceUser/exitSpace', {
          spaceId: this.$route.params.id
        })
        .then((resp) => {
          this.confirmExit.dialog = false
          this.confirmExit.result.resp = resp
          this.confirmExit.result.dialog = true
          if (resp.succeed) {
            this.$store.commit('needReloadSpaceList')
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
