<template>
  <v-app>
    <v-layout column shrink>
      <v-layout v-if="spaceInfo">
        <v-flex md7 xs4 shrink hidden-sm-and-down>
          <v-card-title
            ><v-btn text outlined color="private" small
              ><v-icon small>visibility_off</v-icon
              ><strong class="ml-1">{{ spaceInfo.spaceName }}</strong></v-btn
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
                  ><v-icon>mdi-account-search</v-icon></v-btn
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
        <v-list>
          <div
            v-for="hotQuestion in hotQuestionList"
            :key="hotQuestion.questionId"
          >
            <v-list-item :to="'/question/' + hotQuestion.questionId">
              <span class="d-inline-block text-truncate"
                >{{ hotQuestion.title }}
              </span>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import QuestionCardList from '../../../components/QuestionCardList'
export default {
  components: {
    QuestionCardList
  },
  data: () => ({
    listType: 'RECENT',
    questionList: null,
    hotQuestionList: null,
    spaceInfo: null,
    page: {
      current: 1,
      size: 15
    }
  }),
  created() {
    this.loadSpaceInfo()
    this.loadHotQuestions()
  },
  methods: {
    loadQuestions() {
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
            this.questionList = null
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
    }
  }
}
</script>
