<template>
  <v-app v-show="userList">
    <v-layout style="min-width: 200px;max-width:400px" shrink>
      <v-text-field
        v-model="searchKey"
        hide-details
        placeholder="用户名/昵称"
        append-icon="search"
        rounded
        @click:append="loadUserList"
        @keyup.enter.native="loadUserList"
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap shrink class="mt-3">
      <UserCard
        v-for="userInfo in userList"
        :key="userInfo.userId"
        :user-info="userInfo"
      ></UserCard>
    </v-layout>
  </v-app>
</template>
<script>
import UserCard from '../../components/UserCard'
export default {
  components: { UserCard },
  data: () => ({
    userList: null,
    searchKey: null,
    page: {
      current: 1,
      size: 50
    },
    loadMore: {
      isLoading: false,
      noMore: false
    }
  }),
  created() {
    this.loadUserList()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    loadUserList() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post('/userInfo/listUsers', {
          current: this.page.current,
          size: this.page.size,
          searchKey: this.searchKey
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userList = resp.data
          } else {
            this.userList = []
          }
        })
    },
    scroll() {
      window.onscroll = () => {
        if (!/\/users/.test(this.$route.path)) {
          return false
        }
        // 距离底部200px时加载一次
        const bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          200
        if (
          bottomOfWindow &&
          !this.loadMore.isLoading &&
          !this.loadMore.noMore
        ) {
          this.loadMore.isLoading = true
          this.$axios
            .$post('/userInfo/listUsers', {
              current: ++this.page.current,
              size: this.page.size,
              searchKey: this.searchKey
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.userList = this.userList.concat(resp.data)
              } else {
                this.loadMore.noMore = true
              }
            })
            .catch((e) => {
              this.loadMore.isLoading = false
            })
        }
      }
    }
  }
}
</script>
