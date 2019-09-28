<template>
  <v-card class="pa-2" :to="actionIcon ? null : '/user/' + userInfo.userId">
    <v-layout justify-space-between class="mb-3">
      <v-flex xs3>
        <v-layout justify-center>
          <v-avatar color="grey" :title="'用户名: ' + userInfo.username">
            <v-img :src="userInfo.avatar"></v-img>
          </v-avatar>
        </v-layout>
      </v-flex>
      <v-flex xs8>
        <v-layout justify-space-between fill-height column>
          <v-btn
            v-if="actionIcon"
            :title="actionTitle"
            color="private"
            style="position: absolute; right: -2px; top: -3px"
            icon
            small
            @click.stop="actionEvent(userInfo.userId)"
            ><v-icon color="private" small>{{ actionIcon }}</v-icon></v-btn
          >
          <v-layout class="label-description ">
            <span :title="userInfo.bio">
              {{ userInfo.bio }}
            </span>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout justify-space-between style="height: 20px">
      <v-flex
        justify-start
        xs5
        class="d-inline-block text-truncate text-left no-flex"
      >
        <span :title="userInfo.nickname || userInfo.username">{{
          userInfo.nickname || userInfo.username
        }}</span>
      </v-flex>
      <v-flex xs4 class="text-right">
        <svg class="icon heat-icon" aria-hidden="true">
          <use xlink:href="#icon-zuanshi"></use></svg
        >&nbsp;{{ userInfo.reputation }}
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    actionIcon: {
      type: String,
      required: false,
      default: null
    },
    actionEvent: {
      type: Function,
      required: false,
      default: null
    },
    actionTitle: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
<style scoped>
.icon {
  vertical-align: -7px;
}
/* 控制展示两行 */
.label-description {
  font-size: 15px;
  text-indent: 15px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
