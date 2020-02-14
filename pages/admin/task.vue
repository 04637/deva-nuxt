<template>
  <v-app>
    <v-layout column shrink>
      <v-card-title>管理</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-flex justify-center md9 sm12 class="ml-10">
      <v-layout class="mt-5" justify-center shrink>
        <v-card width="100%">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="搜索"
              single-line
              hide-details
              class="pa-0 mt-0"
            ></v-text-field>
          </v-card-title>
          <client-only>
            <v-data-table
              ref="table"
              v-if="$store.getters.isAdmin"
              :headers="headers"
              :items="tasks"
              :search="search"
              :loading="loading"
              locale="zh-CN"
              class="elevation-1"
              item-key="messageId"
            >
              <template v-slot:item.content="{ item }">
                <v-row align="center">
                  <span
                    style="max-width: 300px"
                    class="pl-2 d-inline-block text-truncate"
                    >{{ item.content }}</span
                  >
                  <v-btn
                    @click="
                      taskDialog.task = item
                      taskDialog.viewDetail = true
                    "
                    text
                    small
                    color="warning"
                    style="position:relative;"
                  >
                    查看详情
                  </v-btn>
                  <v-btn
                    v-if="item.relateQuestionId"
                    @click="$router.push('/question/' + item.relateQuestionId)"
                    text
                    small
                    color="warning"
                    >查看相关问题</v-btn
                  >
                  <v-btn
                    v-if="item.relateUserId"
                    @click="$router.push('/user/' + item.relateUserId)"
                    text
                    small
                    color="warning"
                    >查看相关用户</v-btn
                  ></v-row
                >
              </template>
              <template v-slot:item.creator.nickname="{ item }">
                <v-btn
                  v-if="item.creator"
                  @click="$router.push('/user/' + item.creatorId)"
                  text
                  color="primary"
                  >{{ item.creator.nickname }}</v-btn
                >
              </template>
              <template v-slot:item.replyUser.nickname="{ item }">
                <v-btn
                  v-if="item.replyUser"
                  @click="$router.push('/user/' + item.creatorId)"
                  text
                  color="primary"
                  style="position:relative; top:-2px;"
                  >{{ item.replyUser.nickname }}</v-btn
                >
              </template>
              <template v-slot:item.createTime="{ item }">
                <span :title="$options.filters.moment(item.createTime)">{{
                  item.createTime | timeago
                }}</span>
              </template>
              <template v-slot:item.modifiedTime="{ item }">
                <span
                  v-if="item.status !== 0"
                  :title="$options.filters.moment(item.modifiedTime)"
                  >{{ item.modifiedTime | timeago }}</span
                >
              </template>
              <template v-slot:item.status="{ item }">
                <v-icon v-if="item.status === 1" color="success" title="已处理"
                  >check</v-icon
                >
                <v-icon v-else color="error" title="待处理">minimize</v-icon>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon
                  v-if="item.status === 0"
                  @click="dealTask(item)"
                  title="回复用户"
                  small
                  class="mr-2"
                >
                  mdi-comment
                </v-icon>
                <v-icon
                  v-else
                  @click="
                    taskDialog.task = item
                    taskDialog.viewDialog = true
                  "
                  title="查看回复内容"
                  small
                  class="mr-2"
                >
                  mdi-comment-eye
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn @click="initialize" color="primary">Reset</v-btn>
              </template>
            </v-data-table>
          </client-only>
        </v-card>
      </v-layout>
      <v-layout class="mt-5" justify-center shrink>
        <v-card width="100%">
          <v-card-text>
            <v-form ref="noticeForm">
              <v-text-field
                v-model="newSystemNotice.content"
                :counter="300"
                :rules="[rules.max300]"
                @keyup.enter.native="newSystemNotice.confirmDialog = true"
                @click:append="newSystemNotice.confirmDialog = true"
                label="发布公告"
                append-icon="volume_down"
              >
              </v-text-field>
              <v-text-field v-show="false"> </v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
      </v-layout>
      <v-layout class="mt-5" justify-center shrink>
        <v-card width="100%">
          <v-layout align-center>
            <v-btn color="blue" text to="/">问题管理</v-btn>|
            <v-btn color="blue" text to="/blog/blogList"
              ><span>博文管理</span></v-btn
            >|
            <v-btn color="blue" text to="/user/users"
              ><span>用户管理</span></v-btn
            >|
            <v-btn color="blue" text to="/tag/tags"><span>标签管理</span></v-btn
            >|<v-btn color="blue" text to="/admin/space"
              ><span>空间管理</span></v-btn
            >
          </v-layout>
        </v-card>
      </v-layout>
      <v-layout class="mt-5" justify-center shrink>
        <v-card width="100%">
          <v-card-text
            ><span
              >在线人数：<span class="primary--text">{{
                monitor.onlineCount
              }}</span>
              / {{ monitor.userCount }}</span
            >

            <span class="ml-5"
              >已解决问题：<span class="primary--text">{{
                monitor.solvedQuestionCount
              }}</span>
              / {{ monitor.questionCount }}</span
            >
          </v-card-text>
        </v-card>
      </v-layout>
    </v-flex>
    <v-dialog
      v-if="taskDialog.task"
      v-model="taskDialog.dialog"
      persistent
      max-width="40vw"
    >
      <v-card>
        <v-card-title>
          <!--<span class="headline">处理任务</span>-->
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="dealTaskForm">
            <v-textarea
              v-model="taskDialog.task.replyContent"
              :rules="[rules.min10, rules.max1000]"
              :counter="1000"
              no-resize
              label="输入您的回复"
              autofocus
              rows="20"
            ></v-textarea>
          </v-form>
          <small class="error--text">{{ taskDialog.errorMsg }}</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="
              taskDialog.dialog = false
              taskDialog.errorMsg = null
            "
            text
            >关闭
          </v-btn>
          <v-btn
            :loading="taskDialog.loading"
            @click="submitReply"
            text
            color="primary"
            ><span>提交</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="taskDialog.viewDialog" persistent max-width="40vw">
      <v-card>
        <v-card-title>
          <!--<span class="headline">回复内容</span>-->
        </v-card-title>
        <v-card-text class="pb-0">
          <v-textarea
            v-if="taskDialog.task"
            :value="taskDialog.task.replyContent"
            hide-details
            no-resize
            readonly
            autofocus
            rows="20"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="taskDialog.viewDialog = false" text>关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="taskDialog.viewDetail" persistent max-width="40vw">
      <v-card>
        <v-card-title>
          <!--<span class="headline">回复内容</span>-->
        </v-card-title>
        <v-card-text class="pb-0">
          <v-textarea
            v-if="taskDialog.task"
            :value="taskDialog.task.content"
            hide-details
            readonly
            rows="20"
            autofocus
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="taskDialog.viewDetail = false" text>关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      :dialog="newSystemNotice.confirmDialog"
      :todo="sendSystemNotice"
      @update:dialog="newSystemNotice.confirmDialog = $event"
      msg="确定发布公告吗?"
    ></ConfirmDialog>
    <InfoDialog
      :msg="[
        '发布成功',
        newSystemNotice.result.resp && newSystemNotice.result.resp.msg
      ]"
      :succeed="
        newSystemNotice.result.resp != null &&
          newSystemNotice.result.resp.succeed
      "
      :dialog="newSystemNotice.result.dialog"
      @update:dialog="newSystemNotice.result.dialog = $event"
      close-txt="关闭"
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import ConfirmDialog from '../../components/dialog/ConfirmDialog'
import InfoDialog from '../../components/dialog/InfoDialog'
export default {
  components: { InfoDialog, ConfirmDialog },
  data: () => ({
    search: '',
    loading: false,
    headers: [
      {
        text: '建议/投诉',
        sortable: false,
        align: 'left',
        value: 'content'
      },
      {
        text: '创建人',
        align: 'center',
        value: 'creator.nickname',
        sortable: false
      },
      { text: '创建时间', value: 'createTime' },
      {
        text: '处理人',
        align: 'center',
        value: 'replyUser.nickname'
      },
      { text: '处理时间', value: 'modifiedTime' },
      { text: '状态', value: 'status', sortable: false },
      { text: '操作', align: 'center', value: 'action', sortable: false }
    ],
    tasks: [],
    taskDialog: {
      dialog: false,
      loading: false,
      task: null,
      errorMsg: null,
      viewDialog: false,
      viewDetail: false
    },
    monitor: {
      onlineCount: null,
      userCount: null,
      questionCount: null,
      solvedQuestionCount: null
    },
    newSystemNotice: {
      content: null,
      confirmDialog: false,
      result: {
        resp: null,
        dialog: false
      }
    },
    rules: {
      max1000: (v) => (v && v.length <= 1000) || '不能超过1000个字符',
      min10: (v) => (v && v.length > 10) || '最少为10个字符哦',
      max300: (v) => !v || (v && v.length <= 300) || '不能超过300个字符'
    },
    intervalId: null
  }),
  created() {},
  mounted() {
    this.loadTasks()
    this.loadInterval()
  },
  methods: {
    loadTasks() {
      this.loading = true
      this.$axios.$post('/adminTask/listTasks').then((resp) => {
        if (resp.succeed) {
          this.loading = false
          this.tasks = resp.data
        }
      })
    },
    dealTask(item) {
      this.taskDialog.task = item
      this.taskDialog.dialog = true
    },
    loadInterval() {
      clearInterval(this.intervalId)
      const _this = this
      _this.$axios.$post('/admin/monitor').then((resp) => {
        if (resp.succeed) {
          _this.monitor = resp.data
        }
      })
      this.intervalId = setInterval(function() {
        if (
          _this.$store.getters.isAdmin &&
          _this.$route.path === '/admin/task'
        ) {
          _this.$axios.$post('/admin/monitor').then((resp) => {
            if (resp.succeed) {
              _this.monitor = resp.data
            }
          })
        }
      }, 30000)
    },
    submitReply() {
      if (!this.$refs.dealTaskForm.validate()) {
        return false
      }
      this.taskDialog.loading = true
      this.$axios
        .$post('/adminTask/dealTask', {
          replyContent: this.taskDialog.task.replyContent,
          taskId: this.taskDialog.task.taskId
        })
        .then((resp) => {
          this.taskDialog.loading = false
          if (resp.succeed) {
            this.taskDialog.dialog = false
            this.taskDialog.task.replyUser = resp.data.replyUser
            this.taskDialog.task.status = resp.data.status
          } else {
            this.taskDialog.errorMsg = resp.msg
          }
        })
        .catch((e) => {
          this.taskDialog.loading = false
        })
    },
    sendSystemNotice() {
      if (!this.$refs.noticeForm.validate()) {
        return false
      }
      this.$axios
        .$post('/systemNotice/create', {
          content: this.newSystemNotice.content
        })
        .then((resp) => {
          this.newSystemNotice.result.resp = resp
          this.newSystemNotice.result.dialog = true
        })
    }
  },
  beforeRouteLeave(from, to, next) {
    clearInterval(this.intervalId)
    next()
  }
}
</script>
