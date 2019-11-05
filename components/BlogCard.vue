<template>
  <div v-if="!deleted">
    <v-list-item class="px-0">
      <v-card
        flat
        exact
        width="100vw"
        class="px-5 pr-6 py-1 pt-2 no-ripple"
        :to="$store.getters.isAdmin ? '' : '/blog/' + blog.blogId"
      >
        <v-layout>
          <v-layout
            column
            justify-space-around
            class="d-md-flex"
            hidden-sm-and-down
          >
            <div title="喜欢">
              <v-icon small>mdi-heart-outline</v-icon>
              <span class="num-span">{{ blog.likeNum }}</span>
            </div>
            <div title="支持">
              <v-icon small>mdi-thumb-up-outline</v-icon>
              <span class="num-span">{{ blog.voteNum }}</span>
            </div>
            <div title="浏览">
              <v-icon small>mdi-cursor-default-click-outline</v-icon>
              <span class="num-span">{{ blog.viewNum }}</span>
            </div>
          </v-layout>
          <v-flex xs9 style="margin-top: 4px">
            <v-btn
              height="30px"
              class="no-hover-active title d-inline-block text-truncate text-left no-flex px-1"
              text
              max-width="85%"
              :title="blog.title"
              :to="'/blog/' + blog.blogId"
              >{{ blog.title }}</v-btn
            >
            <v-card-text
              v-dompurify-html:noHtml="$md.render(blog.content)"
              style="padding: 8px"
              class="title d-block my_gray--text text-truncate subtitle-1"
            >
            </v-card-text>
            <v-card-actions>
              <v-layout>
                <TagChip
                  v-for="tag in blog.tags"
                  :key="tag.tagId"
                  :tag-info="tag"
                  class="mr-3"
                ></TagChip>
              </v-layout>
            </v-card-actions>
          </v-flex>
          <v-row class="pr-2 ml-2" cols="2" justify="end" style="width:15%">
            <v-row justify="end" dense class="my_gray--text">
              <small
                v-if="blog.createTime === blog.modifiedTime"
                :title="$options.filters.moment(blog.createTime)"
              >
                发布于 {{ blog.createTime | timeago }}</small
              >
              <small v-else :title="$options.filters.moment(blog.modifiedTime)">
                更新于 {{ blog.modifiedTime | timeago }}</small
              >
              <small v-if="$store.getters.isAdmin">
                <v-btn
                  small
                  text
                  color="private"
                  style="margin-top: -4px;font-weight: bold;position:relative;left:16px"
                  @click="confirmDelete.dialog = true"
                  >删除</v-btn
                >
              </small>
            </v-row>
            <v-row justify="end" dense style="width:100%">
              <v-col cols="6" align-self="end">
                <v-row justify="end">
                  <v-btn
                    min-width="0"
                    text
                    color="my_gray"
                    class="text-truncate d-inline-block text-left no-flex px-1"
                    :to="'/user/' + blog.author.userId"
                    height="21px"
                  >
                    <span>{{
                      blog.author.nickname || blog.author.username
                    }}</span>
                  </v-btn>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <!--suppress HtmlDeprecatedAttribute -->
              <v-col cols="5" align-self="end">
                <v-row justify="end" align="end" style="font-size: 14px">
                  <v-layout justify-center align-center>
                    <v-icon small color="red" title="用户声望"
                      >mdi-music-clef-bass</v-icon
                    >&nbsp;{{ blog.author.reputation }}
                  </v-layout>
                </v-row>
              </v-col>
            </v-row>
          </v-row>
        </v-layout>
        <ConfirmDialog
          :dialog="confirmDelete.dialog"
          msg="确定删除该博文吗？该操作不可恢复"
          :todo="deleteBlog"
          @update:dialog="confirmDelete.dialog = $event"
        >
        </ConfirmDialog>
      </v-card>
    </v-list-item>
    <div :class="$vuetify.theme.dark ? 'dark-divider' : 'light-divider'"></div>
  </div>
</template>
<script>
import ConfirmDialog from './ConfirmDialog'
import TagChip from './TagChip'
export default {
  components: {
    TagChip,
    ConfirmDialog
  },
  props: {
    blog: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    confirmDelete: {
      dialog: false
    },
    deleted: false
  }),
  methods: {
    deleteBlog() {
      this.$axios
        .$post('/admin/deleteBlog', {
          blogId: this.blog.blogId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.deleted = true
          }
        })
    }
  }
}
</script>
<style scoped>
.blog-tag {
  margin-right: 13px;
}

.num-span {
  margin-left: 7px;
  font-size: 14px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 2px;
}
</style>
