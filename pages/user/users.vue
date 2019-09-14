<template>
  <v-container justify-center align-start>
    <v-layout style="width: 30vw" class="mb-3">
      <v-text-field
        v-model="searchKey"
        hide-details
        label="搜索用户"
        prepend-inner-icon="search"
        rounded
        @keyup.enter.native="loadUserList"
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap>
      <v-flex
        v-for="userInfo in userList"
        :key="userInfo.userId"
        xs4
        md4
        lg3
        style="height: 75px"
        class="ma-4"
      >
        <UserCard :user-info="userInfo"></UserCard>
      </v-flex>
    </v-layout>
  </v-container>
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
      size: 100
    }
  }),
  created() {
    this.loadUserList()
  },
  methods: {
    loadUserList() {
      this.$axios
        .$post('/userInfo/listUsers', {
          current: this.page.current,
          size: this.page.size,
          searchKey: this.searchKey
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userList = resp.data.records
          }
        })
    }
  }
}
</script>
