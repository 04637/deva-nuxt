<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        permanent
        :mini-variant="mini"
        width="200px"
      >
        <v-list nav>
          <v-layout justify-center>
            <v-icon color="grey" @click="mini = !mini">
              {{ 'keyboard_arrow_' + (mini ? 'right' : 'left') }}
            </v-icon>
          </v-layout>
          <v-list-item-group>
            <v-list-item to="/">
              <v-list-item-action>
                <v-icon>trip_origin</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>主&nbsp;&nbsp;&nbsp;页</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-subheader v-show="!mini" class="letter-space">DEVA</v-subheader>
            <v-list-item to="/question/ask">
              <v-list-item-action>
                <v-icon>question_answer</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>提&nbsp;&nbsp;&nbsp;问</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/question/find">
              <v-list-item-action>
                <v-icon>search</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>发&nbsp;&nbsp;&nbsp;现</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/user/users">
              <v-list-item-action>
                <v-icon>people</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>用&nbsp;&nbsp;&nbsp;户</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/tag/tags">
              <v-list-item-action>
                <v-icon>bookmarks</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>标&nbsp;&nbsp;&nbsp;签</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-layout align-center justify-space-between>
              <v-subheader v-show="!mini" class="letter-space"
                >PRIVATE</v-subheader
              >
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-layout justify-center :class="mini ? 'mt-2' : ''">
                    <v-btn to="/space/createSpace" icon small v-on="on"
                      ><v-icon>add</v-icon></v-btn
                    >
                  </v-layout>
                </template>
                <span>创建空间</span>
              </v-tooltip>
            </v-layout>
            <v-treeview
              v-show="spaceList[0].children && spaceList[0].children.length > 0"
              dense
              item-key="spaceId"
              item-text="spaceName"
              :items="spaceList"
              open-on-click
              transition
              indeterminate-icon="group"
              on-icon="group"
              class="mb-2"
              :class="mini ? 'mini' : ''"
              :active="[currentSpaceId]"
              color="default"
            >
              <template v-slot:prepend="{ item }">
                <v-icon v-if="item.children">dashboard</v-icon>&nbsp;&nbsp;
              </template>
              <template v-slot:label="{ item }">
                <v-btn
                  v-if="!item.children"
                  text
                  width="100%"
                  depressed
                  height="35px"
                  style="line-height: 35px"
                  class="pa-0 ma-0 no-hover-active text-truncate d-inline-block text-left no-flex"
                  :ripple="false"
                  :class="mini ? 'pl-0' : ''"
                  :to="'/space/' + item.spaceId"
                  :title="item.spaceName"
                >
                  {{ mini ? '...' : item.spaceName }}
                </v-btn>
                <span v-if="item.children">
                  {{ item.spaceName }}
                </span>
              </template>
            </v-treeview>
            <v-divider></v-divider>
            <v-list-item class="mt-3" to="/setting/settings">
              <v-list-item-action>
                <v-icon>settings</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>设置</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app dense clipped-left>
        <v-container row align-center justify-space-between fluid>
          <v-flex justify-start row>
            <v-toolbar-title>
              <logo type="header" class="ml-5"></logo>
            </v-toolbar-title>
            <v-text-field
              v-model="keywords"
              translate="yes"
              class="ml-10"
              label="搜索"
              hide-details
              prepend-inner-icon="search"
              solo
              flat
              @keyup.enter.native="search"
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-flex>
          <v-layout justify-end align-center>
            <v-btn
              v-if="$store.state.userInfo"
              style="position: fixed; right: 157px"
              icon
              class="mr-5"
              to="/user/messages"
              small
            >
              <v-icon small>notifications_none</v-icon>
            </v-btn>
            <svg
              v-show="$store.getters.getUnReadMessageCount > 0"
              class="icon unread-icon"
              style="width: 13px; height: 13px;"
            >
              <use xlink:href="#icon-unread"></use>
            </svg>
            <div v-if="userInfo">
              <v-menu
                v-model="userMenu"
                :close-on-content-click="true"
                open-on-hover
                nudge-width="100"
                offset-y
              >
                <template #activator="{ on }">
                  <v-btn
                    max-width="120px"
                    text
                    x-small
                    color="primary"
                    class="d-inline-block no-flex text-truncate text-left mr-1"
                    style="font-weight: bold"
                    >{{ userInfo.nickname }}</v-btn
                  >
                  <v-avatar
                    color="grey"
                    size="35"
                    style="cursor:pointer"
                    v-on="on"
                  >
                    <v-img :src="userInfo.avatar"></v-img>
                  </v-avatar>
                </template>
                <v-card min-width="180px" class="pa-0">
                  <v-list dense nav class="pa-0" shaped>
                    <v-list-item class="pa-0 mb-0">
                      <v-list-item-content class="pa-0">
                        <v-btn
                          depressed
                          text
                          class="text-left no-flex"
                          :to="'/user/' + userInfo.userId"
                          >个人中心</v-btn
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pa-0 mb-0">
                      <v-list-item-content class="pa-0">
                        <v-btn
                          depressed
                          text
                          to="/user/editProfile"
                          class="text-left no-flex"
                          >基本资料</v-btn
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pa-0 mb-0">
                      <v-list-item-content class="pa-0">
                        <v-btn
                          depressed
                          text
                          to="/user/safeSetting"
                          class="text-left no-flex"
                          >安全设置</v-btn
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="pa-0 mb-0">
                      <v-list-item-content class="pa-0">
                        <v-btn depressed text height="40px" @click="logout"
                          >注销</v-btn
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
            <div v-else>
              <v-btn text color="primary" depressed to="/user/login"
                >登录</v-btn
              >
              <v-btn depressed color="primary" class="ml-1" to="/user/signUp"
                >注册</v-btn
              >
            </div>
          </v-layout>
        </v-container>
      </v-app-bar>
      <v-content
        :class="mini ? 'ml-mini' : 'ml-max'"
        style="padding-left: 80px"
      >
        <!--<v-banner single-line>-->
        <!--  该产品正处于测试阶段-->
        <!--  <template v-slot:actions>-->
        <!--    <v-btn text color="deep-purple accent-4">-->
        <!--      Action-->
        <!--    </v-btn>-->
        <!--  </template>-->
        <!--</v-banner>-->
        <!--参考 https://github.com/nuxt/nuxt.js/issues/1706 nuxt缓存-->
        <nuxt v-if="needKeepAlive" class="pa-2" keep-alive />
        <nuxt v-else class="pa-2" />
      </v-content>
      <v-footer app>
        <v-row justify="center" no-gutters>
          <v-col class="py-2 text-right primary--text" cols="12">
            <strong
              >&copy;2019-{{ new Date().getFullYear() }}&nbsp;<router-link
                to="/"
                >aid.dev</router-link
              ></strong
            >
          </v-col>
        </v-row>
      </v-footer>
      <ErrorDialog
        :dialog="errorInfo.dialog"
        @update:dialog="errorInfo.dialog = $event"
      >
      </ErrorDialog>
    </v-app>
  </div>
