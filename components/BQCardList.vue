<template>
  <v-list class="pa-0 ma-0">
    <!--<transition-group name="list-down">-->
    <div v-for="bq in bqList" :key="bq.blogId || bq.questionId">
      <QuestionCard v-if="bq.questionId" :question="bq"></QuestionCard>
      <BlogCard v-else-if="bq.blogId" :blog="bq"></BlogCard>
    </div>
    <!--</transition-group>-->
  </v-list>
</template>
<script>
import QuestionCard from './QuestionCard'
import BlogCard from './BlogCard'

export default {
  components: {
    BlogCard,
    QuestionCard
  },
  props: {
    bqList: {
      type: Array,
      required: true
    }
  }
}
</script>
