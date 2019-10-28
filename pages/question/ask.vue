<template>
  <v-app>
    <v-app>
      <v-layout justify-space-between shrink>
        <v-col cols="6" justify="start">
          <v-btn small text class="my_gray--text"
            >小提示：如需粘贴大段代码，可在&nbsp;
            <a href="https://codeshare.io/" target="_blank"
              ><strong>codeshare</strong></a
            >&nbsp; 中创建后分享至此哦</v-btn
          >
        </v-col>
        <v-col cols="5">
          <v-btn
            text
            nuxt
            class="text-capitalize"
            small
            style="float: right"
            :title="useMarkdown ? '切换富文本编辑器' : '切换markdown编辑器'"
            @click="useMarkdown = !useMarkdown"
            ><v-icon>{{
              useMarkdown ? 'mdi-markdown' : 'mdi-textbox'
            }}</v-icon></v-btn
          >
        </v-col>
      </v-layout>
      <v-layout justify-center>
        <v-form ref="form" style="width: 80vw">
          <v-text-field
            ref="title"
            v-model="title"
            prepend-icon="title"
            hint="简短的描述下你的问题"
            :counter="100"
            label="问题标题"
            required
            :rules="[rules.min10, rules.max100]"
          ></v-text-field>
          <v-layout v-if="useMarkdown" justify-space-around class="mt-1">
            <v-flex xs6>
              <v-textarea
                id="markdown-edit"
                v-model="source"
                no-resize
                counter="10000"
                full-height
                rows="30"
                solo
                :rules="[rules.max10000, rules.min20]"
              ></v-textarea>
            </v-flex>
            <v-flex xs6>
              <div
                id="markdown-preview"
                v-dompurify-html="$md.render(source)"
                class="simple-scroll"
              ></div>
            </v-flex>
          </v-layout>
          <!--富文本编辑器-->
          <div v-if="!useMarkdown" style="height: 597px;">
            <client-only>
              <quill-editor
                ref="myTextEditor"
                v-model="content"
                :options="editorOption"
                class="mt-2"
                @change="onEditorChange($event)"
              >
              </quill-editor>
            </client-only>
            <v-row justify="space-between" class="mr-1 ml-1 mt-2">
              <div class="v-messages v-messages__message error--text">
                {{ quillErrorMessage === true ? '' : quillErrorMessage }}
              </div>
              <div class="v-counter">
                {{ content.length }}&nbsp;/&nbsp;{{ maxLength }}
              </div>
            </v-row>
          </div>
          <v-layout>
            <v-combobox
              ref="tags"
              v-model="selectedTags"
              :items="tags"
              chips
              clearable
              :counter="5"
              label="输入问题的标签"
              multiple
              prepend-icon="filter_list"
              hide-selected
              solo
              item-text="tagName"
              item-value="tagId"
              :rules="[rules.tags, rules.tagsRequired]"
              auto-select-first
              @change="selectedChange"
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="remove(item)"
                >
                  <strong>{{ item.tagName || item }}</strong>
                </v-chip>
              </template>
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-btn
                        text
                        color="success"
                        @click="createTag.dialog = !createTag.dialog"
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
              该问题将被发布至→
              <v-btn
                text
                outlined
                color="private"
                small
                :to="'/space/' + $route.query.spaceId"
                ><strong class="ml-1">{{
                  $route.query.spaceName
                }}</strong></v-btn
              ></v-card-text
            >
            <v-btn
              color="primary"
              accent
              depressed
              min-width="150px"
              :loading="askResult.loading"
              @click="submitQuestion"
              >提交</v-btn
            >
          </v-layout>
        </v-form>
      </v-layout>
    </v-app>
    <v-dialog v-model="createTag.dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">创建标签</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="createTagForm">
            <v-text-field
              v-model="newTag.name"
              label="输入标签名称"
              :rules="[rules.tagName, rules.max20, rules.noSpace]"
              :counter="20"
            ></v-text-field>
            <v-text-field
              v-model="newTag.description"
              label="输入标签描述"
              :rules="[rules.tagDescription]"
              :counter="400"
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
            text
            @click="
              createTag.dialog = false
              createTag.resp = null
              newTag.name = null
              newTag.description = null
            "
            >关闭
          </v-btn>
          <v-btn
            text
            color="primary"
            :loading="createTag.loading"
            @click="submitCreateTag"
            ><strong>创建</strong>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InfoDialog
      :msg="['提交成功', askResult.resp && askResult.resp.msg]"
      :succeed="askResult.resp != null && askResult.resp.succeed"
      :dialog="askResult.dialog"
      close-txt="去查看"
      @update:dialog="
        askResult.dialog = $event
        $router.push('/question/' + askResult.resp.data.questionId)
      "
    >
    </InfoDialog>
    <InfoDialog
      :msg="['', '图片过大，上传失败']"
      :succeed="uploadImageResult.succeed"
      :dialog="uploadImageResult.dialog"
      close-txt="关闭"
      @update:dialog="uploadImageResult.dialog = $event"
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import hljs from 'highlight.js'
import InfoDialog from '../../components/InfoDialog'
export default {
  name: 'Ask',
  components: {
    InfoDialog
  },
  middleware: 'authenticated',
  data: () => ({
    title: null,
    useMarkdown: false,
    maxLength: 10000,
    source:
      '###' +
      '3 第一次使用markdown❓  [右键此处 新标签页打开查看语法说明]( http://www.markdown.cn/)',
    selectedTags: [],
    tags: [],
    content: `试试选中来设置样式, 右上角可切换markdown编辑器哦😄`,
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
    askResult: {
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
      max10000: (v) => (v && v.length <= 10000) || '不能超过10000个字符',
      tags: (v) => (v && v.length <= 5) || '最多选择五个标签哦',
      tagsRequired: (v) => (v && v.length > 0) || '标签不能为空哦',
      tagName: (v) => (v && v.trim().length > 1) || '标签名称必填',
      noSpace: (v) => /^[^\s]*$/.test(v) || "不能使用空格，如需分隔请使用 '-' ",
      tagDescription: (v) =>
        (v && v.length <= 400) || !v || '标签描述不能超过400个字符'
    },
    editorOption: {
      theme: 'bubble',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ],
        syntax: {
          highlight: (text) => hljs.highlightAuto(text).value
        }
      }
    }
  }),
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
    quillErrorMessage() {
      if (this.rules.min20(this.content) !== true) {
        return this.rules.min20(this.content)
      } else {
        return this.rules.max10000(this.content)
      }
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
    this.loadTags()
    this.loadEditQuestion()
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
    contentCode() {
      return this.editor.scrollingContainer.innerHTML
    },
    loadEditQuestion() {
      const questionId = this.$route.query.questionId
      if (!questionId) {
        return
      }
      this.$axios
        .$post('/questionInfo/getQuestion', {
          questionId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.title = resp.data.title
            this.source = resp.data.content
            this.content = resp.data.content
            this.selectedTags = resp.data.tagInfos
          }
        })
    },
    editQuestion(_questionId) {
      this.askResult.loading = true
      this.$axios
        .$post('/questionInfo/editQuestion', {
          questionId: _questionId,
          title: this.title,
          content: this.useMarkdown ? this.source : this.contentCode(),
          tagIds: this.selectedTags
            .map((e) => {
              return e.tagId
            })
            .join(',')
        })
        .then((resp) => {
          this.askResult.resp = resp
          this.askResult.dialog = true
          this.askResult.loading = false
        })
        .catch((e) => {
          this.askResult.loading = false
        })
    },
    submitQuestion() {
      if (this.useMarkdown) {
        if (!this.$refs.form.validate()) {
          return false
        }
      } else if (
        !this.$refs.form.validate() ||
        this.quillErrorMessage !== true
      ) {
        return false
      }
      if (this.$route.query.questionId) {
        this.editQuestion(this.$route.query.questionId)
        return
      }
      this.askResult.loading = true
      const _this = this
      this.$axios
        .$post('/questionInfo/askQuestion', {
          spaceId: this.$route.query.spaceId,
          title: _this.title,
          content: _this.useMarkdown ? _this.source : _this.contentCode(),
          tagIds: _this.selectedTags
            .map((e) => {
              return e.tagId
            })
            .join(',')
        })
        .then((resp) => {
          _this.askResult.resp = resp
          _this.askResult.dialog = true
          _this.askResult.loading = false
        })
        .catch((e) => {
          _this.askResult.loading = false
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
        div.scrollTop = div.scrollHeight
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
  }
}
</script>

<style>
#markdown-preview {
  height: 567px;
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
<!--quill editor-->
<style lang="scss" scoped>
.quill-editor,
.quill-code {
  height: 40rem;
}
.ql-editor > pre {
}
.ql-editor pre.ql-syntax {
  font-family: Consolas, serif;
  font-weight: bold;
}

.quill-editor {
  height: 563px;
}
.theme--dark .quill-editor {
  color: white;
  background-color: #424242;
}
.theme--light .quill-editor {
  background-color: white;
}

.quill-code {
  border: none;
  height: auto;

  > code {
    width: 100%;
    margin: 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0;
    height: 10rem;
    overflow-y: auto;
  }
}
</style>
