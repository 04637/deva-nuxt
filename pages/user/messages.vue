<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-card-title>
          我的消息
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center shrink>
      <v-card width="60vw" class="no-shadow-box">
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
          v-if="$store.state.userInfo"
          ref="table"
          locale="zh-CN"
          :headers="headers"
          :items="messages"
          class="elevation-1"
          item-key="messageId"
          :search="search"
          show-select
          hide-default-header
          :loading="loading"
        >
          <template v-slot:item.content="{ item }">
            <v-row align="center">
              <router-link
                :to="'/user/' + item.fromUserId"
                style=" position: relative; top: -1px "
                >{{ item.fromUserNickname }}</router-link
              >&nbsp;{{ $options.filters.filterHtml(item.content) }}
              <v-btn
                v-if="item.ownQuestionId"
                class="hover-line"
                text
                small
                color="private"
                @click="
                  readMessage(item)
                  $router.push(
                    '/question/' +
                      item.ownQuestionId +
                      (item.anchor ? item.anchor : '')
                  )
                "
                >查看</v-btn
              >
              <v-btn
                v-else-if="item.ownBlogId"
                class="hover-line"
                text
                small
                color="private"
                @click="
                  readMessage(item)
                  $router.push('/blog/' + item.ownBlogId)
                "
                >查看</v-btn
              >
              <v-btn
                v-else
                class="hover-line"
                text
                small
                color="private"
                @click="
                  readMessage(item)
                  viewTask(item.relateTaskId)
                "
                >查看</v-btn
              >
              <svg
                v-if="!item.isRead"
                class="icon"
                style="width: 13px;height: 13px; position: relative; top: -6px; left: -13px"
              >
                <use xlink:href="#icon-unread"></use>
              </svg>
            </v-row>
          </template>
          <template v-slot:item.createTime="{ item }">
            <span>{{ item.createTime | moment }}</span>
          </template>
          <template v-slot:header>
            <thead class="data-table-header">
              <tr>
                <td>
                  <v-simple-checkbox
                    :value="allSelected"
                    :indeterminate="allIndeterminate && !allSelected"
                    @input="toggleSelectAll"
                  ></v-simple-checkbox>
                </td>
                <td class="pl-0">
                  <v-btn small depressed @click="ignoreSelected">
                    <v-icon small>mdi-notification-clear-all</v-icon>
                    <span class="body-1">忽略已选消息</span>
                  </v-btn>
                  <v-btn small depressed @click="deleteConfirm.dialog = true">
                    <v-icon small>mdi-delete-sweep-outline</v-icon>
                    <span class="body-1">删除已选消息</span>
                  </v-btn>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="height: 1px; padding: 0">
                  <v-divider></v-divider>
                </td>
              </tr>
            </thead>
          </template>
        </v-data-table>
      </v-card>
    </v-layout>
    <ConfirmDialog
      :msg="deleteConfirm.msg"
      :dialog="deleteConfirm.dialog"
      :todo="deleteSelected"
      @update:dialog="deleteConfirm.dialog = $event"
    ></ConfirmDialog>
    <v-dialog v-model="taskView.dialog" persistent max-width="40vw">
      <v-card>
        <v-card-title>
          <!--<span class="headline">回复内容</span>-->
        </v-card-title>
        <v-card-text class="pt-0">
          <span>您的提议</span>
          <v-textarea
            v-if="taskView.taskInfo"
            hide-details
            readonly
            rows="10"
            :value="taskView.taskInfo.content"
          ></v-textarea>
        </v-card-text>
        <v-card-text class="pt-0 pb-0">
          <span>管理员回复</span>
          <v-textarea
            v-if="taskView.taskInfo"
            hide-details
            readonly
            rows="10"
            :value="taskView.taskInfo.replyContent"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="taskView.dialog = false">关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import ConfirmDialog from '../../components/ConfirmDialog'
export default {
  components: {
    ConfirmDialog
  },
  data: () => ({
    dialog: false,
    search: '',
    loading: false,
    headers: [
      {
        align: 'left',
        sortable: false,
        value: 'content'
      },
      {
        align: 'center',
        sortable: true,
        value: 'createTime'
      }
    ],
    messages: [],
    allSelected: false,
    deleteConfirm: {
      result: false,
      dialog: false,
      msg: '您确定要删除选中消息吗?'
    },
    taskView: {
      dialog: false,
      taskInfo: null
    }
  }),
  computed: {
    allIndeterminate() {
      const _table = this.$refs.table
      let _b = false
      this.messages.forEach((item) => {
        if (_table.isSelected(item)) {
          _b = true
          return false
        }
      })
      return _b
    }
  },

  created() {
    this.loadMessages()
  },
  mounted() {},
  methods: {
    viewTask(_taskId) {
      this.$axios
        .$post('/adminTask/getTaskInfo', {
          taskId: _taskId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.taskView.taskInfo = resp.data
            this.taskView.dialog = true
          }
        })
    },
    toggleSelectAll() {
      const _table = this.$refs.table
      this.allSelected = !this.allSelected
      // 参考 https://github.com/vuetifyjs/vuetify/issues/7115
      _table.toggleSelectAll(this.allSelected)
    },
    ignoreSelected() {
      const _table = this.$refs.table
      const _selectedItems = this.messages.filter((item) =>
        _table.isSelected(item)
      )
      const _selectedId = _selectedItems.map((item) => {
        return item.messageId
      })
      if (!_selectedId || _selectedId.length < 1) {
        return false
      }
      this.$axios
        .$post('/messageInfo/ignoreMessages', {
          messageIds: _selectedId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.messages.forEach((item) => {
              if (_selectedItems.includes(item)) {
                // 深度监听更改 https://cn.vuejs.org/v2/guide/reactivity.html
                this.$set(item, 'isRead', true)
              }
            })
            _table.toggleSelectAll(false)
            this.allSelected = false
            this.countUnRead()
          }
        })
    },
    deleteSelected() {
      const _table = this.$refs.table
      const _selectedItems = this.messages.filter((item) =>
        _table.isSelected(item)
      )
      const _selectedId = _selectedItems.map((item) => {
        return item.messageId
      })
      if (!_selectedId || _selectedId.length < 1) {
        return false
      }
      this.$axios
        .$post('/messageInfo/deleteMessages', {
          messageIds: _selectedId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.loadMessages()
            _table.toggleSelectAll(false)
            this.allSelected = false
            this.deleteConfirm.result = false
            this.countUnRead()
          }
        })
    },
    readMessage(item) {
      this.$axios
        .$post('/messageInfo/readMessage', {
          messageId: item.messageId
        })
        .then((resp) => {
          if (resp.succeed) {
            item.isRead = true
            this.countUnRead()
          }
        })
    },
    loadMessages() {
      this.loading = true
      this.$axios.$post('/messageInfo/getMessages').then((resp) => {
        if (resp.succeed) {
          this.messages = resp.data
          this.loading = false
        }
      })
    },
    countUnRead() {
      let _hasNew = 0
      this.messages.some((item) => {
        if (!item.isRead) {
          _hasNew = 1
          return true
        }
      })
      this.$store.commit('setUnreadMessageCount', _hasNew)
    }
  }
}
</script>
<style scoped>
thead:nth-child(3) {
  display: none !important;
}
.theme--light .no-shadow-box {
  box-shadow: none;
  border: 1px solid #e7e7e7;
}
.theme--dark .no-shadow-box {
  box-shadow: none;
  border: 1px solid #4b4b4b;
}
</style>
