<template>
  <div>
    <v-layout
      v-if="hotTagList && hotTagList.length > 0"
      align-center
      class="mb-1"
      ><v-icon small color="new_orange">mdi-fire</v-icon>&nbsp;<span
        class="my_gray--text"
        >热门标签</span
      ></v-layout
    >
    <transition-group name="list">
      <div v-for="tag in hotTagList" :key="tag.tagId" class="mb-3 mt-1">
        <TagChip color="light_blue" :tag-info="tag"></TagChip>&nbsp;<span
          class="my_gray--text"
          title="使用次数"
          >× {{ tag.totalCount }}</span
        >
      </div>
    </transition-group>
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
    hotTagList: null,
    likeTagList: null,
    editable: false
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
          this.hotTagList = resp.data.content
        })
    }
  }
}
</script>
