<template>
  <v-list class="pa-0 ma-0">
    <transition-group name="list-down">
      <div v-for="question in questionList" :key="question.questionId">
        <QuestionCard :question="question"></QuestionCard>
      </div>
    </transition-group>
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
