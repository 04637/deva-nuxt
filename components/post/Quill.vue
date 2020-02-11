<template>
  <client-only>
    <div>
      <quill-editor
        id="quill"
        ref="myTextEditor"
        v-model="myContent"
        :options="editorOption"
        class="mt-2"
      >
      </quill-editor>
      <v-row justify="space-between" class="mr-1 ml-1 mt-2">
        <div class="v-messages v-messages__message error--text">
          {{ quillErrorMessage }}
        </div>
        <div class="v-counter">
          {{ myContent.length }}&nbsp;/&nbsp;{{ max }}
        </div>
      </v-row>
      <InfoDialog
        :msg="['', '图片过大，请选择10M以下的图片']"
        :succeed="uploadImageResult.succeed"
        :dialog="uploadImageResult.dialog"
        close-txt="关闭"
        @update:dialog="uploadImageResult.dialog = $event"
      >
      </InfoDialog>
    </div>
  </client-only>
</template>
<script>
import InfoDialog from '../dialog/InfoDialog'
import hljs from '../../assets/js/my-highlight'

export default {
  components: { InfoDialog },
  props: {
    content: {
      required: false,
      default: '',
      type: String
    },
    max: {
      required: true,
      type: Number
    },
    min: {
      required: true,
      type: Number
    }
  },
  data: () => ({
    myContent: '',
    editorOption: {
      placeholder: '在此输入内容',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean']
        ],
        syntax: {
          highlight: (text) => hljs.highlightAuto(text).value
        },
        imageDrop: true
      }
    },
    uploadingImage: [],
    uploadImageResult: {
      dialog: false,
      succeed: true
    }
  }),
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
    quillErrorMessage() {
      let msg = null
      if (this.myContent.length < this.min) {
        msg = '不能少于' + this.min + '个字符'
      } else if (this.myContent.length > this.max) {
        msg = '不能超过' + this.max + '个字符'
      }
      this.$emit('update:errMsg', msg)
      return msg
    }
  },
  watch: {
    myContent() {
      this.checkPhone()
      const regex = /data:image\/.*?;base64,(.*?)"/g
      let q = null
      while ((q = regex.exec(this.myContent)) != null) {
        this.uploadingImage.push({
          data: q[0]
        })
        this.$axios
          .$post('/oss/uploadByBase64', {
            base64: q[1]
          })
          .then((resp) => {
            if (resp.succeed) {
              this.myContent = this.myContent.replace(
                this.uploadingImage[0].data,
                resp.data + '"'
              )
              this.editor.scrollingContainer.innerHTML = this.editor.scrollingContainer.innerHTML.replace(
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
      let _contentCode = this.editor.scrollingContainer.innerHTML
      if (_contentCode === '<p><br></p>') {
        _contentCode = this.myContent
      }
      this.$emit('update:contentCode', _contentCode)
    }
  },
  mounted() {
    setTimeout(() => {
      this.myContent = this.content
    }, 100)
  },
  methods: {
    checkPhone() {
      if (this.$store.getters.getUserId && !this.$store.getters.getUserPhone) {
        this.$store.commit('setPhoneDialog', true)
        return false
      }
    },
    updateContent(_content) {
      this.myContent = _content
    }
  }
}
</script>
<style>
.theme--dark .ql-snow .ql-stroke {
  stroke: white !important;
}
.theme--dark .ql-snow .ql-fill {
  fill: white !important;
}
.theme--dark .ql-snow .ql-picker {
  color: white;
}
.ql-container {
  height: calc(100% - 40px);
}
.theme--dark .ql-editor.ql-blank::before {
  color: #d3d3d3;
}
/*:empty:before {*/
/*  content: attr(data-placeholder);*/
/*  color: red !important;*/
/*}*/
</style>
<!--quill editor-->
<style lang="scss" scoped>
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
  word-break: break-word;
}
.answer-quill .quill-editor {
  height: 348px;
}
.blog-quill .quill-editor {
  height: 915px;
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
