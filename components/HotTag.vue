<template>
  <div>
    <v-layout v-if="likeTagList && likeTagList.length > 0" align-center
      ><v-icon small color="red">mdi-heart</v-icon>&nbsp;<span>我的标签</span
      ><v-btn
        class="ml-1"
        small
        text
        icon
        color="blue"
        @click="editable = !editable"
        ><v-icon small>edit</v-icon></v-btn
      ></v-layout
    >
    <transition-group name="list">
      <div v-for="tag in likeTagList" :key="'like' + tag.tagId" class="mt-4">
        <v-layout align-center>
          <TagChip color="blue" :tag-info="tag"></TagChip>&nbsp;<span
            class="my_gray--text"
            >× {{ tag.totalCount }}</span
          ><transition name="fade"
            ><v-btn
              v-show="editable"
              small
              icon
              title="取消关注"
              style="height: 24px"
              @click="toggleLikeTag(tag)"
              ><v-icon small color="warning">mdi-close</v-icon></v-btn
            ></transition
          >
        </v-layout>
      </div>
    </transition-group>
    <v-divider
      v-if="likeTagList && likeTagList.length > 0"
      class="my-3"
    ></v-divider>
    <v-layout v-if="hotTagList && hotTagList.length > 0" align-center
      ><v-icon small color="red">mdi-fire</v-icon>&nbsp;<span
        >热门标签</span
      ></v-layout
    >
    <transition-group name="list">
      <div v-for="tag in hotTagList" :key="tag.tagId" class="mt-4">
        <TagChip :tag-info="tag"></TagChip>&nbsp;<span class="my_gray--text"
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
  data: () => ({
    hotTagList: null,
    likeTagList: null,
    editable: false
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
    },
    toggleLikeTag(_tag) {
      this.$axios
        .$post('/tagLike/likeTag', {
          tagId: _tag.tagId
        })
        .then((resp) => {
          if (resp.succeed) {
            for (let i = 0; i < this.likeTagList.length; ++i) {
              if (this.likeTagList[i].tagId === _tag.tagId) {
                this.likeTagList.splice(i, 1)
                break
              }
            }
          }
        })
    }
  }
}
</script>
