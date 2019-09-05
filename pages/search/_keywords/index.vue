<template>
  <v-app id="home">
    <v-container align-center justify-center>
      <v-layout column>
        <v-layout>
          <v-flex md6 xs4 shrink hidden-sm-and-down>
            <v-card-title>{{ $route.params.keywords }}</v-card-title>
          </v-flex>
          <v-flex md3 align-self-end>
            <v-tabs centered height="38" @change="searchQuestions">
              <v-tab @click="listType = 'RELEVANCE'">相关</v-tab>
              <v-tab @click="listType = 'NEWEST'">最新</v-tab>
              <v-tab @click="listType = 'ACTIVE'">活跃</v-tab>
            </v-tabs>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-layout>
      <v-layout justify-center justify-space-around class="mt-4">
        <v-flex xs11 lg9 justify-start>
          <v-list v-show="questionList && questionList.length > 0">
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
        <v-flex md2 lg2 justify-end shrink class="d-sm-none d-md-block ml-3">
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
    </v-container>
  </v-app>
</template>
<script>
import QuestionCard from '../../../components/QuestionCard'
export default {
  components: {
    QuestionCard
  },
  data: () => ({
    listType: null,
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
    searchQuestions() {
      this.$axios
        .$post('/esQuestionInfo/search', {
          keywords: this.$route.params.keywords,
          current: this.current,
          size: this.size,
          sortType: this.listType
        })
        .then((resp) => {
          if (resp.succeed) {
            this.questionList = resp.data.content
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
