<template>
  <div v-if="!deleted">
    <v-list-item class="px-0">
      <v-card
        exact
        width="100vw"
        flat
        class="px-md-5 pr-md-6 py-md-1 pt-md-2 no-ripple pa-sm-0"
      >
        <v-layout>
          <v-flex md1>
            <v-layout
              column
              justify-space-around
              class="d-md-flex mr-1"
              hidden-sm-and-down
            >
              <div title="支持" class="num-div">
                <div class="num-span">
                  {{ item.voteNum }}
                </div>
                <div class="num-label">赞成</div>
              </div>
              <div
                v-if="type === 'question'"
                :title="item.status === 1 ? '已解决' : '待解决'"
                class="num-div answer-div"
                :class="item.status === 1 ? 'success' : ''"
              >
                <div class="num-span">
                  {{ item.answerNum }}
                </div>
                <div class="num-label">回答</div>
              </div>
              <div v-else title="喜欢" class="num-div">
                <div class="num-span">
                  {{ item.likeNum }}
                </div>
                <div class="num-label">喜欢</div>
              </div>
              <div title="浏览" class="num-div">
                <div class="num-span">
                  {{ item.viewNum }}
                </div>
                <div class="num-label">浏览</div>
              </div>
            </v-layout>
          </v-flex>
          <v-flex xs12 md11 style="margin-top: 4px">
            <v-btn
              height="30px"
              class="no-hover-active no-ripple title d-inline-block text-truncate text-left no-flex px-1"
              text
              color="link_color"
              :title="item.title"
              :to="'/' + type + '/' + (item.questionId || item.blogId)"
              >{{ item.title }}</v-btn
            >
            <v-card-text
              v-dompurify-html:noHtml="$md.render(item.content)"
              style="padding: 8px; min-height: 62px"
              class="title my_gray--text subtitle-1 label-description"
            >
            </v-card-text>
            <v-card-actions>
              <v-layout>
                <TagChip
                  v-for="tag in item.tagInfos"
                  :key="tag.tagId"
                  :tag-info="tag"
                  class="mr-3"
                ></TagChip>
              </v-layout>
            </v-card-actions>
          </v-flex>
        </v-layout>
        <v-row
          justify="end"
          align="center"
          class="hidden-sm-and-down"
          style="font-size: 14px;position:absolute;bottom:0;right: 24px;"
        >
          <user-chip :user="item.author" class="text--right"></user-chip>
          <small
            v-if="item.createTime === item.modifiedTime"
            class="my_gray--text"
            :title="$options.filters.moment(item.createTime)"
          >
            {{ item.createTime | timeago }}</small
          >
          <small
            v-else
            class="my_gray--text"
            :title="$options.filters.moment(item.modifiedTime)"
          >
            {{ item.modifiedTime | timeago }}</small
          >
          <small v-if="$store.getters.isAdmin">
            <v-btn
              small
              text
              color="private"
              @click="confirmDelete.dialog = true"
              >删除</v-btn
            >
          </small>
        </v-row>
        <ConfirmDialog
          :dialog="confirmDelete.dialog"
          :msg="
            '确定删除该' +
              (type === 'blog' ? '博文' : '问题') +
              '吗？该操作不可恢复'
          "
          :todo="type === 'blog' ? deleteBlog : deleteQuestion"
          @update:dialog="confirmDelete.dialog = $event"
        >
        </ConfirmDialog>
      </v-card>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>
<script>
import ConfirmDialog from './ConfirmDialog'
import TagChip from './TagChip'
import UserChip from './UserChip'
export default {
  components: {
    UserChip,
    TagChip,
    ConfirmDialog
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    // 是博文(blog)还是问题(question)
    type: {
      type: String,
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
          questionId: this.item.questionId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.deleted = true
          }
        })
    },
    deleteBlog() {
      this.$axios
        .$post('/admin/deleteBlog', {
          blogId: this.item.blogId
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
  margin-left: 2px;
  font-size: 14px;
}
.num-div {
  padding: 5px;
  border-radius: 3px;
  text-align: center;
}
.num-div.answer-div {
  border: 1px solid #5fba7d;
}
.num-div.success {
  background-color: #5fba7d !important;
  color: white;
}
.num-div .num-label {
  font-size: 12px;
}
.num-div.success .v-icon {
  color: white;
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
.theme--light .no-shadow-box {
  box-shadow: none;
  /*border: 1px solid #e7e7e7;*/
}
</style>
