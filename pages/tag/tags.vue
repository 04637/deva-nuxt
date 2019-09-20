<template>
  <v-app>
    <v-layout style="width: 30vw" class="mb-3" shrink>
      <v-text-field
        v-model="searchKey"
        hide-details
        label="搜索标签"
        prepend-inner-icon="search"
        rounded
        @keyup.enter.native="loadTagList"
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap>
      <v-flex
        v-for="tagInfo in tagList"
        :key="tagInfo.tagId"
        xs4
        md4
        lg3
        style="height: 90px"
        class="ma-4"
      >
        <v-card class="px-3 py-2" :to="'/search/' + tagInfo.tagName">
          <v-layout>
            <v-btn
              x-small
              text
              :title="tagInfo.tagName"
              style="max-width:80%;font-weight: bold"
              class="d-inline-block text-truncate text-left no-flex"
              >{{ tagInfo.tagName }}</v-btn
            >
            <span style="height: 20px; line-height: 20px" class="ml-2"
              >× {{ tagInfo.totalCount }}</span
            >
          </v-layout>
          <v-layout class="mt-1">
            <!--展示一行省略-->
            <v-card-text
              style="height: 22px"
              class="d-inline-block text-truncate pa-0"
              :title="tagInfo.description"
            >
              {{ tagInfo.description }}
            </v-card-text>
          </v-layout>
          <v-layout style="font-size: 14px" class="mt-1" justify-space-between>
            <v-layout> 今日使用 {{ tagInfo.dayFrequency }} 次 </v-layout>
            <v-layout justify-end>
              近一周使用 {{ tagInfo.weekFrequency }} 次
            </v-layout>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    tagList: null,
    searchKey: null,
    page: {
      current: 1,
      size: 100
    }
  }),
  created() {
    this.loadTagList()
  },
  methods: {
    loadTagList() {
      this.$axios
        .$post('/tagInfo/listTags', {
          current: this.page.current,
          size: this.page.size,
          searchKey: this.searchKey
        })
        .then((resp) => {
          if (resp.succeed) {
            this.tagList = resp.data.records
          }
        })
    }
  }
}
</script>

<style scoped></style>
