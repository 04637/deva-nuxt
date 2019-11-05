<template>
  <v-app>
    <v-layout column shrink>
      <v-card-title
        ><v-row align="center"
          >{{ blogDetail.title }}&nbsp;<v-btn
            v-if="blogDetail.authorId === $store.getters.getUserId"
            color="private"
            text
            small
            :to="'/blog/postBlog?blogId=' + blogDetail.blogId"
            ><v-icon small>edit</v-icon>编辑</v-btn
          ></v-row
        ></v-card-title
      >
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center justify-space-around>
      <v-flex xs11 lg9 justify-start class="mt-4">
        <v-card flat exact width="100vw" class="pa-3">
          <v-col>
            <v-layout
              justify-end
              style="position: relative; top: -20px;font-size:0.8rem"
              align-center
            >
              <span class="my_gray--text" style="position: relative; top: -1px"
                >浏览 {{ blogDetail.viewNum }} 次</span
              >
              <v-btn icon small class="ml-4" @click="likeBlog"
                ><v-icon small :color="blogDetail.isLiked ? 'private' : ''"
                  >favorite</v-icon
                ></v-btn
              ><span>{{ blogDetail.likeNum }}</span>
              <v-btn icon small class="ml-4" @click="voteBlog"
                ><v-icon small :color="blogDetail.isUseful ? 'private' : ''"
                  >mdi-thumb-up</v-icon
                ></v-btn
              ><span>{{ blogDetail.voteNum }}</span>
            </v-layout>
            <div
              v-dompurify-html="$md.render(blogDetail.content)"
              style="position: relative; top: -15px"
            ></div>
          </v-col>
          <v-divider></v-divider>
          <v-card-actions>
            <v-layout justify-space-between align-center>
              <v-flex xs8>
                <v-layout>
                  <TagChip
                    v-for="tag in blogDetail.tags"
                    :key="tag.tagId"
                    class="mr-3"
                    :tag-info="tag"
                  ></TagChip>
                </v-layout>
              </v-flex>
              <v-flex xs4>
                <v-layout
                  justify-end
                  style="min-width: 200px; width: 100%; max-width: 300px;"
                >
                  <v-card
                    style="width: 100%"
                    class="px-8 pt-3 pb-1 user_card"
                    :to="'/user/' + blogDetail.author.userId"
                  >
                    <v-layout justify-space-between>
                      <v-flex xs5>
                        <v-layout justify-center>
                          <v-avatar color="grey">
                            <v-img :src="blogDetail.author.avatar"></v-img>
                          </v-avatar>
                        </v-layout>
                        <v-layout justify-center class="mt-2">
                          <span
                            class="subtitle-2 text-no-wrap text-truncate d-block"
                            >{{
                              blogDetail.author.nickname || blogDetail.username
                            }}</span
                          >
                        </v-layout>
                      </v-flex>
                      <v-flex xs7>
                        <v-layout
                          column
                          align-end
                          justify-space-between
                          style="height:100%"
                        >
                          <v-layout>
                            <small
                              :title="
                                $options.filters.moment(blogDetail.createTime)
                              "
                            >
                              提问于&nbsp;
                              {{ blogDetail.createTime | timeago }}</small
                            >
                          </v-layout>
                          <v-layout
                            v-if="
                              blogDetail.createTime !== blogDetail.modifiedTime
                            "
                          >
                            <small
                              :title="
                                $options.filters.moment(blogDetail.modifiedTime)
                              "
                            >
                              更新于&nbsp;
                              {{ blogDetail.modifiedTime | timeago }}</small
                            ></v-layout
                          >
                          <v-layout justify-end align-end>
                            <v-layout align-center>
                              <v-icon small color="red" title="用户声望"
                                >mdi-music-clef-bass</v-icon
                              >&nbsp;{{ blogDetail.author.reputation }}
                            </v-layout>
                          </v-layout>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-divider></v-divider>
          <v-layout justify-end class="mt-2">
            <v-btn small text @click="showCommentInput = !showCommentInput"
              >添加评论</v-btn
            >
          </v-layout>
          <v-layout>
            <v-list width="100vw" dense class="pb-5">
              <div
                v-for="comment in blogDetail.comments"
                :key="comment.commentId"
              >
                <div>
                  <v-list-item style="min-height: 28px">
                    <span style="font-size: 0.8rem">
                      {{ comment.content }}&nbsp;&nbsp;--&nbsp;
                      <router-link
                        style="text-decoration: none;font-size:0.8rem"
                        :to="'/user/' + comment.author.userId"
                        >{{
                          comment.author.nickname || comment.author.username
                        }}
                      </router-link>
                      <span
                        class="my_gray--text"
                        style="font-size: 0.8rem;"
                        :title="$options.filters.moment(comment.createTime)"
                        >&nbsp;{{ comment.createTime | timeago }}</span
                      >
                    </span>
                  </v-list-item>
                  <v-divider></v-divider>
                </div>
              </div>
            </v-list>
          </v-layout>
          <!--  评论输入区-->
          <v-layout v-show="showCommentInput" class="pb-2">
            <v-text-field
              ref="commentRef"
              v-model="comment.currentComment"
              append-outer-icon="mdi-reply"
              autofocus
              class="pt-0 mt-0"
              placeholder="@用户昵称 可回复/召唤⚡该用户，最多可召唤五个哦"
              :rules="[rules.requiredComment, rules.max400]"
              @keyup.enter.native="sendComment()"
              @click:append-outer="sendComment()"
            ></v-text-field>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex lg2 justify-end shrink hidden-md-and-down class="ml-3 mt-4">
        <client-only> <HotTag></HotTag></client-only>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import HotTag from '../../../components/HotTag'
