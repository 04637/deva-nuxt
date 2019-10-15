<template>
  <v-app>
    <v-layout column shrink>
      <v-layout v-if="spaceInfo">
        <v-flex md7 xs4 shrink hidden-sm-and-down>
          <v-card-title class="pt-0 pb-0">
            <v-layout column>
              <v-row align="center">
                <v-btn text outlined color="private" small
                  ><strong class="ml-1">{{
                    spaceInfo.spaceName
                  }}</strong></v-btn
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
                      ><v-icon small>mdi-comment-question</v-icon></v-btn
                    >
                  </template>
                  <span>发布问题</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      :to="'/space/userView?spaceId=' + spaceInfo.spaceId"
                      v-on="on"
                      ><v-icon>mdi-account-multiple</v-icon></v-btn
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
                      ><v-icon small>mdi-settings</v-icon></v-btn
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
                <v-spacer></v-spacer>
                <v-row align="center" style="position: absolute; right: 20px;">
                  <v-card-text class="pa-0"
                    ><span class="my_gray--text">我在本空间的昵称：</span
                    >{{ $store.getters.getUserInfo.nickname }}
                    <v-btn icon small
                      ><v-icon small>mdi-rename-box</v-icon></v-btn
                    >
                  </v-card-text>
                </v-row>
              </v-row>
              <v-row
                ><v-text-field
                  v-model="keywords"
                  translate="yes"
                  class="pt-0 mt-0 mr-2"
                  placeholder="空间内搜索"
                  hide-details
                  prepend-inner-icon="search"
                  flat
                  @keyup.enter.native="search"
                ></v-text-field
              ></v-row>
            </v-layout>
          </v-card-title>
        </v-flex>
        <v-flex md5 lg3 align-self-end>
          <v-tabs centered height="38" @change="loadQuestions">
            <v-tab @click="listType = 'RECENT'">最新</v-tab>
            <v-tab @click="listType = 'UN_RESOLVED'">待解决</v-tab>
            <v-tab @click="listType = 'WEEK_HOT'">周榜</v-tab>
            <v-tab @click="listType = 'MONTH_HOT'">月榜</v-tab>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center justify-space-around class="mt-4">
      <v-flex xs11 lg9 justify-start shrink>
        <QuestionCardList
          v-if="questionList"
          :question-list="questionList"
        ></QuestionCardList>
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
        <HotTag></HotTag>
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
import QuestionCardList from '../../../components/QuestionCardList'
import ConfirmDialog from '../../../components/ConfirmDialog'
import InfoDialog from '../../../components/InfoDialog'
import HotTag from '../../../components/HotTag'
export default {
  components: {
    HotTag,
    InfoDialog,
    ConfirmDialog,
    QuestionCardList
  },
  data: () => ({
    listType: 'RECENT',
    questionList: null,
    hotQuestionList: null,
    keywords: null,
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
    }
  }),
  created() {
    this.loadSpaceInfo()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    loadQuestions() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post('/questionInfo/listSpaceQuestions', {
          current: this.page.current,
          size: this.page.size,
          listType: this.listType,
          spaceId: this.$route.params.id
        })
        .then((resp) => {
          if (resp.succeed) {
            this.questionList = resp.data.records
          } else {
            this.questionList = []
          }
        })
    },
    loadHotQuestions() {
      this.$axios
        .$post('/questionInfo/listQuestions', {
          current: 1,
          size: 15,
          listType: 'HOT'
        })
        .then((resp) => {
          this.hotQuestionList = resp.data.records
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
    search() {
      if (this.keywords) {
        this.$router.push({
          path:
            '/search/' +
            this.keywords +
            '?spaceId=' +
            this.$route.params.id +
            '&spaceName=' +
            this.spaceInfo.spaceName
        })
      }
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
          this.loadMore.isLoading = true
          this.$axios
            .$post('/questionInfo/listSpaceQuestions', {
              current: ++this.page.current,
              size: this.page.size,
              listType: this.listType,
              spaceId: this.$route.params.id
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.questionList = this.questionList.concat(resp.data.records)
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
