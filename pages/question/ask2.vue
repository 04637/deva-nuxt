<template>
  <v-container justify-center fluid align-start>
    <v-form ref="form" style="width: 70vw">
      <v-text-field
        hint="简短的描述下你的问题"
        :counter="50"
        label="点此输入标题"
        required
      ></v-text-field>
      <!--<div class="md-subhead">-->
      <!--  <span></span>-->
      <!--</div>-->
      <!-- quill-editor -->
      <quill-editor
        ref="myTextEditor"
        v-model="content"
        :options="editorOption"
        @change="onEditorChange($event)"
      >
      </quill-editor>
      <!--<div class="quill-code">-->
      <!--  <code class="hljs" v-html="contentCode"></code>-->
      <!--</div>-->
    </v-form>
  </v-container>
</template>
<script>
import hljs from 'highlight.js'

export default {
  name: 'Ask',
  data() {
    return {
      text: '',
      name: '',
      content: `<strong>试试选中来设置样式哦</strong>`,
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
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    },
    contentCode() {
      return hljs.highlightAuto(this.content).value
    }
  },
  mounted() {},
  methods: {
    onEditorChange({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      this.content = html
    }
  }
}
</script>

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
