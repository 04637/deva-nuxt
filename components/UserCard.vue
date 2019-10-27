<template>
  <v-card
    :min-width="minWidth"
    class="pa-2"
    :to="
      actionIcon || $store.getters.getUserType === 'ADMIN'
        ? null
        : '/user/' + userInfo.userId
    "
  >
    <v-layout justify-start>
      <v-flex xs4>
        <v-layout justify-center class="pt-1">
          <v-avatar
            style="cursor:pointer"
            color="grey"
            :title="'用户名: ' + userInfo.username"
            @click="
              actionIcon || $store.getters.getUserType === 'ADMIN'
                ? $router.push('/user/' + userInfo.userId)
                : ''
            "
          >
            <v-img :src="userInfo.avatar"></v-img>
          </v-avatar>
        </v-layout>
      </v-flex>
      <v-flex xs7>
        <v-layout justify-space-between fill-height column>
          <v-btn
            v-if="actionIcon"
            :title="actionTitle"
            color="private"
            style="position: absolute; right: -2px; top: -3px"
            icon
            @click.stop="
              actionConfirm
                ? (confirm.dialog = true)
                : actionEvent(userInfo.userId)
            "
            ><v-icon color="private">{{ actionIcon }}</v-icon></v-btn
          >
          <v-layout class="label-description " style="min-height: 44px">
            <span :title="userInfo.bio" class="my_gray--text">
              {{ userInfo.bio }}
            </span>
          </v-layout>
          <v-layout
            class="d-inline-block text-truncate"
            style="min-height: 24px;"
            wrap
          >
            <span v-for="(tag, index) in userInfo.likeTags" :key="tag.tagId"
              ><router-link
                style="text-decoration: none; color: #2196f3; font-weight: bold; font-size:0.9rem"
                :to="'/search/' + tag.tagName + '?match=tags'"
                >{{ tag.tagName }}</router-link
              ><span
                v-if="index < userInfo.likeTags.length - 1"
                class="my_gray--text"
              >
                ,
              </span>
            </span>
          </v-layout>
        </v-layout>
      </v-flex>
      <v-flex v-if="$store.getters.getUserType === 'ADMIN' && !actionEvent" xs1>
        <v-btn
          :color="userInfo.status === 0 ? 'primary' : 'private'"
          x-small
          text
          style="position: relative; top:-10px;left:-6px"
          @click="
            userInfo.status === 0
              ? (confirmUnBan.dialog = true)
              : (confirmBan.dialog = true)
          "
          ><strong>{{ userInfo.status === 0 ? '解封' : '封禁' }}</strong></v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout justify-space-between style="height: 20px">
      <v-flex
        justify-center
        xs4
        class="text-truncate  no-flex"
        style="text-align: center"
      >
        <span :title="userInfo.nickname || userInfo.username">{{
          userInfo.nickname || userInfo.username
        }}</span>
      </v-flex>
      <v-flex xs7 class="text-right">
        <v-layout align-center justify-end>
          <v-icon color="red" small title="用户声望">
            mdi-music-clef-bass </v-icon
          >&nbsp;{{ userInfo.reputation }}
        </v-layout>
      </v-flex>
    </v-layout>
    <ConfirmDialog
      v-if="actionConfirm"
      :msg="confirmMsg"
      :dialog="confirm.dialog"
      :todo="actionEvent"
      :todo-param="userInfo.userId"
      @update:dialog="confirm.dialog = $event"
    ></ConfirmDialog>
    <ConfirmDialog
      v-if="$store.getters.isAdmin && !actionEvent"
      msg="确定 [封禁] 该用户？"
      :dialog="confirmBan.dialog"
      :todo="banUser"
      @update:dialog="confirmBan.dialog = $event"
    >
    </ConfirmDialog>
    <ConfirmDialog
      v-if="$store.getters.isAdmin && !actionEvent"
      msg="确定 [解封] 该用户？"
      :dialog="confirmUnBan.dialog"
      :todo="unBanUser"
      @update:dialog="confirmUnBan.dialog = $event"
    >
    </ConfirmDialog>
  </v-card>
</template>
<script>
import ConfirmDialog from './ConfirmDialog'
export default {
  components: {
    ConfirmDialog
  },
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
    },
    actionConfirm: {
      type: Boolean,
      required: false,
      default: false
    },
    confirmMsg: {
      type: String,
      required: false,
      default: ''
    },
    minWidth: {
      type: String,
      required: false,
      default: '358px'
    }
  },
  data: () => ({
    confirm: {
      result: false,
      dialog: false
    },
    confirmBan: {
      dialog: false
    },
    confirmUnBan: {
      dialog: false
    }
  }),
  methods: {
    banUser() {
      this.$axios
        .$post('/admin/banUser', {
          userId: this.userInfo.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userInfo.status = 0
          }
        })
    },
    unBanUser() {
      this.$axios
        .$post('/admin/unBanUser', {
          userId: this.userInfo.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userInfo.status = 1
          }
        })
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
