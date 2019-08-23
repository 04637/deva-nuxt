<template>
  <v-app>
    <v-container id="root" justify-center align-start>
      <v-layout justify-end>
        <v-col cols="3">
          <v-btn to="find">提问之前，不妨先搜索一下？</v-btn>
        </v-col>
        <v-col cols="5">
          <v-btn
            text
            nuxt
            class="text-capitalize"
            style="float: right"
            @click="useMarkdown = !useMarkdown"
            ><v-icon small>arrow_forward_ios</v-icon>&nbsp;{{
              useMarkdown ? '富文本编辑器' : 'Markdown 编辑器'
            }}</v-btn
          >
        </v-col>
      </v-layout>
      <v-layout justify-center>
        <v-form ref="form" style="width: 80vw">
          <v-text-field
            ref="title"
            v-model="title"
            autofocus
            prepend-icon="title"
            hint="简短的描述下你的问题"
            :counter="50"
            label="问题标题"
            required
            :rules="[rules.min10, rules.max50]"
          ></v-text-field>
          <v-layout v-show="useMarkdown" justify-space-around class="mt-2">
            <v-flex xs6>
              <v-textarea
                id="markdown-edit"
                v-model="source"
                no-resize
                outlined
                counter="3000"
                full-height
                rows="30"
                :rules="[rules.max3000, rules.min20]"
              ></v-textarea>
            </v-flex>
            <v-flex xs6>
              <div
                id="markdown-preview"
                class="simple-scroll"
                v-html="$md.render(source)"
              ></div>
            </v-flex>
          </v-layout>
          <!--富文本编辑器-->
          <div v-show="!useMarkdown" style="height: 597px;">
            <quill-editor
              ref="myTextEditor"
              v-model="content"
              :options="editorOption"
              class="mt-2"
              style="border-radius: 5px"
              @change="onEditorChange($event)"
            >
            </quill-editor>
            <v-row justify="space-between" class="mt-1 mr-1 ml-1">
              <div class="v-messages v-messages__message error--text">
                {{ quillErrorMessage === true ? '' : quillErrorMessage }}
              </div>
              <div
                class="v-counter"
                :class="
                  content.length > maxLength
                    ? 'error--text'
                    : $vuetify.theme.dark
                    ? 'theme--dark'
                    : 'theme--light'
                "
              >
                {{ content.length }}&nbsp;/&nbsp;{{ maxLength }}
              </div>
            </v-row>
          </div>
          <v-layout class="mt-5">
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
                        @click="createTagDialog = !createTagDialog"
                      >
                        点此创建标签
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-layout>
          <v-layout justify-end>
            <v-btn
              outlined
              accent
              depressed
              min-width="150px"
              @click="submitQuestion"
              >提交</v-btn
            >
          </v-layout>
        </v-form>
      </v-layout>
    </v-container>
    <v-dialog v-model="createTagDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">创建标签</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="createTagForm">
            <v-text-field
              v-model="newTagName"
              label="输入标签名称"
              :rules="[rules.tagName]"
              autofocus
            ></v-text-field>
            <v-text-field
              v-model="newTagDescription"
              label="输入标签描述"
              :rules="[rules.tagDescription]"
              :counter="100"
            ></v-text-field>
          </v-form>
          <div v-if="createTagResp">
            <small v-if="createTagResp.succeed" class="success--text">{{
              createTagResp.msg
            }}</small>
            <small v-else class="error--text">{{ createTagResp.msg }}</small>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              createTagDialog = false
              createTagResp = null
              newTagName = null
              newTagDescription = null
            "
            >关闭
          </v-btn>
          <v-btn
            text
            color="primary"
            :loading="createTagLoading"
            @click="createTag"
            >创建
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import hljs from 'highlight.js'

export default {
  name: 'Ask',
  data: () => ({
    title: null,
    useMarkdown: true,
    maxLength: 3000,
    source: '# h1 Heading 8-)',
    selectedTags: [],
    newTagName: null,
    newTagDescription: null,
    createTagLoading: false,
    createTagResp: null,
    rules: {
      min10: (v) => (v && v.length >= 10) || '不能少于10个字符',
      min20: (v) => (v && v.length >= 10) || '不能少于10个字符',
      max50: (v) => (v && v.length <= 50) || '不能超过50个字符',
      max3000: (v) => (v && v.length <= 3000) || '不能超过3000个字符',
      tags: (v) => (v && v.length <= 5) || '最多选择五个标签哦',
      tagsRequired: (v) => (v && v.length > 0) || '标签不能为空哦',
      tagName: (v) => (v && v.trim().length > 1) || '标签名称必填',
      tagDescription: (v) =>
        (v && v.length <= 100) || !v || '标签描述不能超过100个字符'
    },
    createTagDialog: false,
    tags: [],
    content: `<h1>试试选中来设置样式哦 😜 </h1>`,
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
    contentCode() {
      return hljs.highlightAuto(this.content).value
    },
    quillErrorMessage() {
      if (this.rules.min20(this.content)) {
        return this.rules.max3000(this.content)
      } else {
        return this.rules.min20(this.content)
      }
    }
  },
  watch: {
    source: 'scrollBottom'
  },
  mounted() {},
  created() {
    this.loadTags()
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
    submitQuestion() {
      if (this.useMarkdown) {
        if (!this.$refs.form.validate()) {
          return false
        }
      } else if (
        !this.$refs.title.validate() ||
        !this.ref.tags.validate() ||
        this.quillErrorMessage()
      ) {
        return false
      }
      const _this = this
      this.$axios
        .$post('/questionInfo/askQuestion', {
          title: _this.title,
          content: _this.useMarkdown ? _this.source : _this.content,
          tagInfos: JSON.stringify(_this.selectedTags)
        })
        .then((resp) => {
          console.log(resp)
        })
    },
    createTag() {
      if (!this.$refs.createTagForm.validate()) {
        return false
      }
      const _this = this
      _this.createTagLoding = true
      this.$axios
        .$post('/tagInfo/insertTag', {
          tagName: this.newTagName,
          description: this.newTagDescription
        })
        .then((resp) => {
          _this.createTagLoading = false
          if (resp.succeed) {
            _this.loadTags()
          }
          _this.createTagResp = resp
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
      // console.log('editor change!', editor, html, text)
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
  border: 1px solid rgb(192, 192, 192);
  border-left: none;
  height: 567px;
  overflow: auto;
  padding: 7px;
  border-radius: 5px;
}

#markdown-edit::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

#markdown-edit::-webkit-scrollbar-track {
  background: #f6f6f6;
  border-radius: 2px;
}

#markdown-edit::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 2px;
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
  border: 1px solid #ccc;
  height: 567px;
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
