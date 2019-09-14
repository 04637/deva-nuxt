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
              class="ml-10"
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
            <v-btn
              v-if="$store.state.userInfo"
              icon
              class="mr-5"
              to="/user/messages"
            >
              <v-badge
                v-model="mini"
                class="align-self-center small-badge"
                color="primary"
                overlap
              >
                <template v-slot:badge>
                  <!-- todo H5桌面通知 https://juejin.im/post/59ed37f5f265da431e15eaac-->
                  <span>!</span>
                </template>
                <v-icon>notifications_none</v-icon>
              </v-badge>
            </v-btn>
            <div v-if="$store.getters.getUserInfo">
              <v-avatar
                color="grey"
                size="35"
                tile
                style="cursor:pointer"
                @click="
                  $router.push('/user/' + $store.getters.getUserId, () => {})
                "
              >
                <v-img :src="$store.getters.getUserInfo.avatar"></v-img>
              </v-avatar>
              <v-menu
                v-model="moreSpaceMenu"
                :close-on-content-click="false"
                nudge-width="100"
                offset-y
              >
                <template #activator="{ on }">
                  <v-btn icon small v-on="on"><v-icon>more_vert</v-icon></v-btn>
                </template>
                <v-list dense nav>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn depressed text @click="logout">注销</v-btn>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div v-else>
              <v-btn text color="primary" depressed to="/user/login"
                >登录</v-btn
              >
              <v-btn depressed class="ml-1" to="/user/signUp">注册</v-btn>
            </div>
          </v-layout>
        </v-container>
      </v-app-bar>
      <v-content :class="mini ? '' : 'ml-120px'">
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
          <v-col class=" py-2 text-right white--text" cols="12">
            <span>&copy;2019-{{ new Date().getFullYear() }}&nbsp;aid.dev</span>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Logo from '../components/Logo'
// import Logo2 from '../components/Logo2'
export default {
  name: 'App',
  components: {
    Logo
    // Logo2
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
    moreSpaceMenu: false
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
          }
        })
      }
    }
  }
}
</script>

<style></style>
<style scoped>
.ml-120px {
  margin-left: 120px;
}
</style>
