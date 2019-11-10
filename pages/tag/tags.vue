<template>
  <v-app v-show="tagList">
    <v-layout style="width: 30vw" shrink>
      <v-text-field
        v-model="searchKey"
        hide-details
        placeholder="搜索标签"
        append-icon="search"
        rounded
        @click:append="loadTagList"
        @keyup.enter.native="loadTagList"
      ></v-text-field>
    </v-layout>
    <v-divider></v-divider>
    <v-layout wrap shrink>
      <v-flex
        v-for="tagInfo in tagList"
        :key="tagInfo.tagId"
        xs4
        md4
        lg3
        class="ml-4 mb-0 mt-3"
        style="max-width: 358px"
        shrink
      >
        <v-card
          min-width="250px"
          class="px-3 pb-2 no-shadow-box"
          style="padding-top:10px;"
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
            <v-btn class="ml-1" icon small @click="likeTag(tagInfo)"
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
          <v-layout style="font-size: 14px" class="mt-1" justify-space-between>
            <v-layout> 近一周使用 {{ tagInfo.weekFrequency }} 次 </v-layout>
            <v-layout justify-end>
              近一月使用 {{ tagInfo.monthFrequency }} 次
            </v-layout>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
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
  </v-app>
</template>
<script>
import TagChip from '../../components/TagChip'
export default {
  components: { TagChip },
  data: () => ({
    tagList: null,
    likeTags: null,
    searchKey: null,
    page: {
      current: 1,
      size: 50
    },
    loadMore: {
      isLoading: false,
      noMore: false
    },
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
  }),
  computed: {},
  created() {
    this.loadTagList()
  },
  mounted() {
    this.scroll()
  },
  methods: {
    renderLiked() {
      this.tagList.forEach((item) => {
        let liked = false
        this.likeTags.some((_item) => {
          if (_item.tagId === item.tagId) {
            liked = true
            return true
          }
        })
        this.$set(item, 'liked', liked)
      })
    },
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
      this.$axios
        .$post('/tagInfo/updateDescription', {
          tagId: this.editDescription.tagId,
          description: this.editDescription.description
        })
        .then((resp) => {
          this.editDescription.resp = resp
          this.editDescription.loading = false
          if (resp.succeed) {
            for (let i = 0; i < this.tagList.length; ++i) {
              if (this.tagList[i].tagId === this.editDescription.tagId) {
                this.tagList[i].description = resp.data
                break
              }
            }
            this.editDescription.dialog = false
          }
        })
        .catch((e) => {
          this.editDescription.loading = false
        })
    },
    loadLikeTags() {
      if (this.$store.getters.getUserId) {
        this.$axios.$post('/tagLike/listLikeTags').then((resp) => {
          if (resp.succeed) {
            this.likeTags = resp.data
            this.renderLiked()
          }
        })
      }
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
    },
    loadTagList() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post('/tagInfo/listTags', {
          current: this.page.current,
          size: this.page.size,
          searchKey: this.searchKey
        })
        .then((resp) => {
          if (resp.succeed) {
            this.tagList = resp.data.content
            this.loadLikeTags()
          } else {
            this.tagList = []
          }
        })
    },
    scroll() {
      window.onscroll = () => {
        if (!/\/tags/.test(this.$route.path)) {
          return false
        }
        // 距离底部200px时加载一次
        const bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          200
        if (
          bottomOfWindow &&
          !this.loadMore.isLoading &&
          !this.loadMore.noMore
        ) {
          this.loadMore.isLoading = true
          this.$axios
            .$post('/tagInfo/listTags', {
              current: ++this.page.current,
              size: this.page.size,
              searchKey: this.searchKey
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.tagList = this.tagList.concat(resp.data.content)
              } else {
                this.loadMore.noMore = true
              }
            })
            .catch((e) => {
              this.loadMore.isLoading = false
            })
        }
      }
    }
  }
}
</script>

<style scoped>
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
.theme--light .no-shadow-box {
  box-shadow: none;
  border: 1px solid #e7e7e7;
}
.theme--dark .no-shadow-box {
  box-shadow: none;
  border: 1px solid #4b4b4b;
}
</style>
