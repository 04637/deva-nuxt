<template>
  <v-app v-show="questionList">
    <v-layout column shrink>
      <v-layout>
        <v-flex md7 xs4 shrink hidden-sm-and-down>
          <v-card-title>{{ currentTitle }}</v-card-title>
        </v-flex>
        <v-flex md5 lg3 align-self-end>
          <v-tabs centered height="38" @change="loadQuestions">
            <v-tab
              @click="
                listType = 'RECENT'
                currentTitle = '最新问题'
              "
              >最新</v-tab
            >
            <v-tab
              @click="
                listType = 'UN_RESOLVED'
                currentTitle = '待解决'
              "
              >待解决</v-tab
            >
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
import QuestionCardList from '../components/QuestionCardList'
export default {
  components: { QuestionCardList },
  data: () => ({
    listType: 'RECENT',
    questionList: null,
    hotQuestionList: null,
    currentTitle: '最新问题',
    page: {
      current: 1,
      size: 15
    }
  }),
  created() {
    this.loadHotQuestions()
  },
  methods: {
    loadQuestions() {
      this.$axios
        .$post('/questionInfo/listQuestions', {
          current: this.page.current,
          size: this.page.size,
          listType: this.listType
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
    }
  }
}
</script>
