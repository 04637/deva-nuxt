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
                <v-icon>dashboard</v-icon>
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
              :class="mini ? 'mini' : ''"
            >
              <template v-slot:prepend="{ item }">
                <v-icon v-if="item.children">group</v-icon>&nbsp;&nbsp;
              </template>
              <template v-slot:label="{ item }">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <router-link
                      v-if="!item.children"
                      type="success"
                      text
                      depressed
                      class="pa-0 ma-0"
                      :class="mini ? 'pl-0' : ''"
                      :to="'/space/' + item.spaceId"
                      style="background-color: transparent; text-decoration: none"
                      v-on="mini ? on : ''"
                    >
                      {{ mini ? '...' : item.spaceName }}
                    </router-link>
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
              <img src="/deva.png" alt="" class="logo" />
            </v-toolbar-title>
            <v-text-field
              v-model="keywords"
              hide-details
              label="Search"
              prepend-inner-icon="search"
              solo
              flat
              @keyup.enter.native="search"
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-flex>
          <v-layout justify-end align-center>
            <v-btn icon class="mr-5" to="/user/messages">
              <v-badge class="align-self-center" overlap>
                <template v-if="unReadMessageCount > 0" v-slot:badge>
                  <!-- todo H5桌面通知 https://juejin.im/post/59ed37f5f265da431e15eaac-->
                  <span>!</span>
                </template>
                <v-icon>email</v-icon>
              </v-badge>
            </v-btn>
            <div v-if="$store.getters.getUserInfo">
              <router-link :to="'/user/' + $store.getters.getUserId">
                <v-avatar color="grey" size="35" tile class="mr-10">
                  <v-img :src="$store.getters.getUserInfo.avatar"></v-img>
                </v-avatar>
              </router-link>
              <v-menu
                v-model="moreSpaceMenu"
                :close-on-content-click="false"
                nudge-width="200"
                offset-y
              >
                <template #activator="{ on }">
                  <v-btn icon v-on="on"><v-icon>more_vert</v-icon></v-btn>
                </template>
                <v-card>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-btn depressed text @click="logout">注销</v-btn>
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
      <v-content>
        <!--参考 https://github.com/nuxt/nuxt.js/issues/1706 nuxt缓存-->
        <nuxt v-if="needKeepAlive" keep-alive />
        <nuxt v-else />
      </v-content>
      <v-footer app>
        <v-row justify="center" no-gutters>
          <v-col class=" py-2 text-right white--text" cols="12">
            <span>&copy;2019-{{ new Date().getFullYear() }}&nbsp;aid.dev</span>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {},
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
    moreSpaceMenu: false
  }),
  computed: {
    needKeepAlive() {
      return this.keepAliveRouters.includes(this.$route.name)
    },
    unReadMessageCount() {
      return 0
      // let count = 0
      // const _userInfo = this.$store.getters.getUserInfo
      // if (_userInfo) {
      //   _userInfo.messages.forEach((m) => {
      //     if (!m.isRead) {
      //       ++count
      //     }
      //   })
      // }
      // return count
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.loadSpaceList()
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
            console.log(JSON.stringify(this.spaceList[0]))
          }
        })
      }
    }
  }
}
</script>

<style></style>
<style scoped>
.logo {
  width: 100px;
  display: block;
}
</style>
