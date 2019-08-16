<template>
  <v-container justify-center align-start>
    <v-layout column>
      <v-layout>
        <v-card-title>
          我的消息
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center>
      <v-card width="60vw">
        <v-card-title>
          <v-btn>
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
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
          item-key="id"
          :search="search"
          show-select
        >
          <template v-slot:item.title="{ item }">
            {{ item.title }}
            <router-link to="questionDetail">查看该问题</router-link>
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
  </v-container>
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
        value: 'title'
      },
      { text: '操作', value: 'action', sortable: false, align: 'center' }
    ],
    items: []
  }),

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.items = [
        {
          id: '1',
          title: '你是谁你为什么评论我的问题',
          status: '未读'
        },
        {
          id: '2',
          title: '你是谁你为什么评论我的问题',
          status: '未读'
        },
        {
          id: '3',
          title: '你是谁你为什么评论我的问题',
          status: '已读'
        },
        {
          id: '4',
          title: '你是谁你为什么评论我的问题',
          status: '未读'
        },
        {
          id: '5',
          title: '你是谁你为什么评论我的问题',
          status: '未读'
        },
        {
          id: '6',
          title: '你是谁你为什么评论我的问题',
          status: '未读'
        },
        {
          id: '7',
          title: '你是谁你为什么评论我的问题',
          status: '未读'
        }
      ]
    },
    deleteItem(item) {
      const index = this.items.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.items.splice(index, 1)
    }
  }
}
</script>
<style scoped></style>
