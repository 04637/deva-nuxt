<template>
  <div>
    <v-layout v-if="likeTagList && likeTagList.length > 0" align-center
      ><v-icon small color="red">mdi-heart</v-icon>&nbsp;<span
        >我的标签</span
      ></v-layout
    >
    <div v-for="tag in likeTagList" :key="'like' + tag.tagId" class="mt-4">
      <TagChip color="blue" :tag-info="tag"></TagChip>&nbsp;<span
        class="my_gray--text"
        >× {{ tag.totalCount }}</span
      >
    </div>
    <v-divider
      v-if="likeTagList && likeTagList.length > 0"
      class="my-3"
    ></v-divider>
    <v-layout align-center
      ><v-icon small color="red">mdi-fire</v-icon>&nbsp;<span
        >热门标签</span
      ></v-layout
    >
    <div v-for="tag in hotTagList" :key="tag.tagId" class="mt-4">
      <TagChip :tag-info="tag"></TagChip>&nbsp;<span class="my_gray--text"
        >× {{ tag.totalCount }}</span
      >
    </div>
  </div>
</template>
<script>
import TagChip from './TagChip'
export default {
  components: { TagChip },
  data: () => ({
    hotTagList: null,
    likeTagList: null
  }),
  created() {
    this.loadLikeTags()
    this.loadHotTags()
  },
  methods: {
    loadHotTags() {
      this.$axios
        .$post('/tagInfo/listTags', {
          current: 1,
          size: 15
        })
        .then((resp) => {
          this.hotTagList = resp.data.records
        })
    },
    loadLikeTags() {
      if (this.$store.getters.getUserId) {
        this.$axios.$post('/tagLike/listLikeTags').then((resp) => {
          this.likeTagList = resp.data
        })
      }
    }
  }
}
</script>
