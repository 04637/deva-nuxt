<template>
  <v-card flat exact width="100vw" class="px-3">
    <v-layout>
      <v-layout
        column
        justify-space-around
        class="d-md-flex"
        hidden-sm-and-down
      >
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
          class="title d-inline-block text-truncate text-left no-flex px-1"
          text
          :to="'/question/' + question.questionId"
          >{{ question.title }}</v-btn
        ><v-chip
          v-if="question.status === 1"
          color="primary"
          small
          label
          outlined
          class="ml-2"
        >
          <strong>已解决</strong>
        </v-chip>
        <v-card-text class="title d-block sub--text text-truncate subtitle-1">
          {{ $md.render(question.content) | filterHtml }}
        </v-card-text>
        <v-card-actions>
          <v-layout>
            <!--todo tag搜索时添加匹配列只匹配 tag-->
            <v-chip
              v-for="tag in question.tagInfos"
              :key="tag.tagId"
              link
              :to="'/search/' + tag.tagName"
              :title="tag.tagName"
              class="question-tag d-inline-block text-truncate"
              >{{ tag.tagName }}</v-chip
            >
          </v-layout>
        </v-card-actions>
      </v-flex>
      <v-row
        class="pr-2 ml-2"
        cols="2"
        justify="end"
        align="space-between"
        style="width:15%"
      >
        <v-row justify="end" dense>
          <small v-if="question.createTime === question.modifiedTime">
            提问于 {{ question.createTime | timeago }}</small
          >
          <small v-else> 更新于 {{ question.modifiedTime | timeago }}</small>
        </v-row>
        <v-row align="end" justify="end" dense style="width:100%">
          <v-col cols="7">
            <v-row justify="center">
              <v-btn
                min-width="0"
                text
                class="orange--text text-truncate d-inline-block text-left no-flex px-1"
                :to="'/user/' + question.author.userId"
                height="21px"
              >
                {{ question.author.nickname || question.author.username }}
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="5">
            <v-row align="center" justify="end">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zuanshi"></use></svg
              >{{ question.author.reputation }}
            </v-row>
          </v-col>
        </v-row>
      </v-row>
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
  margin-right: 2px;
}
</style>
