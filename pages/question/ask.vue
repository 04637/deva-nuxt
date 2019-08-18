<template>
  <v-container justify-center align-start>
    <v-layout justify-center>
      <v-btn to="find">提问之前，不妨先搜索一下？</v-btn>
    </v-layout>
    <v-layout justify-center>
      <v-form ref="form" style="width: 80vw">
        <v-text-field
          prepend-icon="title"
          hint="简短的描述下你的问题"
          :counter="50"
          label="问题标题"
          required
        ></v-text-field>
        <v-layout justify-space-around style="margin-top: 20px;">
          <v-flex xs6>
            <v-textarea
              id="markdown-edit"
              v-model="source"
              no-resize
              outlined
              counter="3000"
              full-height
              rows="30"
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
        <v-layout style="margin-top: 10px;">
          <v-combobox
            v-model="chips"
            :items="items"
            chips
            clearable
            label="输入问题的标签"
            multiple
            prepend-icon="filter_list"
            solo
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="remove(item)"
              >
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
        </v-layout>
        <v-layout justify-end>
          <v-btn outlined accent depressed min-width="150px">提交</v-btn>
        </v-layout>
      </v-form>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'Ask',
  data() {
    return {
      source: '# h1 Heading 8-)',
      chips: [
        'Programming',
        'Playing video games',
        'Watching movies',
        'Sleeping'
      ],
      items: ['Streaming', 'Eating']
    }
  },
  watch: {
    source: 'scrollBottom'
  },
  mounted() {},
  methods: {
    scrollBottom() {
      this.$nextTick(() => {
        const div = document.getElementById('markdown-preview')
        div.scrollTop = div.scrollHeight
      })
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
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
  border-radius: 7px;
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