</template>

<script>
import Logo from '../components/Logo'
// https://github.com/nuxt/nuxt.js/issues/319
import config from '../nuxt.config.js'
import ErrorDialog from '../components/ErrorDialog'
export default {
  name: 'App',
  components: {
    Logo,
    ErrorDialog
  },
  data: () => ({
    mini: false,
    drawer: null,
    menuOpen: false,
    keepAliveRouters: ['question-ask', 'user-signUp', 'user-login'],
    keywords: null,
    spaceList: [
      {
        spaceId: 1,
        spaceName: '我的空间',
        children: []
      }
    ],
    userMenu: false,
    userInfo: null,
    errorInfo: {
      dialog: false,
      msg: ''
    }
  }),
  computed: {
    needKeepAlive() {
      return this.keepAliveRouters.includes(this.$route.name)
    },
    currentSpaceId() {
      if (/space\/\d+$/.test(this.$route.path)) {
        return this.$route.path.match(/space\/(\d+)$/)[1]
      } else {
        return null
      }
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.loadSpaceList()
    // 监听状态改变, 🐮🍺   参考 https://dev.to/viniciuskneves/watch-for-vuex-state-changes-2mgj
    this.$store.watch(
      ((state, getters) => getters.getErrorMsg,
      (v) => {
        if (v.errorMsg) {
          this.errorInfo.dialog = true
        }
      })
    )
    this.$store.watch(
      ((state, getters) => getters.getUserInfo,
      (v) => {
        // 如果前后相同, 禁止重复操作, 目的是监听用户切换
        if (
          v.userInfo &&
          this.userInfo &&
          v.userInfo.userId === this.userInfo.userId
        ) {
          return
        }
        this.userInfo = this.$store.getters.getUserInfo
        // 加载空间列表
        this.loadSpaceList()
        // 加载未读消息数
        this.loadMessageCount()
        // 连接websocket
        this.connectWebsocket()
      })
    )
    window.addEventListener('beforeunload', (e) => {
      this.disconnectWebsocket()
    })
    // 请求桌面通知权限
    this.requestNotifyPermission()
  },
  methods: {
    logout() {
      // 使外部api上的JWT Cookie失效
      this.disconnectWebsocket()
      this.$store.commit('setUserInfo', null)
      this.userMenu = false
      this.$router.push({
        path: '/user/login'
      })
    },
    search() {
      this.$router.push({
        path: '/search/' + this.keywords
      })
    },
    loadSpaceList() {
      if (this.$store.state.userInfo) {
        this.$axios.$post('/spaceInfo/listSpace').then((resp) => {
          if (resp.succeed) {
            this.spaceList[0].children = resp.data
          }
        })
      } else {
        this.spaceList[0].children = []
      }
    },
    loadMessageCount() {
      if (this.$store.state.userInfo) {
        this.$axios.$post('/messageInfo/getUnreadCount').then((resp) => {
          if (resp.succeed) {
            this.$store.commit('setUnreadMessageCount', resp.data)
          }
        })
      }
    },
    connectWebsocket() {
      if (this.userInfo && process.client) {
        this.$connect(config.websocket.server + this.userInfo.userId)
        this.listenSocket()
      }
    },
    listenSocket() {
      if (this.userInfo && process.client) {
        // 监听前删除已有监听器
        delete this.$options.sockets.onmessage
        this.$options.sockets.onmessage = (data) => {
          const _msg = JSON.parse(data.data)
          const _msgTitle = this.$options.filters.filterHtml(_msg.title)
          this.showWarnMsg({
            message: _msgTitle
          })
          this.desktopNotify('DEVA', {
            body: _msgTitle,
            icon: config.domain + '/logo2.png',
            data: {
              ownQuestionId: _msg.ownQuestionId,
              anchor: _msg.anchor ? _msg.anchor : ''
            }
          })
          this.$store.commit('setUnreadMessageCount', 1)
        }
      }
    },
    disconnectWebsocket() {
      if (process.client) {
        this.$disconnect()
        delete this.$options.sockets.onmessage
      }
    },
    desktopNotify(title, options) {
      if (process.server) {
        return
      }
      let notice
      // 先检查浏览器是否支持
      if (!window.Notification) {
      } else {
        // 检查用户曾经是否同意接受通知
        if (Notification.permission === 'granted') {
          notice = new Notification(title, options) // 显示通知
        } else if (Notification.permission === 'default') {
          // 用户还未选择，可以询问用户是否同意发送通知
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              notice = new Notification(title, options) // 显示通知
            } else if (permission === 'default') {
            } else {
              // denied
            }
          })
        } else {
          // denied 用户拒绝
        }
        // todo 无效
        if (notice) {
          notice.onclick = function(e) {
            const _link =
              config.domain +
              '/question/' +
              options.data.ownQuestionId +
              options.data.anchor
            window.open(_link, '_blank')
            notice.close()
          }
        }
      }
    },
    requestNotifyPermission() {
      if (Notification.permission === 'default') {
        // 用户还未选择，可以询问用户是否同意发送通知
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
          } else if (permission === 'default') {
          } else {
          }
        })
      }
    }
  },
  notifications: {
    showSuccessMsg: {
      type: 'success',
      title: 'Hello there',
      message: "That's the success!"
    },
    showInfoMsg: {
      type: 'info',
      title: 'Hey you',
      message: 'Here is some info for you'
    },
    showWarnMsg: {
      type: 'warn',
      title: 'Wow, man',
      message: "That's the kind of warning"
    },
    showErrorMsg: {
      type: 'error',
      title: 'Wow-wow',
      message: "That's the error"
    }
  }
}
</script>

<style></style>
<style scoped>
.ml-max {
  margin-left: 120px;
}
.ml-mini {
  margin-left: 0;
}
.unread-icon {
  width: 13px;
  position: relative;
  top: -7px;
  left: -31px;
}
</style>
