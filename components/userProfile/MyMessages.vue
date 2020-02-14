<template>
  <div>
    <v-flex hidden-sm-and-down md6>
      <v-text-field
        v-model="search"
        placeholder="搜索"
        style="width: 300px"
        append-icon="search"
        class="min-input"
        hide-details
        solo
      ></v-text-field>
    </v-flex>
    <v-data-table
      ref="table"
      v-if="$store.state.userInfo"
      :headers="headers"
      :items="messages"
      :search="search"
      :show-select="!isSmall()"
      :mobile-breakpoint="-1"
      :loading="loading"
      class="mt-1"
      locale="zh-CN"
      item-key="messageId"
      hide-default-header
    >
      <template v-slot:item.content="{ item }">
        <v-row align="center">
          <span
            :class="isSmall() ? '_sm_width' : ''"
            class="d-inline-block text-truncate"
          >
            <router-link
              :to="'/user/' + item.fromUserId"
              style="text-decoration: none"
              >{{ item.fromUserNickname }}</router-link
            >&nbsp;{{ $options.filters.filterHtml(item.content) }}</span
          >
          <v-btn
            v-if="item.ownQuestionId"
            @click="
              readMessage(item)
              $router.push(
                '/question/' +
                  item.ownQuestionId +
                  (item.anchor ? item.anchor : '')
              )
            "
            class="hidden-sm-and-down"
            text
            small
            color="private"
            >查看</v-btn
          >
          <v-btn
            v-else-if="item.ownBlogId"
            @click="
              readMessage(item)
              $router.push('/blog/' + item.ownBlogId)
            "
            class="hidden-sm-and-down"
            text
            small
            color="private"
            >查看</v-btn
          >
          <v-btn
            v-else
            @click="
              readMessage(item)
              viewTask(item.relateTaskId)
            "
            class="hidden-sm-and-down"
            text
            small
            color="private"
            >查看</v-btn
          >
          <svg
            v-if="!item.isRead"
            class="icon hidden-sm-and-down"
            style="width: 13px;height: 13px; position: relative; top: -6px; left: -13px"
          >
            <use xlink:href="#icon-unread"></use>
          </svg>
        </v-row>
      </template>
      <template v-slot:item.createTime="{ item }">
        <span :title="$options.filters.moment(item.createTime)">{{
          item.createTime | timeago
        }}</span>
      </template>
      <template v-slot:header>
        <thead class="data-table-header hidden-sm-and-down">
          <tr>
            <td>
              <v-simple-checkbox
                :value="allSelected"
                :indeterminate="allIndeterminate && !allSelected"
                @input="toggleSelectAll"
              ></v-simple-checkbox>
            </td>
            <td class="pl-0">
              <v-btn @click="ignoreSelected" small depressed>
                <v-icon small>mdi-notification-clear-all</v-icon>
                <span class="body-1">忽略已选消息</span>
              </v-btn>
              <v-btn @click="deleteConfirm.dialog = true" small depressed>
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
            :value="taskView.taskInfo.content"
            hide-details
            readonly
            rows="10"
          ></v-textarea>
        </v-card-text>
        <v-card-text class="pt-0 pb-0">
          <span>管理员回复</span>
          <v-textarea
            v-if="taskView.taskInfo"
            :value="taskView.taskInfo.replyContent"
            hide-details
            readonly
            rows="10"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="taskView.dialog = false" text>关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ConfirmDialog from '../dialog/ConfirmDialog'
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
    },
    isSmall() {
      return (
        this.$vuetify.breakpoint.name === 'sm' ||
        this.$vuetify.breakpoint.name === 'xs'
      )
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
<style>
.v-data-table__mobile-row {
  max-width: 100vw !important;
}
._sm_width {
  width: 90vw;
  text-align: left;
}
</style>
