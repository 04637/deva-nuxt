<template>
  <v-list v-show="hotQuestionList" class="pt-0">
    <div v-for="hotQuestion in hotQuestionList" :key="hotQuestion.questionId">
      <v-list-item :to="'/question/' + hotQuestion.questionId">
        <span class="d-inline-block text-truncate"
          >{{ hotQuestion.title }}
        </span>
      </v-list-item>
      <v-divider></v-divider>
    </div>
  </v-list>
</template>
<script>
export default {
  data: () => ({
    hotQuestionList: null
  }),
  created() {
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
  methods: {}
}
</script>
