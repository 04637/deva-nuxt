<template>
  <v-card
    :min-width="minWidth"
    class="pa-2 no-shadow-box"
    :to="
      actionIcon || $store.getters.getUserType === 'ADMIN'
        ? null
        : '/user/' + userInfo.userId
    "
  >
    <v-layout justify-start>
      <v-layout justify-space-between class="pt-1" align-center>
        <v-avatar
          style="cursor:pointer"
          color="grey"
          :title="'用户名: ' + userInfo.username"
          size="40"
          @click="
            actionIcon || $store.getters.getUserType === 'ADMIN'
              ? $router.push('/user/' + userInfo.userId)
              : ''
          "
        >
          <v-img :src="userInfo.avatar"></v-img>
        </v-avatar>
        <v-layout
          justify-space-between
          class="text-truncate  no-flex"
          style="text-align: center"
        >
          <span
            class="ml-1"
            :title="userInfo.nickname || userInfo.username"
            style="font-size: 14px"
            >{{ userInfo.nickname || userInfo.username }}</span
          >
          <v-chip small color="light_yellow">
            <v-icon color="red" small title="用户声望">
              mdi-music-clef-bass </v-icon
            >&nbsp;{{ userInfo.reputation }}
          </v-chip>
        </v-layout>
      </v-layout>
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
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.theme--light .no-shadow-box {
  box-shadow: none;
  /*border: 1px solid #e7e7e7;*/
  background-color: #e7e7e7;
}
.theme--dark .no-shadow-box {
  box-shadow: none;
  /*border: 1px solid #4b4b4b;*/
  background-color: #4b4b4b;
}
</style>
