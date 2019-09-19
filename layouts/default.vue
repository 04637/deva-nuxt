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
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-if="!item.children"
                      text
                      depressed
                      height="21px"
                      class="pa-0 ma-0 no-hover-active text-truncate d-inline-block text-left no-flex"
                      :ripple="false"
                      :class="mini ? 'pl-0' : ''"
                      :to="'/space/' + item.spaceId"
                      v-on="mini ? on : ''"
                    >
                      {{ mini ? '...' : item.spaceName }}
                    </v-btn>
                  </template>
                  <span>{{ item.spaceName }}</span>
                </v-tooltip>

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
              icon
              class="mr-5"
              to="/user/messages"
              small
            >
              <v-badge
                :value="$store.getters.getUnReadMessageCount > 0"
                class="align-self-center small-badge"
                color="warning"
                overlap
              >
                <template v-slot:badge>
                  <!-- todo H5桌面通知 https://juejin.im/post/59ed37f5f265da431e15eaac-->
                  <span>!</span>
                </template>
                <v-icon small>notifications_none</v-icon>
              </v-badge>
            </v-btn>
            <div v-if="userInfo">
              <v-menu
                v-model="moreSpaceMenu"
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
                    :to="'/user/' + userInfo.userId"
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
                  <v-row justify="space-between" align="center">
                    <v-col cols="8" align="center" no-gutters>
                      <v-row justify="start" align="center" class="ml-3">
                        <span
                          class="d-inline-block text-truncate"
                          title="用户名"
                          >{{ userInfo.username }}</span
                        ></v-row
                      ></v-col
                    >
                    <v-col justify="end" cols="3" align="center" no-gutters
                      ><v-btn outlined x-small color="primary" title="声誉">{{
                        userInfo.reputation
                      }}</v-btn></v-col
                    ></v-row
                  >
                  <v-divider></v-divider>
                  <v-list dense nav class="pa-0">
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
      <v-content :class="mini ? 'ml-mini' : 'ml-max'">
        <!--<v-banner single-line>-->
        <!--  该产品正处于测试阶段-->
        <!--  <template v-slot:actions>-->
        <!--    <v-btn text color="deep-purple accent-4">-->
        <!--      Action-->
        <!--    </v-btn>-->
        <!--  </template>-->
        <!--</v-banner>-->
        <!--参考 https://github.com/nuxt/nuxt.js/issues/1706 nuxt缓存-->
        <nuxt v-if="needKeepAlive" keep-alive />
        <nuxt v-else />
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
    </v-app>
  </div>
</template>

<script>
import Logo from '../components/Logo'
export default {
  name: 'App',
  components: {
    Logo
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
    moreSpaceMenu: false,
    userInfo: null
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
      ((state, getters) => getters.getUserInfo,
      () => {
        this.userInfo = this.$store.getters.getUserInfo
        this.loadSpaceList()
        this.loadMessageCount()
      })
    )
  },
  methods: {
    logout() {
      // 使外部api上的JWT Cookie失效
      this.$store.commit('setUserInfo', null)
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
</style>
