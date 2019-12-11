<template>
  <v-list class="pa-0 ma-0 right-box" style="background-color: transparent">
    <!--<transition-group name="list-down">-->
    <div v-for="bq in bqList" :key="bq.blogId || bq.questionId">
      <BQCard v-if="bq.questionId" :item="bq" type="question"></BQCard>
      <BQCard v-else-if="bq.blogId" :item="bq" type="blog"></BQCard>
    </div>
    <!--</transition-group>-->
  </v-list>
</template>
<script>
import BQCard from './BQCard'

export default {
  components: {
    BQCard
  },
  props: {
    bqList: {
      type: Array,
      required: true
    }
  }
}
</script>
