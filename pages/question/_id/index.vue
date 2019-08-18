<template>
  <v-app id="home">
    <v-container align-center justify-center>
      <v-layout column>
        <v-card-title>{{ questionDetail.title }}</v-card-title>
        <v-divider></v-divider>
      </v-layout>
      <v-layout justify-center justify-space-around>
        <v-flex xs11 lg9 justify-start class="mt-4">
          <v-list>
            <v-list-item>
              <v-card flat exact width="100vw">
                <v-layout justify-space-between>
                  <v-flex xs1 class="mt-12" align-center>
                    <v-layout column align-center>
                      <v-btn icon fab>
                        <v-icon
                          size="80"
                          :color="
                            questionDetail.isUseful === true ? 'success' : ''
                          "
                          >arrow_drop_up</v-icon
                        >
                      </v-btn>
                      <strong>{{ questionDetail.voteNum }}</strong>
                      <v-btn icon fab>
                        <v-icon
                          size="80"
                          :color="
                            questionDetail.isUseful === false ? 'success' : ''
                          "
                          >arrow_drop_down</v-icon
                        >
                      </v-btn>
                      <v-btn icon fab>
                        <v-icon
                          size="40"
                          :color="questionDetail.isCollected ? 'success' : ''"
                          >favorite_border</v-icon
                        >
                      </v-btn>
                    </v-layout>
                  </v-flex>
                  <v-flex xs11 class="ml-4">
                    <v-layout justify-end>
                      <v-dialog v-model="dialog" persistent max-width="600px">
                        <template v-slot:activator="{ on }">
                          <v-btn text color="pink" v-on="on"
                            >问题重复？标记相似
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="headline">相似标记</span>
                          </v-card-title>
                          <v-card-text>
                            <v-text-field
                              label="输入相似问题的链接"
                            ></v-text-field>
                            <small
                              >合理的标记可以帮助小伙伴们寻找答案，提升自己的声望。同时滥用标记，关联无关问题也将受到惩罚哦!</small
                            >
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog = false"
                              >关闭
                            </v-btn>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog = false"
                              >确定
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-layout>
                    <!--eslint-disable-next-line-->
                    <div v-html="$md.render(questionDetail.content)"></div>
                    <!--color="cyan"  知更鸟蓝-->
                    <v-layout v-if="questionDetail.similarMarkId" align-center>
                      <v-alert
                        v-model="alert"
                        dense
                        border="left"
                        elevation="1"
                        colored-border
                        color="orange"
                        width="100vw"
                      >
                        <v-layout justify-space-between>
                          <v-flex xs9>
                            该问题已有相似问题:
                            <router-link to="questionDetail"
                              >大家好我是旺旺旺
                            </router-link>
                          </v-flex>
                          <v-layout justify-end xs3>
                            --&nbsp;
                            <router-link to="userProfile"
                              >别叫我小海绵
                            </router-link>
                          </v-layout>
                        </v-layout>
                      </v-alert>
                      <v-btn class="mb-4" icon>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon color="orange" dark v-on="on"
                              >report
                            </v-icon>
                          </template>
                          <span>举报滥用</span>
                        </v-tooltip>
                      </v-btn>
                    </v-layout>
                    <v-card-actions>
                      <v-layout>
                        <v-chip
                          v-for="tag in questionDetail.tagInfos"
                          :key="tag.tagId"
                          link
                          to=""
                          class="question-tag"
                          >{{ tag.tagName }}</v-chip
                        >
                      </v-layout>
                      <v-layout justify-end>
                        <v-card
                          class="px-8 pt-3 pb-1 user_card"
                          to="/user/userProfile"
                        >
                          <v-layout justify-space-between>
                            <v-flex xs3>
                              <v-layout justify-center>
                                <v-avatar color="grey">
                                  <v-img
                                    src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                                  ></v-img>
                                </v-avatar>
                              </v-layout>
                              <v-layout justify-center class="mt-2">
                                <span class="subtitle-2 text-no-wrap">{{
                                  questionDetail.author.nickname ||
                                    questionDetail.username
                                }}</span>
                              </v-layout>
                            </v-flex>
                            <v-flex xs8>
                              <v-layout column>
                                <v-card-text class="text-no-wrap">
                                  提问于&nbsp;
                                  {{ questionDetail.createTime | timeago }}
                                </v-card-text>
                                <v-layout justify-end align-end>
                                  <svg
                                    class="icon heat-icon"
                                    aria-hidden="true"
                                  >
                                    <use xlink:href="#icon-zuanshi"></use></svg
                                  >&nbsp;{{ questionDetail.author.reputation }}
                                </v-layout>
                              </v-layout>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-layout>
                    </v-card-actions>
                    <!-- 评论区 -->
                    <v-divider></v-divider>
                    <v-layout justify-center column class="mt-2">
                      <v-layout justify-end>
                        <v-btn
                          text
                          @click="
                            $set(
                              showCommentInput,
                              questionDetail.questionId,
                              !showCommentInput[questionDetail.questionId]
                            )
                          "
                          >添加评论</v-btn
                        >
                      </v-layout>
                      <v-layout>
                        <v-list width="100vw">
                          <div
                            v-for="(comment, index) in questionDetail.comments"
                            :key="comment.commentId"
                          >
                            <div
                              v-show="
                                showAllComments[questionDetail.questionId]
                                  ? true
                                  : index < 3
                              "
                            >
                              <v-list-item>
                                <v-layout justify-space-between>
                                  <v-flex xs10>{{ comment.content }}</v-flex>
                                  <v-flex xs2
                                    >--
                                    <router-link to="userProfile"
                                      >{{
                                        comment.author.nickname ||
                                          comment.author.username
                                      }}
                                    </router-link>
                                  </v-flex>
                                </v-layout>
                              </v-list-item>
                              <v-divider></v-divider>
                            </div>
                          </div>
                        </v-list>
                      </v-layout>
                      <v-layout
                        v-if="questionDetail.comments.length > 3"
                        justify-center
                        class="mb-1"
                      >
                        <v-btn
                          icon
                          small
                          :title="
                            showAllComments[questionDetail.questionId]
                              ? '收起'
                              : '展开'
                          "
                          @click="
                            $set(
                              showAllComments,
                              questionDetail.questionId,
                              !showAllComments[questionDetail.questionId]
                            )
                          "
                        >
                          <v-icon
                            >expand_{{
                              showAllComments[questionDetail.questionId]
                                ? 'less'
                                : 'more'
                            }}</v-icon
                          >
                        </v-btn>
                      </v-layout>
                      <!--  评论输入区-->
                      <v-layout
                        v-show="showCommentInput[questionDetail.questionId]"
                      >
                        <v-text-field
                          :ref="'comment' + questionDetail.questionId"
                          v-model="currentComment"
                          append-outer-icon="send"
                          autofocus
                          @click:append-outer="
                            sendComment(questionDetail.questionId)
                          "
                        ></v-text-field>
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <!--所有回答-->
          <v-layout class="transparent" justify-space-between align-center
            ><v-card-text
              >{{ questionDetail.answers.length }} 个回答</v-card-text
            >
          </v-layout>
          <v-divider></v-divider>
          <v-list v-show="questionDetail.answerNum > 0">
            <div
              v-for="answer in questionDetail.answers"
              :key="answer.answerId"
            >
              <v-list-item class="mt-1">
                <v-card flat exact width="100vw">
                  <v-layout justify-space-between>
                    <v-flex xs1 class="mt-12" align-center>
                      <v-layout column align-center>
                        <v-btn icon fab>
                          <v-icon size="80">arrow_drop_up</v-icon>
                        </v-btn>
                        <strong>{{ answer.voteNum }}</strong>
                        <v-btn icon fab>
                          <v-icon size="80">arrow_drop_down</v-icon>
                        </v-btn>
                        <v-btn
                          v-if="answer.isAccepted"
                          icon
                          color="success"
                          fab
                        >
                          <v-icon size="40">check</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11 class="ml-4">
                      <v-layout v-if="questionDetail.status === 0" justify-end>
                        <v-btn color="success" text>
                          <v-icon>check</v-icon>
                          采纳
                        </v-btn>
                      </v-layout>
                      <!--eslint-disable-next-line-->
                    <div v-html="$md.render(answer.content)"></div>
                      <v-card-actions>
                        <v-layout justify-end>
                          <v-card
                            class="px-8 pt-3 pb-1 user_card"
                            to="/user/userProfile"
                          >
                            <v-layout justify-space-between>
                              <v-flex xs3>
                                <v-layout justify-center>
                                  <v-avatar color="grey">
                                    <v-img
                                      src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                                    ></v-img>
                                  </v-avatar>
                                </v-layout>
                                <v-layout justify-center class="mt-2">
                                  <span class="subtitle-2 text-no-wrap">{{
                                    answer.author.nickname ||
                                      answer.author.username
                                  }}</span>
                                </v-layout>
                              </v-flex>
                              <v-flex xs8>
                                <v-layout column>
                                  <v-card-text class="text-no-wrap">
                                    回答于&nbsp;{{
                                      answer.createTime | timeago
                                    }}
                                  </v-card-text>
                                  <v-layout justify-end align-end>
                                    <svg
                                      class="icon heat-icon"
                                      aria-hidden="true"
                                    >
                                      <use
                                        xlink:href="#icon-zuanshi"
                                      ></use></svg
                                    >&nbsp;{{ answer.author.reputation }}
                                  </v-layout>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-layout>
                      </v-card-actions>
                      <!-- 评论区 -->
                      <v-divider></v-divider>
                      <v-layout justify-center column class="mt-2">
                        <v-layout justify-end>
                          <v-btn
                            text
                            @click="
                              $set(
                                showCommentInput,
                                answer.answerId,
                                !showCommentInput[answer.answerId]
                              )
                            "
                            >添加评论</v-btn
                          >
                        </v-layout>
                        <v-layout>
                          <v-list width="100vw">
                            <div
                              v-for="(comment, index) in answer.comments"
                              :key="comment.commentId"
                            >
                              <div
                                v-show="
                                  showAllComments[answer.answerId]
                                    ? true
                                    : index < 3
                                "
                              >
                                <v-list-item>
                                  <v-layout justify-space-between>
                                    <v-flex xs10>{{ comment.content }}</v-flex>
                                    <v-flex xs2
                                      >--
                                      <router-link to="userProfile"
                                        >{{
                                          comment.author.nickname ||
                                            comment.author.username
                                        }}
                                      </router-link>
                                    </v-flex>
                                  </v-layout>
                                </v-list-item>
                                <v-divider></v-divider>
                              </div>
                            </div>
                          </v-list>
                        </v-layout>
                        <v-layout
                          v-if="answer.comments.length > 3"
                          justify-center
                          class="mb-1"
                        >
                          <v-btn
                            icon
                            small
                            :title="
                              showAllComments[answer.answerId] ? '收起' : '展开'
                            "
                            @click="
                              $set(
                                showAllComments,
                                answer.answerId,
                                !showAllComments[answer.answerId]
                              )
                            "
                          >
                            <v-icon
                              >expand_{{
                                showAllComments[answer.answerId]
                                  ? 'less'
                                  : 'more'
                              }}</v-icon
                            >
                          </v-btn>
                        </v-layout>
                        <!--  评论输入区-->
                        <v-layout v-show="showCommentInput[answer.answerId]">
                          <v-text-field
                            v-model="currentComment"
                            append-outer-icon="send"
                            autofocus
                            @click:append-outer="sendComment(answer.answerId)"
                          ></v-text-field>
                        </v-layout>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </v-list>
        </v-flex>
        <v-flex fill-height xs1 lg2 justify-end shrink class="mt-4">
          <v-list>
            <div>
              <v-list-item>
                <v-card class="d-inline-block text-truncate" flat>
                  圣诞快乐放假了看电视的附件上课了
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
  name: 'QuestionDetail',
  validate({ params }) {
    return /^\d{18}$/.test(params.id)
  },
  data: () => ({
    questionDetail: null,
    alert: true,
    dialog: false,
    showAllComments: {},
    showCommentInput: {},
    // 当前正在输入的评论
    currentComment: null
  }),
  computed: {},
  // ssr渲染
  async asyncData({ $axios, params }) {
    const resp = await $axios.$post('/questionInfo/getQuestionDetail', {
      questionId: params.id
    })
    const questionDetail = resp.data
    return { questionDetail }
  },
  methods: {
    sendComment(id) {
      alert(this.currentComment)
    }
  }
}
</script>
<style scoped>
.question-tag {
  margin-right: 13px;
}
.user_card {
  width: 267px;
}
</style>
