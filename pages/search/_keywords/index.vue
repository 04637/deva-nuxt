<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-flex md6 xs4 shrink hidden-sm-and-down>
          <v-card-title>{{ $route.params.keywords }}</v-card-title>
        </v-flex>
        <v-flex md5 lg3 align-self-end>
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
      <v-flex xs11 lg9 justify-start shrink>
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
