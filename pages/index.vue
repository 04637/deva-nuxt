<template>
  <v-app id="home">
    <v-layout column>
      <v-layout>
        <v-flex md6 xs4 shrink hidden-sm-and-down>
          <v-card-title>最新问题</v-card-title>
        </v-flex>
        <v-flex md3 align-self-end>
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
      <v-flex xs11 lg9 justify-start>
        <v-list
          v-show="questionList && questionList.length > 0"
          style="padding-top:1px"
        >
          <div v-for="question in questionList" :key="question.questionId">
            <v-list-item class="mt-2">
              <QuestionCard :question="question" />
            </v-list-item>
            <div
              :class="$vuetify.theme.dark ? 'dark-divider' : 'light-divider'"
            ></div>
          </div>
        </v-list>
      </v-flex>
      <v-flex
        md2
        lg2
        justify-end
        shrink
        hidden-sm-and-down
        class="d-md-block ml-3"
      >
        <v-list>
          <div
            v-for="hotQuestion in hotQuestionList"
            :key="hotQuestion.questionId"
          >
            <v-list-item :to="'/question/' + hotQuestion.questionId">
              <v-card class="d-inline-block text-truncate" flat
                >{{ hotQuestion.title }}
              </v-card>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import QuestionCard from '../components/QuestionCard'
export default {
  components: {
    QuestionCard
  },
  data: () => ({
    listType: 'RECENT',
    questionList: null,
    hotQuestionList: null,
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
