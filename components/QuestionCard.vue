<template>
  <div v-if="!deleted">
    <v-list-item class="px-0">
      <v-card
        flat
        exact
        width="100vw"
        class="px-5 pr-6 py-1 pt-2 no-ripple"
        :to="$store.getters.isAdmin ? '' : '/question/' + question.questionId"
      >
        <v-layout>
          <v-layout
            column
            justify-space-around
            class="d-md-flex"
            hidden-sm-and-down
          >
            <div title="回答">
              <v-icon small>mdi-comment-text-outline</v-icon>
              <span class="num-span">{{ question.answerNum }}</span>
            </div>
            <div title="支持">
              <v-icon small>mdi-thumb-up-outline</v-icon>
              <span class="num-span">{{ question.voteNum }}</span>
            </div>
            <div title="浏览">
              <v-icon small>mdi-cursor-default-click-outline</v-icon>
              <span class="num-span">{{ question.viewNum }}</span>
            </div>
          </v-layout>
          <v-flex xs9 style="margin-top: 4px">
            <v-btn
              height="30px"
              class="no-hover-active title d-inline-block text-truncate text-left no-flex px-1"
              text
              max-width="85%"
              :title="question.title"
              :to="'/question/' + question.questionId"
              >{{ question.title }}</v-btn
            >
            <v-icon v-if="question.status === 1" color="primary" title="已采纳"
              >check</v-icon
            >
            <v-card-text
              v-dompurify-html:noHtml="$md.render(question.content)"
              style="padding: 8px; min-height: 42px"
              class="title my_gray--text subtitle-1 label-description"
            >
            </v-card-text>
            <v-card-actions>
              <v-layout>
                <TagChip
                  v-for="tag in question.tagInfos"
                  :key="tag.tagId"
                  :tag-info="tag"
                  class="mr-3"
                ></TagChip>
              </v-layout>
            </v-card-actions>
          </v-flex>
          <v-row class="pr-2 ml-2" cols="2" justify="end" style="width:15%">
            <v-row justify="end" dense class="my_gray--text">
              <small
                v-if="question.createTime === question.modifiedTime"
                :title="$options.filters.moment(question.createTime)"
              >
                提问于 {{ question.createTime | timeago }}</small
              >
              <small
                v-else
                :title="$options.filters.moment(question.modifiedTime)"
              >
                更新于 {{ question.modifiedTime | timeago }}</small
              >
              <small v-if="$store.getters.isAdmin">
                <v-btn
                  small
                  text
                  color="private"
                  style="margin-top: -4px;font-weight: bold;position:relative;left:16px"
                  @click="confirmDelete.dialog = true"
                  >删除</v-btn
                >
              </small>
            </v-row>
            <v-row justify="end" dense style="width:100%">
              <v-col cols="6" align-self="end">
                <v-row justify="end">
                  <v-btn
                    min-width="0"
                    text
                    color="my_gray"
                    class="text-truncate d-inline-block text-left no-flex px-1"
                    :to="'/user/' + question.author.userId"
                    height="21px"
                  >
                    <span>{{
                      question.author.nickname || question.author.username
                    }}</span>
                  </v-btn>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <!--suppress HtmlDeprecatedAttribute -->
              <v-col cols="5" align-self="end">
                <v-row justify="end" align="end" style="font-size: 14px">
                  <v-layout justify-center align-center>
                    <v-icon small color="red" title="用户声望"
                      >mdi-music-clef-bass</v-icon
                    >&nbsp;{{ question.author.reputation }}
                  </v-layout>
                </v-row>
              </v-col>
            </v-row>
          </v-row>
        </v-layout>
        <ConfirmDialog
          :dialog="confirmDelete.dialog"
          msg="确定删除该问题吗？该操作不可恢复"
          :todo="deleteQuestion"
          @update:dialog="confirmDelete.dialog = $event"
        >
        </ConfirmDialog>
      </v-card>
    </v-list-item>
    <div :class="$vuetify.theme.dark ? 'dark-divider' : 'light-divider'"></div>
  </div>
</template>
<script>
import ConfirmDialog from './ConfirmDialog'
import TagChip from './TagChip'
export default {
  components: {
    TagChip,
    ConfirmDialog
  },
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    confirmDelete: {
      dialog: false
    },
    deleted: false
  }),
  methods: {
    deleteQuestion() {
      this.$axios
        .$post('/admin/deleteQuestion', {
          questionId: this.question.questionId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.deleted = true
          }
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
  margin-left: 7px;
  font-size: 14px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 2px;
}
.label-description {
  font-size: 14px;
  /*text-indent: 12px;*/
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  max-height: 62px;
}
</style>
