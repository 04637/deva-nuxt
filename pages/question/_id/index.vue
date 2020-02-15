<template>
  <div>
    <v-app>
      <v-layout
        :class="miniTop ? 'mini-top' : 'top'"
        class="right-box"
        style="position:fixed;  left:0; right:0; background-color: white;min-height: 150px;z-index: 100"
        justify-center
      >
        <v-card class="py-3 px-3" flat max-width="1032px" width="100%">
          <v-layout justify-center>
            <v-flex md9 sm12 align-space-between>
              <v-layout column class="flex-height" justify-space-around>
                <v-layout wrap shrink class="title-label">
                  <TagChip
                    v-for="tag in questionDetail.tagInfos"
                    :key="tag.tagId"
                    :tag-info="tag"
                    class="mr-3 mb-1"
                  ></TagChip>
                </v-layout>
                <h3>
                  {{ questionDetail.title }}
                  <v-icon
                    large
                    color="my_green"
                    title="已解决"
                    style="position:relative; top:-3px"
                    >{{
                      questionDetail.status === 1 ? 'mdi-check-bold' : ''
                    }}</v-icon
                  >
                </h3>
                <v-layout shrink class="mt-2 title-label">
                  <v-btn
                    :outlined="questionDetail.isCollected"
                    @click="collectQuestion"
                    @mouseover="watchMouseOver = true"
                    @mouseleave="watchMouseOver = false"
                    color="blue"
                    small
                    width="80.23px"
                    class="white--text"
                    >{{
                      questionDetail.isCollected
                        ? watchMouseOver
                          ? '取消关注'
                          : '已关注'
                        : '关注问题'
                    }}</v-btn
                  >
                  <v-btn
                    @click="toBottom"
                    color="blue"
                    small
                    class="white--text ml-4"
                    outlined
                    ><v-icon small>edit</v-icon>写回答</v-btn
                  >
                  <v-btn
                    v-if="
                      $store.getters.getUserId === questionDetail.author.userId
                    "
                    :to="
                      '/question/ask?questionId=' + questionDetail.questionId
                    "
                    small
                    class="ml-4"
                    color="blue"
                    outlined
                  >
                    <v-icon small>edit</v-icon>
                    <span>编辑问题</span>
                  </v-btn>
                </v-layout>
              </v-layout>
            </v-flex>
            <v-flex md3 hidden-sm-and-down class="title-label">
              <v-layout justify-space-around>
                <v-flex shrink>
                  <div style="color: #8590a6">关注者</div>
                  <div class="text-center">
                    <strong>{{ questionDetail.collectNum }}</strong>
                  </div>
                </v-flex>
                <v-divider vertical></v-divider>
                <v-flex shrink>
                  <div style="color: #8590a6">被浏览</div>
                  <div class="text-center">
                    <strong>{{ questionDetail.viewNum }}</strong>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex md3 hidden-sm-and-down class="show-label">
              <v-layout shrink>
                <v-btn
                  :outlined="questionDetail.isCollected"
                  @click="collectQuestion"
                  @mouseover="watchMouseOver = true"
                  @mouseleave="watchMouseOver = false"
                  color="blue"
                  small
                  width="80.23px"
                  class="white--text"
                  >{{
                    questionDetail.isCollected
                      ? watchMouseOver
                        ? '取消关注'
                        : '已关注'
                      : '关注问题'
                  }}</v-btn
                >
                <v-btn
                  @click="toBottom"
                  color="blue"
                  small
                  class="white--text ml-4"
                  outlined
                  ><v-icon small>edit</v-icon>写回答</v-btn
                >
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>
      <v-layout justify-center justify-space-around style="margin-top: 130px">
        <v-flex sm12 md11 lg9 justify-start class="mt-4">
          <v-card
            flat
            width="100vw"
            style="padding: 0 10px;"
            class="pr-md-4 pr-sm-1 right-box"
          >
            <v-layout justify-space-between>
              <v-flex md1 hidden-sm-and-down class="mt-12" align-center>
                <v-layout column align-center>
                  <v-btn @click="voteQuestion(true)" small icon fab>
                    <v-icon
                      :color="questionDetail.isUseful === true ? 'success' : ''"
                      size="60"
                      >arrow_drop_up</v-icon
                    >
                  </v-btn>
                  <strong>{{ questionDetail.voteNum }}</strong>
                  <v-btn @click="voteQuestion(false)" small icon fab>
                    <v-icon
                      :color="
                        questionDetail.isUseful === false ? 'success' : ''
                      "
                      size="60"
                      >arrow_drop_down</v-icon
                    >
                  </v-btn>
                </v-layout>
              </v-flex>
              <v-flex
                xs12
                md11
                class="ml-md-4 pr-md-3"
                style="padding: 0 10px;"
              >
                <v-layout justify-end style="min-height: 36px">
                  <!--<v-btn-->
                  <!--  v-if="-->
                  <!--    $store.state.userInfo &&-->
                  <!--      $store.getters.getUserId !==-->
                  <!--        questionDetail.author.userId &&-->
                  <!--      $store.getters.getUserInfo.reputation >= 200-->
                  <!--  "-->
                  <!--  id="markDialogBtn"-->
                  <!--  text-->
                  <!--  color="private"-->
                  <!--  style="height: 24px; padding: 0 10px;"-->
                  <!--  @click.stop="similarMark.dialog = !similarMark.dialog"-->
                  <!--  ><span>问题重复？标记相似</span>-->
                  <!--</v-btn>-->
                  <!--<v-btn-->
                  <!--  v-else-if="-->
                  <!--    $store.state.userInfo &&-->
                  <!--      $store.getters.getUserId !==-->
                  <!--        questionDetail.author.userId-->
                  <!--  "-->
                  <!--  text-->
                  <!--  color="my_gray"-->
                  <!--  style="height: 24px; padding: 0 10px;"-->
                  <!--  title="声望达到200方可标记"-->
                  <!--  ><span>问题重复？标记相似</span>-->
                  <!--</v-btn>-->
                </v-layout>
                <div
                  v-dompurify-html="$md.render(questionDetail.content)"
                ></div>
                <!--color="cyan"  知更鸟蓝-->
                <v-layout
                  v-if="questionDetail.similarMark"
                  align-center
                  class="mt-2"
                >
                  <v-alert
                    dense
                    border="left"
                    colored-border
                    color="private"
                    width="100%"
                    class="inverted_color--text right-box"
                    >相似问题：
                    <router-link
                      :to="questionDetail.similarMark.toQuestionId"
                      style="text-decoration: none"
                      >{{ questionDetail.similarMark.toQuestionTitle }}
                    </router-link>
                    <span
                      :title="questionDetail.similarMark.nickname"
                      @click="
                        $router.push(
                          '/user/' + questionDetail.similarMark.userId
                        )
                      "
                      class="inverted_color--text"
                      style="font-size: 0.8rem; cursor: pointer"
                      >--&nbsp;{{ questionDetail.similarMark.nickname }}
                    </span>
                    <span
                      :title="
                        $options.filters.moment(
                          questionDetail.similarMark.createTime
                        )
                      "
                      class="my_gray--text ml-2"
                      style="font-size: 0.8rem"
                      >&nbsp;标记于&nbsp;{{
                        questionDetail.similarMark.createTime | timeago
                      }}</span
                    >
                  </v-alert>
                </v-layout>
                <v-card-actions>
                  <v-layout wrap>
                    <TagChip
                      v-for="tag in questionDetail.tagInfos"
                      :key="tag.tagId"
                      :tag-info="tag"
                      class="mr-3 mb-1"
                    ></TagChip>
                  </v-layout>
                </v-card-actions>
                <v-layout justify-end>
                  <EditUserCard
                    :user="questionDetail.author"
                    :create-time="questionDetail.createTime"
                    :modified-time="questionDetail.modifiedTime"
                    class="mb-2"
                    prefix="提问"
                  ></EditUserCard>
                </v-layout>
                <!-- 评论区 -->
                <v-divider></v-divider>
                <v-layout justify-center column class="mt-2">
                  <v-layout justify-end>
                    <v-btn
                      @click="
                        $set(
                          showCommentInput,
                          questionDetail.questionId,
                          !showCommentInput[questionDetail.questionId]
                        )
                      "
                      text
                      small
                      >添加评论</v-btn
                    >
                  </v-layout>
                  <v-layout>
                    <v-list width="100vw" dense class="pb-5">
                      <div
                        v-for="(comment, _index) in questionDetail.comments"
                        :key="comment.commentId"
                      >
                        <div
                          v-show="
                            showAllComments[questionDetail.questionId]
                              ? true
                              : _index < 3
                          "
                        >
                          <v-list-item style="min-height: 28px">
                            <span style="font-size: 0.8rem">
                              {{ comment.content }}&nbsp;&nbsp;--&nbsp;
                              <router-link
                                :to="'/user/' + comment.author.userId"
                                style="text-decoration: none;font-size:0.8rem"
                                >{{
                                  comment.author.nickname ||
                                    comment.author.username
                                }}
                              </router-link>
                              <span
                                :title="
                                  $options.filters.moment(comment.createTime)
                                "
                                class="my_gray--text"
                                style="font-size: 0.8rem;"
                                >&nbsp;{{ comment.createTime | timeago }}</span
                              > </span
                            >&nbsp;<span
                              v-if="
                                comment.author.userId ===
                                  $store.getters.getUserId
                              "
                              @click="
                                delQuestionComment(
                                  questionDetail.comments,
                                  comment.commentId
                                )
                              "
                              class="link_color--text"
                              style="font-size:0.8rem; cursor: pointer"
                              >删除</span
                            >
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
                      icon
                      small
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
                    class="pb-2"
                  >
                    <v-text-field
                      :ref="'comment' + questionDetail.questionId"
                      v-model="comment.currentComment"
                      :rules="[rules.requiredComment, rules.max400]"
                      @keyup.enter.native="
                        sendComment(questionDetail.questionId)
                      "
                      @click:append-outer="
                        sendComment(questionDetail.questionId)
                      "
                      append-outer-icon="mdi-reply"
                      autofocus
                      class="pt-0 mt-0"
                      placeholder="@用户昵称 可回复/召唤⚡该用户，最多可召唤五个哦"
                    ></v-text-field>
                  </v-layout>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
          <!--所有回答-->
          <v-layout class="transparent mt-3" justify-space-between align-center
            ><v-card-title class="sub--text my_gray--text"
              >{{ questionDetail.answers.length }} 个回答</v-card-title
            >
          </v-layout>
          <div
            v-for="(answer, aIndex) in questionDetail.answers"
            :id="answer.answerId"
            :key="answer.answerId"
            class="mt-3"
          >
            <v-card
              flat
              exact
              width="100vw"
              style="padding: 0 10px;"
              class="pt-1 pr-md-4 right-box"
            >
              <v-layout justify-space-between>
                <v-flex md1 hidden-sm-and-down class="mt-12" align-center>
                  <v-layout column align-center>
                    <v-btn @click="voteAnswer(answer, true)" small icon fab>
                      <v-icon
                        :color="answer.isUseful === true ? 'success' : ''"
                        size="60"
                        >arrow_drop_up</v-icon
                      >
                    </v-btn>
                    <strong>{{ answer.voteNum }}</strong>
                    <v-btn @click="voteAnswer(answer, false)" small icon fab>
                      <v-icon
                        :color="answer.isUseful === false ? 'success' : ''"
                        size="60"
                        >arrow_drop_down</v-icon
                      >
                    </v-btn>
                    <!--<v-btn v-if="answer.isAccepted" color="success" icon fab>-->
                    <!--  <v-icon>check</v-icon>-->
                    <!--</v-btn>-->
                  </v-layout>
                </v-flex>
                <v-flex xs12 md11 class="ml-md-4 pr-md-3 pr-sm-0 pr-xs-0">
                  <v-layout
                    justify-end
                    style="min-height: 36px"
                    class="mb-2 mt-2"
                  >
                    <v-btn
                      v-if="
                        questionDetail.status === 0 &&
                          $store.getters.getUserId ===
                            questionDetail.author.userId
                      "
                      @click="
                        acceptConfirm.dialog = true
                        acceptConfirm.answer = answer
                      "
                      color="private"
                      text
                      style="height: 24px; padding: 0 10px; margin-right: 5px"
                    >
                      <v-icon>check</v-icon>
                      采纳
                    </v-btn>
                    <v-btn
                      v-if="$store.getters.getUserId === answer.author.userId"
                      @click="editAnswer(answer)"
                      color="private"
                      text
                      style="height: 24px; padding: 0 10px; margin-right: 5px"
                    >
                      <v-icon small>edit</v-icon>
                      编辑
                    </v-btn>
                    <v-chip
                      v-if="answer.isAccepted"
                      style="max-width:170px; text-decoration: none;border-radius: 0; color: white"
                      color="my_green"
                      small
                    >
                      推荐回答
                    </v-chip>
                  </v-layout>
                  <div v-dompurify-html="$md.render(answer.content)"></div>
                  <v-card-actions>
                    <v-layout justify-end>
                      <EditUserCard
                        :user="answer.author"
                        :create-time="answer.createTime"
                        :modified-time="answer.modifiedTime"
                        prefix="回答"
                      ></EditUserCard>
                    </v-layout>
                  </v-card-actions>
                  <!-- 评论区 -->
                  <v-divider></v-divider>
                  <v-layout justify-center column class="mt-2">
                    <v-layout justify-end>
                      <v-btn
                        @click="
                          $set(
                            showCommentInput,
                            answer.answerId,
                            !showCommentInput[answer.answerId]
                          )
                        "
                        small
                        text
                        >添加评论</v-btn
                      >
                    </v-layout>
                    <v-layout>
                      <v-list width="100vw" dense class="pb-5">
                        <div
                          v-for="(comment, _index) in answer.comments"
                          :key="comment.commentId"
                        >
                          <div
                            v-show="
                              showAllComments[answer.answerId]
                                ? true
                                : _index < 3
                            "
                          >
                            <v-list-item style="min-height: 28px">
                              <span style="font-size: 0.8rem">
                                {{ comment.content }}&nbsp;&nbsp;--&nbsp;
                                <router-link
                                  :to="'/user/' + comment.author.userId"
                                  style="text-decoration: none;font-size:0.8rem"
                                  >{{
                                    comment.author.nickname ||
                                      comment.author.username
                                  }}
                                </router-link>
                                <span
                                  :title="
                                    $options.filters.moment(comment.createTime)
                                  "
                                  class="my_gray--text"
                                  style="font-size: 0.8rem;"
                                  >&nbsp;{{
                                    comment.createTime | timeago
                                  }}</span
                                > </span
                              >&nbsp;<span
                                v-if="
                                  comment.author.userId ===
                                    $store.getters.getUserId
                                "
                                @click="
                                  delQuestionComment(
                                    answer.comments,
                                    comment.commentId
                                  )
                                "
                                class="link_color--text"
                                style="font-size:0.8rem; cursor: pointer"
                                >删除</span
                              >
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
                        icon
                        small
                      >
                        <v-icon
                          >expand_{{
                            showAllComments[answer.answerId] ? 'less' : 'more'
                          }}</v-icon
                        >
                      </v-btn>
                    </v-layout>
                    <!--  评论输入区-->
                    <v-layout
                      v-show="showCommentInput[answer.answerId]"
                      class="pb-2"
                    >
                      <v-text-field
                        ref="answerRef"
                        v-model="comment.currentComment"
                        :rules="[rules.requiredComment, rules.max400]"
                        @keyup.enter.native="sendAnswerComment(aIndex)"
                        @click:append-outer="sendAnswerComment(aIndex)"
                        placeholder="@用户昵称 可回复/召唤⚡该用户，最多可召唤五个哦"
                        class="pt-0 mt-0"
                        append-outer-icon="reply"
                        autofocus
                      ></v-text-field>
                    </v-layout>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </div>
          <!--<v-layout class="transparent" justify-space-between align-center-->
          <!--  ><v-card-title class="sub&#45;&#45;text my_gray&#45;&#45;text"-->
          <!--    >我的回答</v-card-title-->
          <!--  >-->
          <!--</v-layout>-->
          <v-layout class="mt-2">
            <v-flex>
              <Quill
                ref="answerQuill"
                :content="answer.content"
                :max="10000"
                :min="10"
                @update:contentCode="contentCode = $event"
                @update:errMsg="quillErrMsg = $event"
                class="answer-quill"
              ></Quill>
              <v-layout justify-end class="my-5">
                <v-btn
                  :loading="answer.loading"
                  @click="submitAnswer"
                  color="my_green"
                  class="white--text"
                  accent
                  depressed
                  min-width="150px"
                  >提交</v-btn
                >
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex lg3 justify-end shrink hidden-md-and-down class="ml-3 mt-4">
          <client-only>
            <right-user-card
              :user="questionDetail.author"
              :create-time="questionDetail.createTime"
              :modified-time="questionDetail.modifiedTime"
              :justify-end="false"
              prefix="提问"
              class="mb-2 right-box"
              width="100%"
            ></right-user-card>
            <RelatePost
              :exclude-id="questionDetail.questionId"
              :tags="questionDetail.tagInfos"
            ></RelatePost
          ></client-only>
        </v-flex>
      </v-layout>
      <!--<div class="float-action hidden-md-and-down">-->
      <!--  <v-flex shrink>-->
      <!--    <v-btn-->
      <!--      large-->
      <!--      icon-->
      <!--      class="d-block left-icon-btn"-->
      <!--      @click="voteQuestion(true)"-->
      <!--      ><v-icon-->
      <!--        :color="questionDetail.isUseful === true ? 'private' : 'my_gray'"-->
      <!--        small-->
      <!--        >mdi-thumb-up</v-icon-->
      <!--      ></v-btn-->
      <!--    >-->
      <!--    <v-btn-->
      <!--      large-->
      <!--      icon-->
      <!--      class="d-block mt-4 left-icon-btn"-->
      <!--      @click="collectQuestion"-->
      <!--      ><v-icon-->
      <!--        :color="questionDetail.isCollected ? 'private' : 'my_gray'"-->
      <!--        small-->
      <!--        >mdi-heart</v-icon-->
      <!--      ></v-btn-->
      <!--    >-->
      <!--  </v-flex>-->
      <!--</div>-->
    </v-app>
    <v-dialog v-model="similarMark.dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span style="font-size: 1rem">相似标记</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="similarMark.toQuestionLink"
            :rules="[rules.matchQuestionLink]"
            :error-messages="similarMark.errorMsg"
            label="输入相似问题的链接"
          ></v-text-field>
          <small class="private--text"
            >合理的标记可以帮助小伙伴们寻找答案，提升自己的声望。同时滥用标记，关联无关问题也将受到惩罚哦!</small
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="similarMark.dialog = false" small text>关闭 </v-btn>
          <v-btn
            :loading="similarMark.loading"
            @click="markQuestion"
            color="primary"
            small
            text
            >确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InfoDialog
      :msg="['提交成功', '提交失败']"
      :succeed="answer.resp != null && answer.resp.succeed"
      :dialog="answer.dialog"
      @update:dialog="answer.dialog = $event"
    >
    </InfoDialog>

    <InfoDialog
      :msg="['评论成功', '评论失败']"
      :succeed="comment.resp != null && comment.resp.succeed"
      :dialog="comment.dialog"
      @update:dialog="comment.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['采纳成功', '采纳失败']"
      :succeed="accept.resp != null && accept.resp.succeed"
      :dialog="accept.dialog"
      @update:dialog="accept.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['标记成功', similarMark.resp && similarMark.resp.msg]"
      :succeed="similarMark.resp != null && similarMark.resp.succeed"
      :dialog="similarMark.respDialog"
      @update:dialog="similarMark.respDialog = $event"
    >
    </InfoDialog>
    <ConfirmDialog
      :dialog="acceptConfirm.dialog"
      :todo="acceptAnswer"
      @update:dialog="acceptConfirm.dialog = $event"
      msg="确定采纳该回答?"
    ></ConfirmDialog>
  </div>
