<template>
  <div class="pa-4 right-box">
    <v-layout align-center class="mb-1"
      ><v-icon small color="new_orange">mdi-heart</v-icon>&nbsp;<span
        class="my_gray--text"
        >我的标签</span
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
    <v-divider class="mt-2"></v-divider>
    <div v-if="likeTagList && likeTagList.length > 0" class="py-1 px-2 mt-2">
      <transition-group name="list">
        <div
          v-for="tag in likeTagList"
          :key="'like' + tag.tagId"
          class="mb-3 mt-1"
        >
          <v-layout align-center>
            <TagChip :tag-info="tag"></TagChip>&nbsp;<span
              class="my_gray--text"
              title="使用次数"
              >× {{ tag.totalCount }}</span
            ><transition name="fade"
              ><v-btn
                v-show="editable"
                small
                icon
                title="取消关注"
                style="height: 24px"
                @click="toggleLikeTag(tag)"
                ><v-icon small color="private">mdi-close</v-icon></v-btn
              ></transition
            >
          </v-layout>
        </div>
      </transition-group>
    </div>
    <div v-else class="mt-2 my_gray--text">
      <span>还没有关注标签呢, 快去添加吧~</span>
    </div>
    <v-layout justify-center class="mt-2">
      <v-btn outlined color="my_gray" width="100%" to="/tag/tags"
        >查看所有标签 >
      </v-btn>
    </v-layout>
  </div>
</template>
<script>
import TagChip from '../tag/TagChip'
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
    this.loadLikeTags()
  },
  methods: {
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
