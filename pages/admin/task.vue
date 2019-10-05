<template>
  <v-app>
    <v-layout column shrink>
      <v-card-title>建议/举报管理</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center shrink>
      <v-card width="60vw">
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
        <v-data-table
          v-if="$store.getters.isAdmin"
          ref="table"
          locale="zh-CN"
          :headers="headers"
          :items="tasks"
          class="elevation-1"
          item-key="messageId"
          :search="search"
          :loading="loading"
        >
          <template v-slot:item.content="{ item }">
            <v-row align="center">
              <span
                style="width: 300px"
                class="pl-2 d-inline-block text-truncate"
                >{{ item.content }}</span
              >
              <v-btn
                text
                x-small
                color="warning"
                style="position:relative;"
                @click="
                  taskDialog.task = item
                  taskDialog.viewDetail = true
                "
              >
                查看详情
              </v-btn>
              <v-btn
                v-if="item.relateQuestionId"
                text
                x-small
                color="warning"
                style="position:relative; top:-2px;"
                @click="$router.push('/question/' + item.relateQuestionId)"
                >查看相关问题</v-btn
              >
              <v-btn
                v-if="item.relateUserId"
                text
                x-small
                color="warning"
                style="position:relative; top:-2px;"
                @click="$router.push('/user/' + item.relateUserId)"
                >查看相关用户</v-btn
              ></v-row
            >
          </template>
          <template v-slot:item.creator.nickname="{ item }">
            <v-btn
              v-if="item.creator"
              text
              x-small
              color="primary"
              style="position:relative; top:-2px;"
              @click="$router.push('/user/' + item.creatorId)"
              >{{ item.creator.nickname }}</v-btn
            >
          </template>
          <template v-slot:item.replyUser.nickname="{ item }">
            <v-btn
              v-if="item.replyUser"
              text
              x-small
              color="primary"
              style="position:relative; top:-2px;"
              @click="$router.push('/user/' + item.creatorId)"
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
              title="回复用户"
              small
              class="mr-2"
              @click="dealTask(item)"
            >
              mdi-comment
            </v-icon>
            <v-icon
              v-else
              title="查看回复内容"
              small
              class="mr-2"
              @click="
                taskDialog.task = item
                taskDialog.viewDialog = true
              "
            >
              mdi-comment-eye
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-layout>
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
              label="输入您的回复"
              :rules="[rules.min10, rules.max1000]"
              autofocus
              rows="20"
              :counter="1000"
            ></v-textarea>
          </v-form>
          <small class="error--text">{{ taskDialog.errorMsg }}</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              taskDialog.dialog = false
              taskDialog.errorMsg = null
            "
            >关闭
          </v-btn>
          <v-btn
            text
            color="primary"
            :loading="taskDialog.loading"
            @click="submitReply"
            ><strong>提交</strong>
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
            hide-details
            readonly
            :value="taskDialog.task.replyContent"
            autofocus
            rows="20"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="taskDialog.viewDialog = false">关闭 </v-btn>
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
            hide-details
            readonly
            rows="20"
            :value="taskDialog.task.content"
            autofocus
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="taskDialog.viewDetail = false">关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    search: '',
    loading: false,
    headers: [
      {
        text: '内容',
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
    rules: {
      max1000: (v) => (v && v.length <= 1000) || '不能超过1000个字符',
      min10: (v) => (v && v.length > 10) || '最少为10个字符哦'
    }
  }),
  created() {
    this.loadTasks()
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
    }
  }
}
</script>
