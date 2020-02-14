<template>
  <v-card flat class="pa-2">
    <v-layout align-center>
      <v-flex shrink>
        <v-avatar :to="'/user/' + user.userId" color="grey" size="60">
          <v-img :src="user.avatar"></v-img>
        </v-avatar>
      </v-flex>
      <v-flex class="ml-3" justify-start shrink>
        <v-layout align-start justify-start class="mb-2">
          <nuxt-link
            :to="'/user/' + user.userId"
            class="hover-line"
            style="text-decoration: none"
            >{{ user.nickname || user.username }}</nuxt-link
          >
        </v-layout>
        <v-layout align-end>
          <small
            :title="$options.filters.timeago(modifiedTime)"
            class="my_gray--text"
          >
            {{ modifiedTime | moment }}&nbsp;&nbsp;阅读
            {{ viewNum }}&nbsp;&nbsp;点赞 {{ voteNum }}&nbsp;&nbsp;喜欢
            {{ likeNum }}</small
          ></v-layout
        >
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    user: {
      required: true,
      type: Object
    },
    modifiedTime: {
      required: true,
      type: Number
    },
    viewNum: {
      required: true,
      type: Number
    },
    voteNum: {
      required: true,
      type: Number
    },
    likeNum: {
      required: true,
      type: Number
    }
  }
}
</script>
<style></style>
