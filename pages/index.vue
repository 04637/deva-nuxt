<template>
  <v-app id="home">
    <v-container align-center justify-center>
      <v-layout column>
        <v-layout>
          <v-flex md6 xs4 shrink hidden-sm-and-down>
            <v-card-title>最新问题</v-card-title>
          </v-flex>
          <v-flex md3 align-self-end>
            <v-tabs centered height="38" @change="loadQuestions">
              <v-tab @click="listType = 'RECENT'">最新</v-tab>
              <v-tab @click="listType = 'UN_RESOLVED'">待解决</v-tab>
              <v-tab @click="listType = 'WEEK_HOT'">周榜</v-tab>
              <v-tab @click="listType = 'MONTH_HOT'">月榜</v-tab>
            </v-tabs>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-layout>
      <v-layout justify-center justify-space-around class="mt-4">
        <v-flex xs11 lg9 justify-start>
          <v-list>
            <div v-for="question in questionList" :key="question.questionId">
              <v-list-item class="mt-2">
                <v-card flat exact width="100vw">
                  <v-layout>
                    <v-layout column justify-space-around>
                      <div>
                        <v-icon>question_answer</v-icon>
                        <strong class="num-span">{{
                          question.answerNum
                        }}</strong>
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
                    <v-flex xs11>
                      <v-layout justify-end style="float:right">
                        <v-card-text class="pa-0"
                          >提问于
                          {{ question.createTime | timeago }}</v-card-text
                        >
                      </v-layout>
                      <v-btn
                        text
                        class="title"
                        to="/question/questionDetail?id=12113"
                        >{{ question.title }}</v-btn
                      >
                      <!--eslint-disable-next-line-->
                      <v-card-text class="preview_content" v-html="$md.render(question.content)"
                      ></v-card-text>
                      <v-card-actions>
                        <v-layout>
                          <v-chip link to="" class="question-tag">java</v-chip>
                          <v-chip link to="" class="question-tag">C++</v-chip>
                        </v-layout>
                        <v-layout justify-end>
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
                        </v-layout>
                      </v-card-actions>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </v-list>
        </v-flex>
        <v-flex xs1 lg2 justify-end shrink>
          <v-list>
            <div
              v-for="hotQuestion in hotQuestionList"
              :key="hotQuestion.questionId"
            >
              <v-list-item>
                <v-card>
                  {{ hotQuestion.title }}
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
export default {
  data: () => ({
    listType: 'RECENT',
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
    loadQuestions() {
      this.$axios
        .$post('/questionInfo/listQuestions', {
          current: this.page.current,
          size: this.page.size,
          listType: this.listType
        })
        .then((resp) => {
          if (resp.succeed) {
            this.questionList = resp.data.records
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
  vertical-align: -6px;
}
.preview_content {
  height: 43px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
