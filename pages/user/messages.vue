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
      <v-card width="60vw">
        <v-card-title>
          <v-btn text small depressed>
            <v-icon>playlist_add_check</v-icon>
            <span class="body-1">忽略已选消息</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
            class="pa-0 mt-0"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          v-if="$store.state.userInfo"
          :headers="headers"
          :items="messages"
          class="elevation-1"
          item-key="id"
          :search="search"
          show-select
          no-data-text="无数据"
        >
          <template v-slot:item.content="{ item }">
            <router-link :to="'/user/' + item.fromUserId">{{
              item.fromUserNickname
            }}</router-link
            >&nbsp;{{ item.content }}
            <router-link :to="'/question/' + item.ownQuestionId"
              >查看该问题</router-link
            >
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small title="忽略" @click="deleteItem(item)">
              notifications_off
            </v-icon>
            <v-icon small title="删除" @click="deleteItem(item)">
              delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-layout>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    search: '',
    headers: [
      {
        text: '消息内容',
        align: 'left',
        sortable: false,
        value: 'content'
      },
      { text: '操作', value: 'action', sortable: false, align: 'center' }
    ],
    messages: []
  }),

  created() {
    this.loadMessages()
  },
  mounted() {},

  methods: {
    deleteItem(item) {
      const index = this.items.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.items.splice(index, 1)
    },
    loadMessages() {
      this.$axios.$post('/messageInfo/getMessages').then((resp) => {
        if (resp.succeed) {
          this.messages = resp.data
        }
      })
    }
  }
}
</script>
<style scoped></style>
