<template>
  <v-card
    flat
    class="pa-2"
    :width="minWidth"
    style="border-radius: 0;border-right: 0.5px solid #e7e7e7;border-bottom: 0.5px solid #e7e7e7"
  >
    <v-layout justify-start align-start>
      <v-flex shrink md2 hidden-sm-and-down>
        <v-avatar
          style="cursor:pointer"
          tile
          :title="'用户名: ' + userInfo.username"
          @click="
            actionIcon || $store.getters.getUserType === 'ADMIN'
              ? $router.push('/user/' + userInfo.userId)
              : ''
          "
        >
          <v-img :src="userInfo.avatar"></v-img>
        </v-avatar>
        <v-layout
          v-if="$store.getters.getUserType === 'ADMIN' && !actionEvent"
          class="mt-2"
        >
          <v-btn
            :color="userInfo.status === 0 ? 'primary' : 'private'"
            small
            text
            @click="
              userInfo.status === 0
                ? (confirmUnBan.dialog = true)
                : (confirmBan.dialog = true)
            "
            ><span>{{ userInfo.status === 0 ? '解封' : '封禁' }}</span></v-btn
          >
        </v-layout>
      </v-flex>
      <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-flex md9 sm12>
        <v-layout justify-space-between column>
          <v-btn
            v-if="actionIcon"
            :title="actionTitle"
            color="private"
            icon
            small
            @click.stop="
              actionConfirm
                ? (confirm.dialog = true)
                : actionEvent(userInfo.userId)
            "
            ><v-icon small color="private">{{ actionIcon }}</v-icon></v-btn
          >
          <v-layout>
            <span
              ><nuxt-link class="hover-line" :to="'/user/' + userInfo.userId">{{
                userInfo.nickname
              }}</nuxt-link
              >&nbsp;<span style="font-weight: bold; color:red">·</span
              >&nbsp;<span style="font-size: 12px">{{
                userInfo.reputation
              }}</span></span
            >
          </v-layout>
          <v-layout class="label-description" style="min-height: 44px">
            <span :title="userInfo.bio" class="my_gray--text">
              {{ userInfo.bio }}
            </span>
          </v-layout>
          <v-layout
            class="d-inline-block text-truncate"
            style="min-height: 24px;"
            wrap
          >
            <router-link
              v-for="(tag, index) in userInfo.likeTags"
              :key="tag.tagId"
              class="hover-line"
              style="color: #2196f3; font-size:0.9rem"
              :to="'/search/' + tag.tagName + '?match=tags'"
              >{{ tag.tagName
              }}<span
                v-if="index < userInfo.likeTags.length - 1"
                style="cursor: auto"
                class="my_gray--text"
                >,
              </span></router-link
            >
          </v-layout>
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
      default: '250px'
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
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
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
