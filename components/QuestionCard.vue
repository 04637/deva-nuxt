<template>
  <v-card
    flat
    exact
    width="100vw"
    class="px-5 pr-6 py-1 pt-2 no-ripple"
    :to="'/question/' + question.questionId"
  >
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
          class="no-hover-active title d-inline-block text-truncate text-left no-flex px-1"
          text
          :title="question.title"
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
        <v-card-text
          v-dompurify-html:noHtml="$md.render(question.content)"
          style="padding: 8px"
          class="title d-block sub--text text-truncate subtitle-1"
        >
        </v-card-text>
        <v-card-actions>
          <v-layout>
            <!--todo tag搜索时添加匹配列只匹配 tag-->
            <v-chip
              v-for="tag in question.tagInfos"
              :key="tag.tagId"
              small
              link
              :to="'/search/' + tag.tagName"
              :title="tag.tagName"
              class="question-tag d-inline-block text-truncate"
              >{{ tag.tagName }}</v-chip
            >
          </v-layout>
        </v-card-actions>
      </v-flex>
      <v-row class="pr-2 ml-2" cols="2" justify="end" style="width:15%">
        <v-row justify="end" dense>
          <small
            v-if="question.createTime === question.modifiedTime"
            :title="$options.filters.moment(question.createTime)"
          >
            提问于 {{ question.createTime | timeago }}</small
          >
          <small v-else :title="$options.filters.moment(question.modifiedTime)">
            更新于 {{ question.modifiedTime | timeago }}</small
          >
        </v-row>
        <v-row justify="end" dense style="width:100%">
          <v-col cols="6" align-self="end">
            <v-row justify="end">
              <v-btn
                min-width="0"
                text
                color="primary"
                class="text-truncate d-inline-block text-left no-flex px-1"
                :to="'/user/' + question.author.userId"
                height="21px"
              >
                <strong>{{
                  question.author.nickname || question.author.username
                }}</strong>
              </v-btn>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
          <!--suppress HtmlDeprecatedAttribute -->
          <v-col cols="5" align-self="end">
            <v-row justify="end" align="end" style="font-size: 14px">
              <svg
                class="icon"
                aria-hidden="true"
                style="width:17px;height:17px; position:relative;top:-1px"
              >
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
