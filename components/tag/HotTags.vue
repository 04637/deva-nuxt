<template>
  <div class="right-box pa-4">
    <v-layout
      v-if="hotTagList && hotTagList.length > 0"
      align-center
      class="mb-1"
      ><span class="my_gray--text">热门标签</span></v-layout
    >
    <v-divider class="mt-2"></v-divider>
    <div class="py-1 px-2 mt-2">
      <transition-group name="list">
        <div v-for="tag in hotTagList" :key="tag.tagId" class="mb-3 mt-1">
          <TagChip :tag-info="tag" color="light_blue"></TagChip>&nbsp;<span
            class="my_gray--text"
            title="提问次数"
            >× {{ tag.totalCount }}</span
          >
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import TagChip from './TagChip'
export default {
  components: { TagChip },
  props: {
    loadHot: {
      required: false,
      type: Boolean,
      default: true
    },
    hotSize: {
      required: false,
      type: Number,
      default: 15
    }
  },
  data: () => ({
    hotTagList: null
  }),
  created() {
    this.loadHotTags()
  },
  methods: {
    loadHotTags() {
      if (!this.loadHot) {
        return
      }
      this.$axios
        .$post('/tagInfo/listTags', {
          current: 1,
          size: this.hotSize
        })
        .then((resp) => {
          this.hotTagList = resp.data
        })
    }
  }
}
</script>