</template>
<script>
import InfoDialog from '../../../components/dialog/InfoDialog'
import TagChip from '../../../components/tag/TagChip'
import ConfirmDialog from '../../../components/dialog/ConfirmDialog'
import Quill from '../../../components/post/Quill'
import RelatePost from '../../../components/rightBox/RelatePost'
import EditUserCard from '../../../components/userCard/EditUserCard'
import RightUserCard from '../../../components/userCard/RightUserCard'

export default {
  name: 'QuestionDetail',
  components: {
    RightUserCard,
    EditUserCard,
    RelatePost,
    Quill,
    ConfirmDialog,
    TagChip,
    InfoDialog
  },
  validate({ params }) {
    return /^\d{18}$/.test(params.id)
  },
  data: () => ({
    watchMouseOver: false,
    contentCode: '',
    quillErrMsg: null,
    questionDetail: null,
    // 控制更多评论的显示隐藏
    showAllComments: {},
    // 控制评论输入框的下是隐藏
    showCommentInput: {},
    // 相似标记
    similarMark: {
      dialog: false,
      toQuestionLink: null,
      resp: null,
      loading: false,
      respDialog: false,
      errorMsg: null
    },
    acceptConfirm: {
      dialog: false,
      answer: null
    },
    comment: {
      // 当前正在输入的评论
      currentComment: null,
      // 评论提示弹框
      dialog: false,
      // 回答结果
      resp: null
    },
    answer: {
      answerId: null,
      content: '',
      resp: null,
      dialog: false,
      loading: false
    },
    accept: {
      resp: null,
      dialog: false
    },
    rules: {
      min10: (v) => (v && v.length >= 10) || '不能少于10个字符',
      min20: (v) => (v && v.length >= 20) || '不能少于20个字符',
      max100: (v) => (v && v.length <= 100) || '不能超过100个字符',
      max10000: (v) => (v && v.length <= 10000) || '不能超过10000个字符',
      max400: (v) => (v && v.length) <= 400 || '不能超过400个字符',
      requiredComment: (v) => (v && v.trim().length > 0) || '评论不能为空',
      matchQuestionLink: (v) =>
        (v && /question\/(\d{18})/.test(v)) || '请输入有效的问题链接'
    },
    miniTop: false
  }),
  computed: {},
  watch: {},
  // ssr渲染
  async asyncData({ $axios, params }) {
    const resp = await $axios.$post('/questionInfo/getQuestionDetail', {
      questionId: params.id
    })
    const questionDetail = resp.data
    return { questionDetail }
  },
  head() {
    // 不能写成 head:()=>({}) https://stackoverflow.com/questions/46064245/nuxt-js-ssr-title-undefined
    return {
      title: this.questionDetail.tkd.title + ' -DEVA开发者社区',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.questionDetail.tkd.keywords.join(',')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.questionDetail.tkd.description
        }
      ]
    }
  },
  mounted() {
    this.pushBaidu()
    window.onscroll = () => {
      if (!/^\/question\/\d+$/.test(this.$route.path)) {
        return false
      }
      this.miniTop = document.documentElement.scrollTop > 30
    }
  },
  methods: {
    delQuestionComment(_comments, _commentId) {
      this.$axios
        .$post('/questionComment/delComment', {
          commentId: _commentId
        })
        .then((resp) => {
          if (resp.succeed) {
            for (let i = 0; i < _comments.length; ++i) {
              if (_comments[i].commentId === _commentId) {
                _comments.splice(i, 1)
                break
              }
            }
          }
        })
    },
    pushBaidu() {
      const bp = document.createElement('script')
      const curProtocol = window.location.protocol.split(':')[0]
      if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js'
      } else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js'
      }
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(bp, s)
    },
    editAnswer(_answer) {
      this.answer.content = _answer.content
      this.answer.answerId = _answer.answerId
      this.$refs.answerQuill.updateContent(_answer.content)
      this.$vuetify.goTo(9999, {
        duration: 245,
        offset: 0,
        easing: 'easeInCubic'
      })
    },
    markQuestion() {
      const questionId = this.similarMark.toQuestionLink.match(
        /question\/(\d{18})$/
      )[1]
      if (questionId === this.questionDetail.questionId) {
        this.similarMark.errorMsg = '该链接为当前问题链接'
        return
      }
      this.similarMark.loading = true
      this.$axios
        .$post('/similarMark/mark', {
          fromQuestionId: this.questionDetail.questionId,
          toQuestionId: questionId
        })
        .then((resp) => {
          this.similarMark.loading = false
          this.similarMark.resp = resp
          this.similarMark.respDialog = true
          if (resp.succeed) {
            this.similarMark.dialog = false
            this.questionDetail.similarMark = resp.data
          }
        })
        .catch((e) => {
          this.similarMark.loading = false
          if (e.response.status === 500) {
            this.similarMark.errorMsg = '系统异常'
          } else if (e.response.status === 403) {
            this.similarMark.errorMsg = '权限不足'
          }
        })
    },
    toBottom() {
      this.$vuetify.goTo(9999, {
        duration: 245,
        offset: 0,
        easing: 'easeInCubic'
      })
    },
    acceptAnswer() {
      const answer = this.acceptConfirm.answer
      if (!answer) {
        return false
      }
      this.$axios
        .$post('/questionInfo/acceptAnswer', {
          ownQuestionId: this.questionDetail.questionId,
          answerId: answer.answerId
        })
        .then((resp) => {
          this.accept.resp = resp
          this.accept.dialog = true
          if (resp.succeed) {
            this.questionDetail.status = 1
            answer.isAccepted = true
            this.acceptConfirm.answer = null
          }
        })
    },
    voteAnswer(answer, useful) {
      const _this = this
      this.$axios
        .$post('/answerVote/voteAnswer', {
          oldUseful: answer.isUseful,
          isUseful: useful,
          answerId: answer.answerId
        })
        .then((resp) => {
          if (resp.succeed) {
            answer.voteNum += Number(resp.data.voteDelta)
            answer.isUseful = resp.data.useful
          }
        })
        .catch((e) => {
          _this.comment.loading = false
        })
    },
    voteQuestion(useful) {
      const _this = this
      this.$axios
        .$post('/questionVote/voteQuestion', {
          oldUseful: this.questionDetail.isUseful,
          isUseful: useful,
          questionId: this.questionDetail.questionId
        })
        .then((resp) => {
          if (resp.succeed) {
            _this.questionDetail.voteNum += Number(resp.data.voteDelta)
            _this.questionDetail.isUseful = resp.data.useful
          }
        })
        .catch((e) => {
          _this.comment.loading = false
        })
    },
    sendComment(id) {
      if (this.$store.getters.getUserId && !this.$store.getters.getUserPhone) {
        this.$store.commit('setPhoneDialog', true)
        return false
      }
      if (!this.$refs['comment' + id].validate()) {
        return false
      }
      const _this = this
      this.$axios
        .$post('/questionComment/commentQuestion', {
          ownQuestionId: _this.questionDetail.questionId,
          content: _this.comment.currentComment
        })
        .then((resp) => {
          _this.comment.resp = resp
          if (resp.succeed) {
            _this.questionDetail.comments.push(resp.data)
            _this.comment.currentComment = null
          } else {
            _this.comment.dialog = true
          }
          this.$set(this.showCommentInput, id, false)
        })
        .catch((e) => {
          _this.comment.loading = false
        })
    },
    sendAnswerComment(index) {
      if (!this.$refs.answerRef[index].validate()) {
        return false
      }
      const _answer = this.questionDetail.answers[index]
      const _this = this
      this.$axios
        .$post('/questionComment/commentQuestion', {
          ownQuestionId: _this.questionDetail.questionId,
          ownAnswerId: _answer.answerId,
          content: _this.comment.currentComment
        })
        .then((resp) => {
          _this.comment.resp = resp
          if (resp.succeed) {
            _answer.comments.push(resp.data)
            _this.comment.currentComment = null
          } else {
            _this.comment.dialog = true
          }
          this.$set(this.showCommentInput, _answer.answerId, false)
        })
    },
    submitAnswer() {
      if (this.quillErrMsg) {
        return false
      }
      this.answer.loading = true
      const _this = this
      let _url = '/answerInfo/answerQuestion'
      if (this.answer.answerId) {
        _url = '/answerInfo/editAnswer'
      }
      this.$axios
        .$post(_url, {
          answerId: _this.answer.answerId,
          ownQuestionId: _this.questionDetail.questionId,
          content: _this.contentCode
        })
        .then((resp) => {
          _this.answer.resp = resp
          _this.answer.loading = false
          if (resp.succeed) {
            if (!this.answer.answerId) {
              // 不是编辑问题
              _this.questionDetail.answers.push(resp.data)
            } else {
              // 是编辑问题
              _this.questionDetail.answers.forEach((item) => {
                if (item.answerId === _this.answer.answerId) {
                  item.content = _this.contentCode
                  this.$vuetify.goTo(0, {
                    duration: 245,
                    offset: 0,
                    easing: 'easeInCubic'
                  })
                }
              })
            }
            _this.answer.content = ''
            _this.$refs.answerQuill.updateContent('')
            _this.answer.answerId = null
          }
          _this.answer.dialog = true
        })
        .catch((e) => {
          _this.answer.loading = false
        })
    },
    collectQuestion() {
      const _this = this
      this.$axios
        .$post('/questionCollect/collectQuestion', {
          questionId: _this.questionDetail.questionId
        })
        .then((resp) => {
          if (resp.succeed) {
            _this.questionDetail.isCollected = resp.data
            if (resp.data) {
              _this.questionDetail.collectNum += 1
            } else {
              _this.questionDetail.collectNum -= 1
            }
          }
        })
    },
    checkLogin() {
      if (!this.$store.state.userInfo) {
        this.$router.push('/user/login')
      }
    }
  }
}
</script>
<style scoped>
.mini-top {
  /*top: 0px !important;*/
  top: 62px !important;
  min-height: 50px !important;
  height: 50px;
  transition: all 200ms linear;
}
.mini-top h3 {
  height: 32px;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
}
.mini-top .title-label {
  display: none;
}
.mini-top .show-label {
  display: block;
}
.mini-top .flex-height {
  height: 32px;
}

.top {
  top: 62px !important;
  min-height: 150px !important;
  height: 160px;
  transition: all 100ms linear;
}
.top .show-label {
  display: none;
}
.top .flex-height {
  height: 140px;
}
</style>
