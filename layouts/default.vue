<template>
  <div id="app">
    <v-app id="inspire">
      <v-flex hidden-sm-and-down shrink>
        <v-navigation-drawer
          v-model="drawer"
          app
          clipped
          permanent
          :mini-variant="mini"
          width="200px"
          style="height: 100%; max-height: 100%"
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
                  <v-icon>mdi-circle-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>主&nbsp;&nbsp;&nbsp;页</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-subheader v-show="!mini" class="letter-space"
                >DEVA</v-subheader
              >
              <v-list-item to="/question/ask">
                <v-list-item-action>
                  <v-icon style="font-size: 21px"
                    >mdi-comment-question-outline</v-icon
                  >
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
                  <v-icon>mdi-account-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>用&nbsp;&nbsp;&nbsp;户</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/tag/tags">
                <v-list-item-action>
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>标&nbsp;&nbsp;&nbsp;签</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/blog/blogList">
                <v-list-item-action>
                  <v-icon>mdi-file-document-box-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>博&nbsp;&nbsp;&nbsp;文</v-list-item-title>
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
                      <v-btn
                        icon
                        small
                        @click="joinSpace.dialog = true"
                        v-on="on"
                        ><v-icon>mdi-location-enter</v-icon></v-btn
                      >
                    </v-layout>
                  </template>
                  <span>加入空间</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-layout justify-center :class="mini ? 'mt-2' : ''">
                      <v-btn to="/space/createSpace" icon small v-on="on"
                        ><v-icon>mdi-plus</v-icon></v-btn
                      >
                    </v-layout>
                  </template>
                  <span>创建空间</span>
                </v-tooltip>
              </v-layout>
              <v-treeview
                v-show="
                  spaceList[0].children && spaceList[0].children.length > 0
                "
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
                :active="[$route.params.id]"
                color="default"
              >
                <template v-slot:prepend="{ item }">
                  <v-icon v-if="item.children">mdi-cards-outline</v-icon
                  >&nbsp;&nbsp;
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
              <div v-if="$store.getters.getUserType === 'ADMIN'">
                <v-list-item class="mt-3" to="/admin/task">
                  <v-list-item-action>
                    <v-icon color="private">fingerprint</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      >管&nbsp;&nbsp;&nbsp;理</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
              </div>
              <v-list-item
                class="mt-3"
                @click="$store.commit('toggleDarkTheme')"
              >
                <v-list-item-action>
                  <v-icon v-show="$vuetify.theme.dark">mdi-brightness-4</v-icon>
                  <v-icon v-show="!$vuetify.theme.dark"
                    >mdi-brightness-5</v-icon
                  >
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>切换主题</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-flex>
      <v-app-bar app dense clipped-left>
        <v-container row align-center justify-space-between fluid>
          <v-flex justify-start align-center row hidden-sm-and-down>
            <v-toolbar-title>
              <logo type="header" class="ml-5"></logo>
            </v-toolbar-title>
            <v-text-field
              v-model="keywords"
              translate="yes"
              flat
              class="ml-10 min-input search-input"
              :class="'aelevation-' + searchElv"
              label="搜索"
              hide-details
              elavation
              style="min-height: 36px;"
              append-icon="search"
              solo
              @focusin="searchElv = 1"
              @focusout="searchElv = 0"
              @click:append="search"
              @keyup.enter.native="search"
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-flex>
          <v-flex
            v-if="systemNotice && systemNotice.content"
            hidden-md-and-down
            class="py-2"
            style="font-size:0.9rem"
            md6
          >
            <v-row align="center" justify="start" class="pr-5">
              <span
                class="d-inline-block text-truncate my_gray--text"
                style="max-width: 500px"
                :title="systemNotice.content"
              >
                公告：{{ systemNotice.content }}
              </span>
              <v-btn
                v-if="systemNotice.content.length > 40"
                text
                small
                color="warning"
                style="position:relative;"
                @click="viewNotice.dialog = true"
              >
                查看详情
              </v-btn>
            </v-row>
          </v-flex>
          <v-layout justify-end align-center>
            <v-btn
              v-if="$store.state.userInfo"
              style="position: relative;margin-right: 10px"
              icon
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
            <div v-if="$store.getters.getUserInfo">
              <v-menu
                v-model="userMenu"
                :close-on-content-click="true"
                open-on-hover
                nudge-width="100"
                offset-y
              >
                <template #activator="{ on }">
                  <v-chip
                    max-width="120px"
                    text
                    small
                    color="background_color"
                    :to="'/user/' + $store.getters.getUserInfo.userId"
                    style="border-radius: 0;"
                    class="d-inline-block no-flex text-truncate text-left mr-1"
                    >{{
                      $store.getters.getUserInfo.nickname ||
                        $store.getters.getUserInfo.username
                    }}</v-chip
                  >
                  <v-avatar
                    color="grey"
                    size="35"
                    style="cursor:pointer"
                    v-on="on"
                  >
                    <v-img :src="$store.getters.getUserInfo.avatar"></v-img>
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
                          :to="'/user/' + $store.getters.getUserId"
                          >个人档案</v-btn
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
                          >安全中心</v-btn
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
      <v-flex>
        <v-content
          style="max-height: calc(100% - 100px); margin-bottom: 80px"
          :class="isSmall ? 'ml-small' : mini ? 'ml-mini' : 'ml-max'"
        >
          <!--参考 https://github.com/nuxt/nuxt.js/issues/1706 nuxt缓存-->
          <div v-if="needSsr">
            <nuxt v-if="needKeepAlive" class="pa-2" keep-alive />
            <nuxt v-else class="pa-2" />
          </div>
          <client-only v-else>
            <nuxt v-if="needKeepAlive" class="pa-2" keep-alive />
            <nuxt v-else class="pa-2" />
          </client-only>
          <FloatMenu></FloatMenu>
        </v-content>
      </v-flex>
      <v-footer
        v-show="$store.getters.getShowFooter"
        app
        tile
        style="z-index: 999;"
      >
        <v-row justify="center" align="center" no-gutters>
          <v-flex class="py-2 text-left my_gray--text">
            <span
              >&copy;2019-{{ new Date().getFullYear() }}&nbsp;<router-link
                to="/"
                >aid.dev</router-link
              >&nbsp;版权所有&nbsp;沪ICP备19037749号-1</span
            >
            <!--<span class="pl-4">联系我们：<span>admin@aid.dev</span></span>-->
          </v-flex>
        </v-row>
      </v-footer>
      <ErrorDialog
        :dialog="errorInfo.dialog"
        @update:dialog="errorInfo.dialog = $event"
      >
      </ErrorDialog>
      <v-dialog v-model="joinSpace.dialog" width="500px" persistent>
        <v-card>
          <v-card-text class="pb-0">
            <v-container class="pb-0">
              <v-form ref="joinSpaceForm">
                <v-text-field
                  v-model="joinSpace.spaceId"
                  placeholder="空间ID"
                  :rules="[rules.requireSpaceId]"
                >
                </v-text-field>
                <v-text-field
                  v-model="joinSpace.inviteCode"
                  placeholder="邀请码"
                  :rules="[rules.requireInviteCode]"
                >
                </v-text-field>
                <span class="error--text">{{ joinSpace.errMsg }}</span>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="sub"
              text
              small
              @click="
                joinSpace.dialog = false
                joinSpace.errMsg = null
              "
              >关闭</v-btn
            >
            <v-btn color="primary" small text @click="joinToSpace">加入</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="viewNotice.dialog" persistent max-width="40vw">
        <v-card>
          <v-card-title>
            <!--<span class="headline">回复内容</span>-->
          </v-card-title>
          <v-card-text class="pb-0">
            <v-textarea
              hide-details
              readonly
              rows="10"
              :value="systemNotice.content"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="viewNotice.dialog = false">关闭 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import Logo from '../components/Logo'
