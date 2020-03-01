<template>
  <v-app>
    <v-layout justify-center justify-space-around style="position:relative;">
      <v-flex xs12 md10 lg9 justify-start class="mt-4">
        <div class="float-action hidden-sm-and-down" style="z-index: 999">
          <v-flex>
            <v-btn @click="voteBlog" large icon class="d-block"
              ><v-icon
                :color="blogDetail.isUseful ? 'private' : 'my_gray'"
                small
                >mdi-thumb-up</v-icon
              ></v-btn
            >
            <v-btn @click="likeBlog" large icon class="d-block mt-4"
              ><v-icon :color="blogDetail.isLiked ? 'private' : 'my_gray'" small
                >mdi-heart</v-icon
              ></v-btn
            >
          </v-flex>
        </div>
        <v-card
          flat
          exact
          width="100vw"
          style="padding-left:10px;padding-right:10px;"
          class="right-box"
        >
          <v-col>
            <h2 style="font-weight: normal">
              {{ blogDetail.title }}&nbsp;<v-btn
                v-if="blogDetail.authorId === $store.getters.getUserId"
                :to="'/blog/postBlog?blogId=' + blogDetail.blogId"
                class="private--text"
                text
                style="font-size: 14px"
                ><v-icon color="private" small>edit</v-icon>编辑</v-btn
              >
            </h2>
            <header-user-card
              :user="blogDetail.author"
              :create-time="blogDetail.createTime"
              :modified-time="blogDetail.modifiedTime"
              :view-num="blogDetail.viewNum"
              :vote-num="blogDetail.voteNum"
              :like-num="blogDetail.likeNum"
              width="100%"
              class="mt-2"
            ></header-user-card>
            <div
              v-dompurify-html="$md.render(blogDetail.content)"
              class="mt-4 ql-editor"
            ></div>
          </v-col>
          <v-card-actions>
            <v-layout justify-space-between align-center>
              <v-layout wrap>
                <TagChip
                  v-for="tag in blogDetail.tagInfos"
                  :key="tag.tagId"
                  :tag-info="tag"
                  class="mr-3 mb-1"
                ></TagChip>
              </v-layout>
            </v-layout>
          </v-card-actions>
          <v-divider></v-divider>
          <v-layout justify-end class="mt-2">
            <v-btn @click="showCommentInput = !showCommentInput" small text
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
                        :to="'/user/' + comment.author.userId"
                        style="text-decoration: none;font-size:0.8rem"
                        >{{
                          comment.author.nickname || comment.author.username
                        }}
                      </router-link>
                      <span
                        :title="$options.filters.moment(comment.createTime)"
                        class="my_gray--text"
                        style="font-size: 0.8rem;"
                        >&nbsp;{{ comment.createTime | timeago }}</span
                      >&nbsp;<span
                        v-if="
                          comment.author.userId === $store.getters.getUserId ||
                            $store.getters.isAdmin
                        "
                        @click="
                          delBlogComment(blogDetail.comments, comment.commentId)
                        "
                        class="link_color--text"
                        style="font-size:0.8rem; cursor: pointer"
                        >删除</span
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
              :rules="[rules.requiredComment, rules.max400]"
              @keyup.enter.native="sendComment()"
              @click:append-outer="sendComment()"
              append-outer-icon="mdi-reply"
              autofocus
              class="pt-0 mt-0"
              placeholder="@用户昵称 可回复/召唤⚡该用户，最多可召唤五个哦"
            ></v-text-field>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex lg3 justify-end shrink hidden-md-and-down class="ml-3 mt-4">
        <client-only>
          <right-user-card
            :user="blogDetail.author"
            :create-time="blogDetail.createTime"
            :modified-time="blogDetail.modifiedTime"
            :justify-end="false"
            prefix="发布"
            class="mb-2 right-box"
            width="100%"
          ></right-user-card>
          <RelatePost
            :exclude-id="blogDetail.blogId"
            :tags="blogDetail.tagInfos"
          ></RelatePost
        ></client-only>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import TagChip from '../../../components/tag/TagChip'
import RelatePost from '../../../components/rightBox/RelatePost'
import HeaderUserCard from '../../../components/userCard/HeaderUserCard'
import RightUserCard from '../../../components/userCard/RightUserCard'

export default {
  name: 'BlogDetail',
  components: {
    RightUserCard,
    HeaderUserCard,
    RelatePost,
    TagChip
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
    }
  }),
  computed: {},
  watch: {},
  // ssr渲染
  async asyncData({ $axios, params }) {
    const resp = await $axios.$post('/blogInfo/getBlogDetail', {
      blogId: params.id
    })
    const blogDetail = resp.data
    return { blogDetail }
  },
  head() {
    // 不能写成 head:()=>({}) https://stackoverflow.com/blogs/46064245/nuxt-js-ssr-title-undefined
    return {
      title: this.blogDetail.tkd.title + ' -DEVA开发者社区',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.blogDetail.tkd.keywords.join(',')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.blogDetail.tkd.description
        }
      ]
    }
  },
  mounted() {
    this.pushBaidu()
  },
  methods: {
    delBlogComment(_comments, _commentId) {
      this.$axios
        .$post('/blogComment/delComment', {
          commentId: _commentId
        })
        .then((resp) => {
          if (resp.succeed) {
            for (let i = 0; i < _comments.length; ++i) {
              if (_comments[i].commentId === _commentId) {
                _comments.splice(i, 1)
                break
              }
            }
          }
        })
    },
    pushBaidu() {
      const bp = document.createElement('script')
      const curProtocol = window.location.protocol.split(':')[0]
      if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js'
      } else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js'
      }
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(bp, s)
    },
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
      if (this.$store.getters.getUserId && !this.$store.getters.getUserPhone) {
        this.$store.commit('setPhoneDialog', true)
        return false
      }
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
<style scoped>
>>> .float-action {
  position: fixed;
  margin-left: -64px;
  margin-top: 200px;
}
>>> .float-action .v-btn {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background-color: white;
}
</style>
