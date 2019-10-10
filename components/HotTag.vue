<template>
  <div>
    <span>热门标签</span>
    <div v-for="tag in hotTagList" :key="tag.tagId" class="mt-4">
      <v-chip
        style="border-radius: 0"
        color="primary"
        small
        :to="'/search/' + tag.tagName"
        class="d-inline-block text-truncate"
        >{{ tag.tagName }} </v-chip
      >&nbsp;<span class="my_gray--text">× {{ tag.totalCount }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    hotTagList: null
  }),
  created() {
    this.$axios
      .$post('/tagInfo/listTags', {
        current: 1,
        size: 15
      })
      .then((resp) => {
        this.hotTagList = resp.data.records
      })
  },
  methods: {}
}
</script>
