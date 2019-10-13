<template>
  <v-app v-show="tagList">
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
        <v-card min-width="250px" class="px-3 pb-2" style="padding-top:10px">
          <v-layout align-center>
            <v-menu
              open-on-hover
              offset-y
              top
              min-width="103px"
              max-width="103px"
            >
              <template v-slot:activator="{ on }">
                <v-chip
                  small
                  color="primary"
                  text
                  style="max-width:170px; cursor: pointer; text-decoration: none;border-radius: 0"
                  :title="tagInfo.tagName"
                  class="d-inline-block text-truncate text-left no-flex"
                  :to="'/search/' + tagInfo.tagName"
                  v-on="on"
                >
                  <span style="font-size: 14px">{{
                    tagInfo.tagName
                  }}</span></v-chip
                ></template
              ><v-btn
                v-if="$store.getters.getRep >= 200"
                small
                text
                color="private"
                @click="
                  editDescription.description = tagInfo.description
                  editDescription.tagName = tagInfo.tagName
                  editDescription.tagId = tagInfo.tagId
                  editDescription.dialog = true
                "
                ><v-icon color="private" small>edit</v-icon>编辑描述</v-btn
              ></v-menu
            >
            <span class="ml-2 my_gray--text" title="总使用次数"
              >× {{ tagInfo.totalCount }}</span
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
          <v-text-field
            v-model="editDescription.description"
            label="输入标签描述"
            :rules="[rules.tagDescription]"
            :counter="100"
          ></v-text-field>
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
            color="primary"
            :loading="editDescription.loading"
            @click="updateDescription"
            ><strong>更新</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    tagList: null,
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
  created() {
    this.loadTagList()
  },
  mounted() {
    this.scroll()
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
            this.tagList = resp.data.records
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
                this.tagList = this.tagList.concat(resp.data.records)
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
  min-height: 36px;
}
</style>