// https://github.com/nuxt/nuxt.js/issues/319
import config from '../nuxt.config.js'
import ErrorDialog from '../components/ErrorDialog'
import FloatMenu from '../components/FloatMenu'
export default {
  name: 'App',
  components: {
    FloatMenu,
    Logo,
    ErrorDialog
  },
  data: () => ({
    searchElv: 0,
    mini: false,
    drawer: null,
    menuOpen: false,
    keepAliveRouters: [],
    ssrRouters: ['question-id', 'blog-id'],
    keywords: null,
    spaceList: [
      {
        spaceId: 1,
        spaceName: '我的空间',
        children: []
      }
    ],
    viewNotice: {
      dialog: false
    },
    userMenu: false,
    joinSpace: {
      dialog: false,
      resp: null,
      spaceId: null,
      inviteCode: null,
      errMsg: null
    },
    errorInfo: {
      dialog: false,
      msg: ''
    },
    systemNotice: {
      content: null
    },
    rules: {
      requireSpaceId: (v) => (v && v.length >= 1) || '请输入空间ID',
      requireInviteCode: (v) => (v && v.length >= 1) || '请输入邀请码'
    },
    currentNoticeInterval: null
  }),
  computed: {
    needKeepAlive() {
      return this.keepAliveRouters.includes(this.$route.name)
    },
    needSsr() {
      return this.ssrRouters.includes(this.$route.name)
    },
    // 监听vuex https://stackoverflow.com/questions/43270159/vuejs-2-how-to-watch-store-values-from-vuex
    needReloadSpaceList() {
      return this.$store.getters.getReloadSpaceFlag
    },
    needAlertError() {
      return this.$store.getters.getAlertErrorFlag
    },
    toggleUser() {
      return this.$store.getters.getUserId
    },
    isSmall() {
      return (
        this.$vuetify.breakpoint.name === 'sm' ||
        this.$vuetify.breakpoint.name === 'xs'
      )
    },
    toggleTheme() {
      return this.$store.getters.isDarkTheme
    }
  },
  watch: {
    // 解决点进详情滚动条位置不变
    $route() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    // 监听vuex https://stackoverflow.com/questions/43270159/vuejs-2-how-to-watch-store-values-from-vuex
    needReloadSpaceList() {
      this.loadSpaceList()
    },
    needAlertError(v) {
      if (v) {
        this.errorInfo.dialog = true
      }
    },
    toggleUser() {
      // 加载空间列表
      this.loadSpaceList()
      // 加载未读消息数
      this.loadMessageCount()
      // 连接websocket
      this.connectWebsocket()
    },
    toggleTheme() {
      this.$vuetify.theme.dark = this.$store.getters.isDarkTheme
    }
  },
  created() {
    this.$vuetify.theme.dark = this.$store.getters.isDarkTheme
    this.getSystemNotice()
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => {
      this.disconnectWebsocket()
    })
    // 请求桌面通知权限
    this.requestNotifyPermission()
    this.connectWebsocket()
    // 加载空间列表
    this.loadSpaceList()
    // 加载未读消息数
    this.loadMessageCount()
  },
  methods: {
    getSystemNotice() {
      const _this = this
      _this.$axios.$post('/systemNotice/getLast').then((resp) => {
        if (resp.succeed) {
          _this.systemNotice = resp.data
        }
      })
    },
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
      if (this.keywords) {
        this.$router.push({
          path: '/search/' + this.keywords
        })
      }
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
    joinToSpace() {
      if (!this.$refs.joinSpaceForm.validate()) {
        return false
      }
      this.$axios
        .$post('/spaceUser/joinSpace', {
          spaceId: this.joinSpace.spaceId,
          inviteCode: this.joinSpace.inviteCode
        })
        .then((resp) => {
          this.joinSpace.resp = resp
          if (resp.succeed) {
            this.joinSpace.dialog = false
            this.loadSpaceList()
            this.$router.push('/space/' + this.joinSpace.spaceId, () => ({}))
          } else {
            this.joinSpace.errMsg = resp.msg
          }
        })
    },
    connectWebsocket() {
      if (this.$store.getters.getUserId && process.client) {
        this.disconnectWebsocket()
        this.$connect(config.websocket.server + this.$store.getters.getUserId)
        this.listenSocket()
      }
    },
    listenSocket() {
      if (this.$store.getters.getUserId && process.client) {
        // 监听前删除已有监听器
        delete this.$options.sockets.onmessage
        this.$options.sockets.onmessage = (data) => {
          const _msg = JSON.parse(data.data)
          const _msgTitle = this.$options.filters.filterHtml(_msg.title)
          this.showInfoMsg({
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
<style>
.search-input.aelevation-0 .v-input__control .v-input__slot {
  width: 50%;
  transition: width 0.5s;
}
.search-input.aelevation-1 .v-input__control .v-input__slot {
  width: 100%;
  transition: width 0.3s;
}
.search-input .v-input__slot {
  border: 1px solid #80808042;
}
.v-list-item__action {
  position: relative;
  /*top: 1px;*/
  margin-right: 20px;
}
</style>
<style scoped>
.ml-max {
  margin-left: 120px !important;
  padding-left: 80px !important;
}
.ml-mini {
  margin-left: 0 !important;
  padding-left: 80px !important;
}
.ml-small {
  margin-left: 0 !important;
  padding-left: 0 !important;
}
.unread-icon {
  width: 13px;
  position: relative;
  top: -8px;
  right: 22px;
}
</style>
