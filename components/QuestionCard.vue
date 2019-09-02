<template>
  <v-card flat exact width="100vw" class="px-3">
    <v-layout>
      <v-layout column justify-space-around class="d-sm-none d-md-flex">
        <div>
          <v-icon>question_answer</v-icon>
          <strong class="num-span">{{ question.answerNum }}</strong>
        </div>
        <div>
          <v-icon>thumb_up_alt</v-icon>
          <strong class="num-span">{{ question.voteNum }}</strong>
        </div>
        <div>
          <v-icon>remove_red_eye</v-icon>
          <strong class="num-span">{{ question.viewNum }}</strong>
        </div>
      </v-layout>
      <v-flex xs9>
        <v-btn
          height="30px"
          class="title d-inline-block text-truncate text-left no-flex"
          text
          :to="'/question/' + question.questionId"
          >{{ question.title }}</v-btn
        >
        <v-card-text class="title d-block sub--text text-truncate subtitle-1">
          {{ $md.render(question.content) | filterHtml }}
        </v-card-text>
        <v-card-actions>
          <v-layout>
            <v-chip
              v-for="tag in question.tagInfos"
              :key="tag.tagId"
              link
              to=""
              class="question-tag"
              >{{ tag.tagName }}</v-chip
            >
          </v-layout>
        </v-card-actions>
      </v-flex>
      <v-layout column justify-space-around class="mr-1">
        <v-row justify="end">
          <small>
            提问于
            {{ question.createTime | timeago }}</small
          >
        </v-row>
        <v-row align="end" justify="end">
          <v-card flat class="pb-0">
            <v-card-text class="pa-0">
              <v-btn text class="orange--text">
                {{ question.author.nickname }}
              </v-btn>
              <span style="vertical-align: -1px">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zuanshi"></use></svg
                >{{ question.author.reputation }}
              </span>
            </v-card-text>
          </v-card>
        </v-row>
      </v-layout>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
.question-tag {
  margin-right: 13px;
}

.num-span {
  margin-left: 14px;
}

.icon {
  width: 20px;
  height: 20px;
  vertical-align: -5px;
  margin-right: 2px;
}
</style>