import TagChip from '../../../components/TagChip'

export default {
  name: 'BlogDetail',
  components: {
    TagChip,
    HotTag
  },
  validate({ params }) {
    return /^\d{18}$/.test(params.id)
  },
  data: () => ({
    contentCode: '',
    blogDetail: null,
    // 控制更多评论的显示隐藏
    showAllComments: false,
    // 控制评论输入框的下是隐藏
    showCommentInput: false,
    comment: {
      // 当前正在输入的评论
      currentComment: null,
      // 评论提示弹框
      dialog: false,
      // 回答结果
      resp: null
    },
    rules: {
      min10: (v) => (v && v.length >= 10) || '不能少于10个字符',
      min20: (v) => (v && v.length >= 20) || '不能少于20个字符',
      max100: (v) => (v && v.length <= 100) || '不能超过100个字符',
      max10000: (v) => (v && v.length <= 10000) || '不能超过10000个字符',
      max400: (v) => (v && v.length) <= 400 || '不能超过400个字符',
      requiredComment: (v) => (v && v.trim().length > 0) || '评论不能为空'
    },
    keywords: null
  }),
  computed: {},
  watch: {},
  // ssr渲染
  async asyncData({ $axios, params }) {
    const resp = await $axios.$post('/blogInfo/getBlogDetail', {
      blogId: params.id
    })
    const blogDetail = resp.data
    const keywords1 = blogDetail.title.split(' ')
    const keywords2 = blogDetail.tags.map((t) => {
      return t.tagName
    })
    const _keywords = keywords1.concat(keywords2)
    const keywords = _keywords.join(',')
    return { blogDetail, keywords }
  },
  head() {
    // 不能写成 head:()=>({}) https://stackoverflow.com/blogs/46064245/nuxt-js-ssr-title-undefined
    return {
      title: this.blogDetail.title,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.keywords },
        {
          hid: 'description',
          name: 'description',
          content: this.$options.filters.filterHtml(
            this.$md.render(this.blogDetail.content)
          )
        }
      ]
    }
  },
  mounted() {},
  methods: {
    voteBlog() {
      const _this = this
      this.$axios
        .$post('/blogVote/voteBlog', {
          oldUseful: this.blogDetail.isUseful,
          isUseful: true,
          blogId: this.blogDetail.blogId
        })
        .then((resp) => {
          if (resp.succeed) {
            _this.blogDetail.voteNum += Number(resp.data.voteDelta)
            _this.blogDetail.isUseful = resp.data.useful
          }
        })
        .catch((e) => {
          _this.comment.loading = false
        })
    },
    sendComment() {
      if (!this.$refs.commentRef.validate()) {
        return false
      }
      const _this = this
      this.$axios
        .$post('/blogComment/commentBlog', {
          ownBlogId: _this.blogDetail.blogId,
          content: _this.comment.currentComment
        })
        .then((resp) => {
          _this.comment.resp = resp
          if (resp.succeed) {
            _this.blogDetail.comments.push(resp.data)
            _this.comment.currentComment = null
          } else {
            _this.comment.dialog = true
          }
          this.showCommentInput = false
        })
        .catch((e) => {
          _this.comment.loading = false
        })
    },
    likeBlog() {
      const _this = this
      this.$axios
        .$post('/blogLike/likeBlog', {
          blogId: _this.blogDetail.blogId
        })
        .then((resp) => {
          if (resp.succeed) {
            _this.blogDetail.isLiked = resp.data
            _this.blogDetail.likeNum += resp.data ? 1 : -1
          }
        })
    },
    checkLogin() {
      if (!this.$store.state.userInfo) {
        this.$router.push('/user/login')
      }
    }
  }
}
</script>
