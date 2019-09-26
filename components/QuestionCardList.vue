<template>
  <v-list v-show="questionList && questionList.length > 0" class="pa-0 ma-0">
    <div v-for="question in questionList" :key="question.questionId">
      <v-list-item class="px-0">
        <QuestionCard :question="question"></QuestionCard>
      </v-list-item>
      <div
        :class="$vuetify.theme.dark ? 'dark-divider' : 'light-divider'"
      ></div>
    </div>
  </v-list>
</template>
<script>
import QuestionCard from './QuestionCard'

export default {
  components: {
    QuestionCard
  },
  props: {
    questionList: {
      type: Array,
      required: true
    }
  }
}
</script>
