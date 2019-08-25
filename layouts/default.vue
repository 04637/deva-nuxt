<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app clipped>
        <v-list nav rounded>
          <v-list-item-group>
            <v-list-item to="/">
              <v-list-item-action>
                <v-icon>trip_origin</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>主&nbsp;&nbsp;&nbsp;页</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-subheader>DEVA</v-subheader>
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
            <v-subheader>PRIVATE</v-subheader>
            <v-list-item to="/private/createSpace">
              <v-list-item-action>
                <v-icon>fiber_new</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>创建空间</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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
          <v-flex justify-start row class="ml-1">
            <v-icon @click.stop="drawer = !drawer">menu</v-icon>
            <v-toolbar-title>
              <img src="/deva.png" alt="" class="logo" />
            </v-toolbar-title>
            <v-text-field
              hide-details
              label="Search"
              prepend-inner-icon="search"
              solo
              flat
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-flex>
          <v-layout justify-end align-center>
            <v-btn icon class="mr-5" to="/user/messages">
              <v-badge class="align-self-center" overlap>
                <template v-slot:badge>
                  <span>!</span>
                </template>
                <v-icon>email</v-icon>
              </v-badge>
            </v-btn>
            <div v-if="$store.getters.getUserInfo">
              <v-avatar color="grey" size="35" tile class="mr-10">
                <v-img :src="$store.getters.getUserInfo.avatar"></v-img>
              </v-avatar>
              <v-btn
                depressed
                class="ml-1"
                @click="$store.commit('setUserInfo', null)"
                >注销</v-btn
              >
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
        <span>&copy; 2019</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {},
  data: () => ({
    drawer: null,
    menuOpen: false,
    keepAliveRouters: [
      'question-ask',
      'user-signUp',
      'user-login',
      'question-id'
    ]
  }),
  computed: {
    needKeepAlive() {
      return this.keepAliveRouters.includes(this.$route.name)
    }
  },
  created() {},
  methods: {}
}
</script>

<style></style>
<style scoped>
.logo {
  width: 100px;
  display: block;
}
</style>
