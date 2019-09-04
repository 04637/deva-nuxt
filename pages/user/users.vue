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
        <v-card class="pa-2" :to="'/user/' + userInfo.userId">
          <v-layout justify-space-between>
            <v-flex xs3>
              <v-layout justify-center>
                <v-avatar color="grey">
                  <v-img :src="userInfo.avatar"></v-img>
                </v-avatar>
              </v-layout>
            </v-flex>
            <v-flex xs8>
              <v-layout justify-space-between fill-height column>
                <v-layout>
                  {{ userInfo.bio }}
                </v-layout>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout justify-space-between class="mt-1">
            <v-flex justify-start xs5>
              <v-btn
                x-small
                text
                width="300px"
                class="d-inline-block text-truncate text-left no-flex"
                :title="userInfo.nickname || userInfo.username"
                >{{ userInfo.nickname || userInfo.username }}</v-btn
              >
            </v-flex>
            <v-flex xs4 class="text-right">
              <svg class="icon heat-icon" aria-hidden="true">
                <use xlink:href="#icon-zuanshi"></use></svg
              >&nbsp;{{ userInfo.reputation }}
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
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

<style scoped>
.icon {
  vertical-align: -7px;
}
</style>
