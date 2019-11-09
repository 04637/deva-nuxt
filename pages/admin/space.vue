<template>
  <v-app v-if="spaceInfoList">
    <v-layout style="width: 30vw" class="mb-3" shrink>
      <v-text-field
        v-model="searchKey"
        hide-details
        label="空间ID/名称 创建人用户名/昵称"
        prepend-inner-icon="search"
        rounded
        @keyup.enter.native="loadSpaceList"
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap shrink>
      <v-flex
        v-for="spaceInfo in spaceInfoList"
        :key="spaceInfo.spaceId"
        xs5
        md4
        lg3
        class="ma-4"
      >
        <SpaceCard :space-info="spaceInfo"></SpaceCard>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import SpaceCard from '../../components/SpaceCard'
export default {
  components: { SpaceCard },
  data: () => ({
    spaceInfoList: null,
    searchKey: null,
    page: {
      current: 1,
      size: 30
    }
  }),
  created() {
    this.loadSpaceList()
  },
  methods: {
    loadSpaceList() {
      if (this.$store.getters.isAdmin) {
        this.$axios
          .$post('/admin/getSpaceList', {
            current: this.page.current,
            size: this.page.size,
            searchKey: this.searchKey
          })
          .then((resp) => {
            if (resp.succeed) {
              this.spaceInfoList = resp.data.content
            }
          })
      }
    }
  }
}
</script>
