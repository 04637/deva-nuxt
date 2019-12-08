<template>
  <v-flex xs4 md4 lg3 style="max-width: 358px" shrink>
    <v-card
      min-width="250px"
      class="px-3 pb-2"
      flat
      style="padding-top:10px; border-radius: 0;border-right: 0.5px solid #e7e7e7;border-bottom: 0.5px solid #e7e7e7"
    >
      <v-layout align-center justify-space-between>
        <v-layout align-center>
          <TagChip :tag-info="tagInfo"></TagChip>
          <span class="ml-2 my_gray--text" title="总使用次数"
            >× {{ tagInfo.totalCount }}</span
          ></v-layout
        >
        <v-btn
          icon
          small
          title="声望值达到200将可以编辑标签描述"
          @click="
            editDescription.description = tagInfo.description
            editDescription.tagName = tagInfo.tagName
            editDescription.tagId = tagInfo.tagId
            editDescription.dialog = $store.getters.getRep >= 200
          "
          ><v-icon small>edit</v-icon></v-btn
        >
        <v-btn
          v-show="showLove"
          class="ml-1"
          icon
          small
          @click="likeTag(tagInfo)"
          ><v-icon :color="tagInfo.liked ? 'private' : ''" small
            >mdi-heart</v-icon
          ></v-btn
        >
      </v-layout>
      <v-flex class="label-description" style="margin-top:5px">
        <!--展示一行省略-->
        <span :title="tagInfo.description" class="my_gray--text">
          {{ tagInfo.description }}
        </span>
      </v-flex>
      <v-layout
        v-show="showCount"
        style="font-size: 14px"
        class="mt-1"
        justify-space-between
      >
        <v-layout> 近一周使用 {{ tagInfo.weekFrequency }} 次 </v-layout>
        <v-layout justify-end>
          近一月使用 {{ tagInfo.monthFrequency }} 次
        </v-layout>
      </v-layout>
    </v-card>
    <v-dialog v-model="editDescription.dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editDescription.tagName }}</span>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="editDescription.description"
            style="font-size: 0.8rem"
            placeholder="输入标签描述"
            :rules="[rules.tagDescription]"
            :counter="400"
          ></v-textarea>
          <div v-if="editDescription.resp">
            <small v-if="editDescription.resp.succeed" class="success--text">{{
              editDescription.resp.msg
            }}</small>
            <small v-else class="error--text">{{
              editDescription.resp.msg
            }}</small>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            @click="
              editDescription.dialog = false
              editDescription.resp = null
              editDescription.description = null
              editDescription.tagId = null
              editDescription.tagName = null
            "
            >关闭
          </v-btn>
          <v-btn
            text
            small
            color="primary"
            :loading="editDescription.loading"
            @click="updateDescription"
            ><span>更新</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>
<script>
import TagChip from './TagChip'
export default {
  components: { TagChip },
  props: {
    tagInfo: {
      required: true,
      type: Object
    },
    showLove: {
      required: false,
      type: Boolean,
      default: true
    },
    showCount: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editDescription: {
        dialog: false,
        resp: null,
        loading: false,
        description: null,
        tagId: null,
        tagName: null
      },
      rules: {
        tagDescription: (v) =>
          (v && v.length <= 400) || !v || '标签描述不能超过400个字符'
      }
    }
  },
  methods: {
    updateDescription() {
      if (
        !(
          this.editDescription.description &&
          this.editDescription.description.length > 0 &&
          this.editDescription.description.length <= 100
        )
      ) {
        return false
      }
      this.editDescription.loading = true
      const _tag = this.tagInfo
      this.$axios
        .$post('/tagInfo/updateDescription', {
          tagId: _tag.tagId,
          description: this.editDescription.description
        })
        .then((resp) => {
          this.editDescription.resp = resp
          this.editDescription.loading = false
          if (resp.succeed) {
            this.$set(_tag, 'description', resp.data)
            this.editDescription.dialog = false
          }
        })
        .catch((e) => {
          this.editDescription.loading = false
        })
    },
    likeTag(_tag) {
      this.$axios
        .$post('/tagLike/likeTag', {
          tagId: _tag.tagId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.$set(_tag, 'liked', resp.data)
          }
        })
    }
  }
}
</script>
<style>
/* 控制展示两行 */
.label-description {
  font-size: 14px;
  /*text-indent: 12px;*/
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  min-height: 42px;
}
</style>
