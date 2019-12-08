<template>
  <v-layout :justify-end="justifyEnd">
    <v-layout
      class="my_gray--text d-sm-block d-md-none d-lg-none"
      style="font-size: 0.9rem"
      ><nuxt-link
        :to="'/user/' + user.userId"
        class="d-xs-block hover-line  blue--text"
        >{{ user.nickname }}</nuxt-link
      >&nbsp;·&nbsp;{{ createTime | timeago }}</v-layout
    >

    <v-card flat class="pa-2" :to="'/user/' + user.userId">
      <v-layout align-center>
        <v-flex xs4>
          <v-avatar color="grey" tile>
            <v-img :src="user.avatar"></v-img>
          </v-avatar>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs8 class="ml-3" grow>
          <v-layout align-center>
            <nuxt-link class="hover-line" :to="'/user/' + user.userId">{{
              user.nickname || user.username
            }}</nuxt-link
            ><b style="color: red">&nbsp;·&nbsp;</b
            ><span style="font-size: 12px;" title="声望">{{
              user.reputation
            }}</span>
          </v-layout>
          <v-layout>
            <small :title="$options.filters.moment(createTime)">
              {{ prefix }}于&nbsp; {{ createTime | timeago }}</small
            >
          </v-layout>
          <v-layout v-if="createTime !== modifiedTime">
            <small :title="$options.filters.moment(modifiedTime)">
              更新于&nbsp;
              {{ modifiedTime | timeago }}</small
            ></v-layout
          >
        </v-flex>
      </v-layout>
    </v-card>
  </v-layout>
</template>
<script>
export default {
  props: {
    user: {
      required: true,
      type: Object
    },
    createTime: {
      required: true,
      type: Number
    },
    modifiedTime: {
      required: true,
      type: Number
    },
    prefix: {
      required: false,
      type: String,
      default: '创建'
    },
    justifyEnd: {
      required: false,
      type: Boolean,
      default: true
    }
  }
}
</script>
<style></style>
