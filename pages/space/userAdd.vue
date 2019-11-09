<template>
  <v-app v-show="userList">
    <v-layout class="mb-3" style="width: 70vw" shrink justify-space-around>
      <v-text-field
        v-model="searchKey"
        style="width: 30vw"
        hide-details
        label="用户名/昵称"
        prepend-inner-icon="search"
        rounded
        @keyup.enter.native="loadUserList"
      ></v-text-field>
      <v-btn
        v-if="spaceInfo"
        :to="'/space/manageSpace?spaceId=' + spaceInfo.spaceId"
        text
        outlined
        color="private"
        small
        ><span class="ml-1">{{ spaceInfo.spaceName }}</span></v-btn
      >
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap shrink>
      <v-flex
        v-for="userInfo in userList"
        :key="userInfo.userId"
        xs4
        md4
        lg3
        style="max-height: 75px; max-width: 358px"
        class="ma-4"
      >
        <UserCard
          :user-info="userInfo"
          action-icon="mdi-plus"
          :action-event="addUser2Space"
          :action-title="'将用户添加至→' + (spaceInfo && spaceInfo.spaceName)"
        ></UserCard>
      </v-flex>
    </v-layout>
    <InfoDialog
      :msg="[
        '添加成功',
        (addResult.resp && addResult.resp.msg) || '添加失败, 用户可能已存在'
      ]"
      :succeed="addResult.resp != null && addResult.resp.succeed"
      :dialog="addResult.dialog"
      @update:dialog="addResult.dialog = $event"
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import UserCard from '../../components/UserCard'
import InfoDialog from '../../components/InfoDialog'
export default {
  components: { UserCard, InfoDialog },
  data: () => ({
    userList: null,
    searchKey: null,
    spaceInfo: null,
    addResult: {
      resp: null,
      dialog: false,
      loading: false
    },
    page: {
      current: 1,
      size: 100
    },
    loadMore: {
      isLoading: false,
      noMore: false
    }
  }),
  created() {
    this.loadUserList()
    this.loadSpaceInfo()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    scroll() {
      window.onscroll = () => {
        if (!/\/space\/userAdd/.test(this.$route.path)) {
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
            .$post('/spaceUser/getNotSpaceMembers', {
              current: ++this.page.current,
              size: this.page.size,
              searchKey: this.searchKey,
              spaceId: this.$route.query.spaceId
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.userList = this.userList.concat(resp.data.content)
              } else {
                this.loadMore.noMore = true
              }
            })
            .catch((e) => {
              this.loadMore.isLoading = false
            })
        }
      }
    },
    loadUserList() {
      this.$axios
        .$post('/spaceUser/getNotSpaceMembers', {
          current: this.page.current,
          size: this.page.size,
          searchKey: this.searchKey,
          spaceId: this.$route.query.spaceId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userList = resp.data.content
          }
        })
    },
    loadSpaceInfo() {
      this.$axios
        .$post('/spaceInfo/getSpaceInfo', {
          spaceId: this.$route.query.spaceId
        })
        .then((resp) => {
          this.spaceInfo = resp.data
        })
    },
    addUser2Space(_userId) {
      this.addResult.loading = true
      this.$axios
        .$post('/spaceUser/addUser', {
          spaceId: this.spaceInfo.spaceId,
          addUserId: _userId
        })
        .then((resp) => {
          this.addResult.resp = resp
          this.addResult.loading = false
          this.addResult.dialog = true
          if (resp.succeed) {
            this.loadUserList()
          }
        })
    }
  }
}
</script>
