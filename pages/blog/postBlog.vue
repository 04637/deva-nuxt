<template>
  <v-app>
    <v-app>
      <v-layout justify-end shrink style="height: 24px;">
        <v-flex>
          <span style="font-size: 14px" class="my_gray--text"
            >小提示：右侧可切换markdown编辑器, 如需帮助可
            <a href="http://www.markdown.cn/" target="_blank" class="hover-line"
              ><span>点此查看markdown语法说明</span></a
            ></span
          >
        </v-flex>
        <v-flex shrink>
          <!--<v-btn-->
          <!--  v-if="!$route.query.spaceId"-->
          <!--  class="ml-2"-->
          <!--  small-->
          <!--  to="/question/ask"-->
          <!--  color="blue"-->
          <!--  text-->
          <!--  ><v-icon small>mdi-feather</v-icon><span>发布问题</span></v-btn-->
          <!--&gt;-->
          <v-btn
            :title="
              $store.getters.getUseMarkdown
                ? '切换富文本编辑器'
                : '切换markdown编辑器'
            "
            @click="$store.commit('toggleUseMarkdown')"
            text
            nuxt
            class="text-capitalize"
            small
            ><v-icon>{{
              $store.getters.getUseMarkdown ? 'mdi-markdown' : 'mdi-textbox'
            }}</v-icon></v-btn
          >
        </v-flex>
      </v-layout>
      <v-layout justify-center class="mt-3">
        <v-form ref="form" style="width: 100vw">
          <v-text-field
            ref="title"
            v-model="title"
            :counter="100"
            :rules="[rules.min10, rules.max100]"
            class="mt-0 pt-0 "
            prepend-icon="title"
            label="博文标题"
            required
          ></v-text-field>
          <v-layout
            v-if="$store.getters.getUseMarkdown"
            justify-space-around
            class="mt-1"
          >
            <v-flex xs6>
              <v-textarea
                id="markdown-edit"
                v-model="source"
                :rules="[rules.max16000, rules.min20]"
                no-resize
                class="flat-text"
                placeholder="在此输入内容"
                flat
                counter="16000"
                full-height
                rows="50"
                solo
              ></v-textarea>
            </v-flex>
            <v-flex xs6>
              <div
                id="markdown-preview"
                v-dompurify-html="$md.render(source)"
                class="simple-scroll blog-markdown-preview"
              ></div>
            </v-flex>
          </v-layout>
          <!--富文本编辑器-->
          <div v-if="!$store.getters.getUseMarkdown" style="height: 953px;">
            <Quill
              ref="blogQuill"
              :content="contentCode"
              :max="16000"
              :min="20"
              @update:contentCode="contentCode = $event"
              @update:errMsg="quillErrMsg = $event"
              class="blog-quill"
            ></Quill>
          </div>
          <v-layout>
            <v-combobox
              ref="tags"
              v-model="selectedTags"
              :items="tags"
              :counter="5"
              :rules="[rules.tags, rules.tagsRequired]"
              @change="selectedChange"
              chips
              flat
              clearable
              label="输入相关标签"
              multiple
              prepend-icon="filter_list"
              hide-selected
              solo
              item-text="tagName"
              item-value="tagId"
              auto-select-first
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  @click="select"
                  @click:close="remove(item)"
                  close
                  style="height: 28px;border-radius: 3px"
                  class="my_blue--text"
                  color="rgba(221, 238, 255, 0.5411764705882353)"
                >
                  <span>{{ item.tagName || item }}</span>
                </v-chip>
              </template>
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-btn
                        @click="createTag.dialog = !createTag.dialog"
                        text
                        small
                        color="primary"
                      >
                        点此创建标签
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-layout>
          <v-layout
            :class="
              $route.query.spaceId ? 'justify-space-between' : 'justify-end'
            "
            align-center
          >
            <v-card-text v-if="$route.query.spaceId" class="my_gray--text">
              该文章将被发布至&nbsp;
              <v-chip
                small
                color="private"
                style="color: white;margin-right: 100px; border-radius: 0; position: relative; left: -3px"
                >{{ $route.query.spaceName }}</v-chip
              ></v-card-text
            >
            <v-checkbox
              v-model="isPublic"
              :label="
                ($route.query.spaceId || spaceId
                  ? $route.query.spaceName || '所属空间'
                  : '公共') + '可见'
              "
              :hint="
                '勾选将对' +
                  ($route.query.spaceId || spaceId ? '空间成员' : '所有人') +
                  '可见，不勾选则只对自己可见'
              "
              color="blue"
              class="mr-5 mt-0 pt-0"
              persistent-hint
            ></v-checkbox>
            <v-btn
              :loading="postResult.loading"
              @click="submitBlog"
              color="my_green"
              class="white--text"
              accent
              depressed
              min-width="150px"
              >发布</v-btn
            >
          </v-layout>
        </v-form>
      </v-layout>
    </v-app>
    <v-dialog v-model="createTag.dialog" persistent max-width="600px">
      <v-card>
        <v-card-text class="pt-3">
          <v-form ref="createTagForm">
            <v-text-field
              v-model="newTag.name"
              :rules="[rules.tagName, rules.max20, rules.noSpace]"
              :counter="20"
              label="输入标签名称"
            ></v-text-field>
            <v-text-field
              v-model="newTag.description"
              :rules="[rules.tagDescription]"
              :counter="400"
              label="输入标签描述"
            ></v-text-field>
          </v-form>
          <div v-if="createTag.resp">
            <small v-if="createTag.resp.succeed" class="success--text">{{
              createTag.resp.msg
            }}</small>
            <small v-else class="error--text">{{ createTag.resp.msg }}</small>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="
              createTag.dialog = false
              createTag.resp = null
              newTag.name = null
              newTag.description = null
            "
            text
            >关闭
          </v-btn>
          <v-btn
            :loading="createTag.loading"
            @click="submitCreateTag"
            text
            color="primary"
            >创建
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InfoDialog
      :msg="['发布成功', postResult.resp && postResult.resp.msg]"
      :succeed="postResult.resp != null && postResult.resp.succeed"
      :dialog="postResult.dialog"
      @update:dialog="
        postResult.dialog = $event
        $router.push('/blog/' + postResult.resp.data.blogId)
      "
      close-txt="去查看"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['', '图片过大，上传失败']"
      :succeed="uploadImageResult.succeed"
      :dialog="uploadImageResult.dialog"
      @update:dialog="uploadImageResult.dialog = $event"
      close-txt="关闭"
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import InfoDialog from '../../components/dialog/InfoDialog'
import Quill from '../../components/post/Quill'
export default {
  name: 'Ask',
  components: {
    Quill,
    InfoDialog
  },
  middleware: 'authenticated',
  data: () => ({
    contentCode: '',
    quillErrMsg: null,
    keywords: null,
    title: null,
    spaceId: null,
    maxLength: 16000,
    source: '',
    selectedTags: [],
    tags: [],
    content: '',
    isPublic: true,
    newTag: {
      name: null,
      description: null
    },
    createTag: {
      dialog: false,
      resp: null,
      loading: false
    },
    // 创建结果的提示
    postResult: {
      resp: null,
      dialog: false,
      loading: false
    },
    uploadingImage: [],
    uploadImageResult: {
      dialog: false,
      succeed: true
    },
    rules: {
      min10: (v) => (v && v.length >= 10) || '不能少于10个字符',
      min20: (v) => (v && v.length >= 20) || '不能少于20个字符',
      max100: (v) => (v && v.length <= 100) || '不能超过100个字符',
      max20: (v) => (v && v.length <= 20) || '不能超过20个字符',
      max16000: (v) => (v && v.length <= 16000) || '不能超过16000个字符',
      tags: (v) => (v && v.length <= 5) || '最多选择五个标签哦',
      tagsRequired: (v) => (v && v.length > 0) || '标签不能为空哦',
      tagName: (v) => (v && v.trim().length > 1) || '标签名称必填',
      noSpace: (v) => /^[^\s]*$/.test(v) || "不能使用空格，如需分隔请使用 '-' ",
      tagDescription: (v) =>
        (v && v.length <= 400) || !v || '标签描述不能超过400个字符'
    }
  }),
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    }
  },
  watch: {
    source: 'scrollBottom',
    content() {
      const regex = /data:image\/.*?;base64,(.*?)"/g
      let q = null
      while ((q = regex.exec(this.content)) != null) {
        this.uploadingImage.push({
          data: q[0]
        })
        this.$axios
          .$post('/oss/uploadByBase64', {
            base64: q[1]
          })
          .then((resp) => {
            if (resp.succeed) {
              this.content = this.content.replace(
                this.uploadingImage[0].data,
                resp.data + '"'
              )
            } else {
              this.uploadImageResult.succeed = false
              this.uploadImageResult.dialog = true
            }
            this.uploadingImage.splice(0, 1)
          })
          .catch((e) => {
            this.uploadImageResult.succeed = false
            this.uploadImageResult.dialog = true
            this.uploadingImage.splice(0, 1)
          })
      }
    }
  },
  created() {
    if (!this.$store.getters.getUserInfo.phone) {
      this.$store.commit('setPhoneDialog', true)
    }
    this.loadTags()
    this.loadEditBlog()
  },
  methods: {
    selectedChange() {
      if (this.selectedTags.length > 1) {
        const _lastSelectTag = this.selectedTags[this.selectedTags.length - 1]
        if (!_lastSelectTag.tagId) {
          this.remove(_lastSelectTag)
        }
      }
    },
    loadEditBlog() {
      const blogId = this.$route.query.blogId
      if (!blogId) {
        return
      }
      this.$axios
        .$post('/blogInfo/getBlog', {
          blogId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.title = resp.data.title
            this.source = resp.data.content
            this.content = resp.data.content
            this.selectedTags = resp.data.tagInfos
            this.isPublic = resp.data.isPublic
            this.spaceId = resp.data.spaceId
            const _this = this
            if (process.client) {
              _this.$refs.blogQuill.updateContent(_this.content)
            }
          }
        })
    },
    editBlog(_blogId) {
      this.postResult.loading = true
      this.$axios
        .$post('/blogInfo/editBlog', {
          blogId: _blogId,
          isPublic: this.isPublic,
          title: this.title,
          content: this.$store.getters.getUseMarkdown
            ? this.source
            : this.contentCode,
          tagIds: this.selectedTags
            .map((e) => {
              return e.tagId
            })
            .join(',')
        })
        .then((resp) => {
          this.postResult.resp = resp
          this.postResult.dialog = true
          this.postResult.loading = false
        })
        .catch((e) => {
          this.postResult.loading = false
        })
    },
    submitBlog() {
      if (this.$store.getters.getUseMarkdown) {
        if (!this.$refs.form.validate()) {
          return false
        }
      } else if (!this.$refs.form.validate() || this.quillErrMsg) {
        return false
      }
      if (this.$route.query.blogId) {
        this.editBlog(this.$route.query.blogId)
        return
      }
      this.postResult.loading = true
      const _this = this
      this.$axios
        .$post('/blogInfo/postBlog', {
          spaceId: this.$route.query.spaceId,
          isPublic: this.isPublic,
          title: _this.title,
          content: _this.$store.getters.getUseMarkdown
            ? _this.source
            : _this.contentCode,
          tagIds: _this.selectedTags
            .map((e) => {
              return e.tagId
            })
            .join(',')
        })
        .then((resp) => {
          _this.postResult.resp = resp
          _this.postResult.dialog = true
          _this.postResult.loading = false
        })
        .catch((e) => {
          _this.postResult.loading = false
        })
    },
    submitCreateTag() {
      if (!this.$refs.createTagForm.validate()) {
        return false
      }
      const _this = this
      _this.createTag.loading = true
      this.$axios
        .$post('/tagInfo/insertTag', {
          tagName: this.newTag.name,
          description: this.newTag.description
        })
        .then((resp) => {
          _this.createTag.loading = false
          if (resp.succeed) {
            _this.loadTags()
          }
          _this.createTag.resp = resp
        })
        .catch((e) => {
          _this.createTag.loading = false
        })
    },
    scrollBottom() {
      this.$nextTick(() => {
        const div = document.getElementById('markdown-preview')
        if (div) {
          div.scrollTop = div.scrollHeight
        }
      })
    },
    remove(item) {
      this.selectedTags.splice(this.selectedTags.indexOf(item), 1)
      this.selectedTags = [...this.selectedTags]
    },
    onEditorChange({ editor, html, text }) {
      this.content = html
    },
    //  加载标签
    loadTags() {
      const _this = this
      this.$axios.$get('/tagInfo/listCacheTags').then(function(resp) {
        if (resp.succeed) {
          const _data = resp.data
          for (let i = 0; i < resp.data.length; ++i) {
            _this.tags.push({
              tagName: _data[i].tagName,
              tagId: _data[i].tagId
            })
          }
        }
      })
    }
  },
  beforeRouteLeave(from, to, next) {
    if (['blog-id', 'user-login', 'user-signUp'].includes(from.name)) {
      next()
      return
    }
    if (!this.contentCode || this.contentCode.length < 20) {
      next()
      return
    }
    const r = confirm('确定要离开该页面吗, 您输入的内容将不会被保存')
    if (r) {
      next()
    } else {
      next(false)
    }
  }
}
</script>

<style>
.blog-markdown-preview {
  height: 925px !important;
  overflow: auto;
  padding: 7px;
}
#markdown-edit::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

#markdown-edit::-webkit-scrollbar-track {
  background: #f6f6f6;
}

#markdown-edit::-webkit-scrollbar-thumb {
  background: #aaa;
}

#markdown-edit::-webkit-scrollbar-thumb:hover {
  background: #747474;
}

#markdown-edit::-webkit-scrollbar-corner {
  background: #f6f6f6;
}
/*简约滚动条 end*/
</style>
