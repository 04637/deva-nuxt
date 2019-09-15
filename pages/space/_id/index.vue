<template>
  <v-app>
    <v-treeview
      v-show="spaceList[0].children && spaceList[0].children.length > 0"
      item-key="spaceId"
      item-text="spaceName"
      :items="spaceList"
      rounded
      open-on-click
      transition
    >
    </v-treeview>
    <v-treeview :items="items" transition open-on-click></v-treeview>
  </v-app>
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
    moreSpaceMenu: false,
    items: [
      {
        id: 1,
        name: 'Applications :',
        children: [
          { id: 2, name: '世界是你的 : app' },
          { id: 3, name: '世界是你的 : app' },
          { id: 4, name: '世界是你的 : app' }
        ]
      },
      {
        id: 5,
        name: 'Documents :',
        children: [
          {
            id: 6,
            name: 'vuetify :',
            children: [
              {
                id: 7,
                name: 'src :',
                children: [
                  { id: 8, name: 'index : ts' },
                  { id: 9, name: 'bootstrap : ts' }
                ]
              }
            ]
          },
          {
            id: 10,
            name: 'material2 :',
            children: [
              {
                id: 11,
                name: 'src :',
                children: [
                  { id: 12, name: 'v-btn : ts' },
                  { id: 13, name: 'v-card : ts' },
                  { id: 14, name: 'v-window : ts' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 15,
        name: 'Downloads :',
        children: [
          { id: 16, name: 'October : pdf' },
          { id: 17, name: 'November : pdf' },
          { id: 18, name: 'Tutorial : html' }
        ]
      },
      {
        id: 19,
        name: 'Videos :',
        children: [
          {
            id: 20,
            name: 'Tutorials :',
            children: [
              { id: 21, name: 'Basic layouts : mp4' },
              { id: 22, name: 'Advanced techniques : mp4' },
              { id: 23, name: 'All about app : dir' }
            ]
          },
          { id: 24, name: 'Intro : mov' },
          { id: 25, name: 'Conference introduction : avi' }
        ]
      }
    ]
  }),
  computed: {
    needKeepAlive() {
      return this.keepAliveRouters.includes(this.$route.name)
    },
    unReadMessageCount() {
      return 0
    }
  },
  watch: {},
  created() {},
  mounted() {},
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
