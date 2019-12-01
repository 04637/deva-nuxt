<template>
  <keep-alive>
    <div class="right-box pa-4">
      <v-layout align-center class="mb-1"
        ><span class="my_gray--text">活跃用户</span></v-layout
      >
      <v-divider class="mt-2"></v-divider>
      <div v-if="userList && userList.length > 0" class="py-1 px-2 mt-2">
        <transition-group name="list">
          <div v-for="user in userList" :key="user.userId" class="mb-3 mt-1">
            <v-layout align-center>
              <v-flex shrink>
                <v-avatar>
                  <v-img :src="user.avatar"></v-img>
                </v-avatar>
              </v-flex>
              <v-flex style="font-size: 14px" class="ml-2">
                <v-layout align-center
                  ><div>{{ user.nickname }}</div>
                  <b class="my_gray--text">&nbsp;·&nbsp;</b>
                  <div
                    class="my_gray--text"
                    title="声望"
                    style="font-size: 12px; position: relative; top: 1px"
                  >
                    {{ user.reputation }}
                  </div></v-layout
                >
                <v-layout
                  class="d-block text-truncate"
                  style="min-height: 24px; width: calc(100% - 40px)"
                  wrap
                >
                  <router-link
                    v-for="(tag, index) in user.likeTags"
                    :key="tag.tagId"
                    class="hover-line"
                    style="color: #2196f3;"
                    :to="'/search/' + tag.tagName + '?match=tags'"
                    >{{ tag.tagName
                    }}<span
                      v-if="index < user.likeTags.length - 1"
                      style="cursor: auto"
                      class="my_gray--text"
                      >,
                    </span></router-link
                  >
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
        </transition-group>
      </div>
      <v-layout justify-center class="mt-2">
        <v-btn outlined color="my_gray" width="100%" to="/user/users"
          >查看所有用户 >
        </v-btn>
      </v-layout>
    </div>
  </keep-alive>
</template>
<script>
export default {
  props: {},
  data: () => ({
    userList: null
  }),
  created() {
    this.loadUserList()
  },
  methods: {
    loadUserList() {
      this.$axios
        .$post('/userInfo/listUsers', {
          current: 1,
          size: 10
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userList = resp.data
          } else {
            this.userList = []
          }
        })
    }
  }
}
</script>
