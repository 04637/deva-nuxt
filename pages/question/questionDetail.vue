<template>
  <v-app id="home">
    <v-container align-center justify-center>
      <v-layout column>
        <v-card-title>问题标题快乐快乐</v-card-title>
        <v-divider></v-divider>
      </v-layout>
      <v-layout justify-center justify-space-around>
        <v-flex xs11 lg9 justify-start class="mt-4">
          <v-list>
            <v-list-item>
              <v-card flat exact width="100vw">
                <v-layout justify-space-between>
                  <v-flex xs1 class="mt-12" align-center>
                    <v-layout column align-center>
                      <v-btn icon>
                        <v-icon size="80">arrow_drop_up</v-icon>
                      </v-btn>
                      <strong>47</strong>
                      <v-btn icon>
                        <v-icon size="80">arrow_drop_down</v-icon>
                      </v-btn>
                      <v-btn icon>
                        <!--<v-tooltip bottom>-->
                        <!--  <template v-slot:activator="{ on }">-->
                        <!--    <v-icon size="40" dark v-on="on">favorite_border</v-icon>-->
                        <!--  </template>-->
                        <!--  <span>Oh! I like it!</span>-->
                        <!--</v-tooltip>-->
                        <v-icon size="40">favorite_border</v-icon>
                      </v-btn>
                    </v-layout>
                  </v-flex>
                  <v-flex xs11 class="ml-4">
                    <v-layout justify-end>
                      <v-dialog v-model="dialog" persistent max-width="600px">
                        <template v-slot:activator="{ on }">
                          <v-btn text color="pink" v-on="on"
                            >问题重复？标记相似</v-btn
                          >
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="headline">相似标记</span>
                          </v-card-title>
                          <v-card-text>
                            <v-text-field
                              label="输入相似问题的链接"
                            ></v-text-field>
                            <small
                              >合理的标记可以帮助小伙伴们寻找答案，提升自己的声望。同时滥用标记，关联无关问题也将受到惩罚哦!</small
                            >
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog = false"
                              >关闭</v-btn
                            >
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="dialog = false"
                              >确定</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-layout>
                    <vue-markdown :source="source"></vue-markdown>
                    <!--color="cyan"  知更鸟蓝-->
                    <v-layout align-center>
                      <v-alert
                        v-model="alert"
                        dense
                        border="left"
                        elevation="1"
                        colored-border
                        color="orange"
                        width="100vw"
                      >
                        <v-layout justify-space-between>
                          <v-flex xs9>
                            该问题已有相似问题:
                            <router-link to="questionDetail"
                              >大家好我是旺旺旺</router-link
                            >
                          </v-flex>
                          <v-layout justify-end xs3>
                            --&nbsp;
                            <router-link to="userProfile"
                              >别叫我小海绵</router-link
                            >
                          </v-layout>
                        </v-layout>
                      </v-alert>
                      <v-btn class="mb-4" icon>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon color="orange" dark v-on="on"
                              >report</v-icon
                            >
                          </template>
                          <span>举报滥用</span>
                        </v-tooltip>
                      </v-btn>
                    </v-layout>
                    <v-card-actions>
                      <v-layout>
                        <v-chip link to="" class="question-tag">java</v-chip>
                        <v-chip link to="" class="question-tag">C++</v-chip>
                      </v-layout>
                      <v-layout justify-end>
                        <v-card class="px-8 pt-3 pb-1">
                          <v-layout justify-space-between>
                            <v-flex xs3>
                              <v-layout justify-center>
                                <v-avatar color="grey">
                                  <v-img
                                    src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                                  ></v-img>
                                </v-avatar>
                              </v-layout>
                              <v-layout justify-center class="mt-2">
                                <span class="subtitle-2 text-no-wrap"
                                  >别叫我小海绵</span
                                >
                              </v-layout>
                            </v-flex>
                            <v-flex xs8>
                              <v-layout column>
                                <v-card-text>
                                  提问于13天前
                                </v-card-text>
                                <v-layout justify-end align-end>
                                  <svg
                                    class="icon heat-icon"
                                    aria-hidden="true"
                                  >
                                    <use xlink:href="#icon-zuanshi"></use></svg
                                  >&nbsp;100
                                </v-layout>
                              </v-layout>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-layout>
                    </v-card-actions>
                    <!-- 评论区 -->
                    <v-divider></v-divider>
                    <v-layout justify-center column class="mt-2">
                      <v-layout justify-end>
                        <v-btn text>添加评论</v-btn>
                      </v-layout>
                      <v-layout>
                        <v-list width="100vw">
                          <v-list-item>
                            <v-layout justify-space-between>
                              <v-flex xs10>我是第一条评论</v-flex>
                              <v-flex xs2
                                >--
                                <router-link to="userProfile"
                                  >别叫我小海绵</router-link
                                ></v-flex
                              >
                            </v-layout>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item>
                            <v-layout justify-space-between>
                              <v-flex xs10>我是第一条评论</v-flex>
                              <v-flex xs2
                                >--
                                <router-link to="userProfile"
                                  >别叫我小海绵</router-link
                                ></v-flex
                              >
                            </v-layout>
                          </v-list-item>
                          <v-divider></v-divider>
                        </v-list>
                      </v-layout>
                      <v-layout justify-center>
                        <v-btn icon small title="查看更多评论"
                          ><v-icon>expand_more</v-icon></v-btn
                        >
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="mt-1">
              <v-card flat exact width="100vw">
                <v-layout justify-space-between>
                  <v-flex xs1 class="mt-12" align-center>
                    <v-layout column align-center>
                      <v-btn icon>
                        <v-icon size="80">arrow_drop_up</v-icon>
                      </v-btn>
                      <strong>47</strong>
                      <v-btn icon>
                        <v-icon size="80">arrow_drop_down</v-icon>
                      </v-btn>
                      <v-btn icon color="green">
                        <v-icon size="40">check</v-icon>
                      </v-btn>
                    </v-layout>
                  </v-flex>
                  <v-flex xs11 class="ml-4">
                    <v-layout justify-end>
                      <v-btn color="success" text
                        ><v-icon>check</v-icon>采纳</v-btn
                      >
                      <!--<v-btn color="gray" icon>-->
                      <!--  <v-tooltip bottom>-->
                      <!--    <template v-slot:activator="{ on }">-->
                      <!--      <v-icon size="30" dark v-on="on">check</v-icon>-->
                      <!--    </template>-->
                      <!--    <span>采纳该回答</span>-->
                      <!--  </v-tooltip>-->
                      <!--</v-btn>-->
                    </v-layout>
                    <vue-markdown :source="source"></vue-markdown>
                    <v-card-actions>
                      <v-layout justify-end>
                        <v-card class="px-8 pt-3 pb-1">
                          <v-layout justify-space-between>
                            <v-flex xs3>
                              <v-layout justify-center>
                                <v-avatar color="grey">
                                  <v-img
                                    src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                                  ></v-img>
                                </v-avatar>
                              </v-layout>
                              <v-layout justify-center class="mt-2">
                                <span class="subtitle-2 text-no-wrap"
                                  >别叫我小海绵</span
                                >
                              </v-layout>
                            </v-flex>
                            <v-flex xs8>
                              <v-layout column>
                                <v-card-text>
                                  回答于13天前
                                </v-card-text>
                                <v-layout justify-end align-end>
                                  <svg
                                    class="icon heat-icon"
                                    aria-hidden="true"
                                  >
                                    <use xlink:href="#icon-zuanshi"></use></svg
                                  >&nbsp;100
                                </v-layout>
                              </v-layout>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-layout>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
        </v-flex>
        <v-flex fill-height xs1 lg2 justify-end shrink class="mt-4">
          <v-list>
            <v-list-item>
              <v-card>
                圣诞快乐放假了看电视的附件上课了
              </v-card>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-card>
                圣诞快乐放假了看电视的附件上课了
              </v-card>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-card>
                圣诞快乐放假了看电视的附件上课了
              </v-card>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-card>
                圣诞快乐放假了看电视的附件上课了
              </v-card>
            </v-list-item>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'Home',
  components: {
    VueMarkdown
  },
  data: () => ({
    alert: true,
    dialog: false,
    source:
      '[id]: dist/img/minion.png  "The Dojocat"\n' +
      '\n' +
      '\n' +
      '### Emojies\n' +
      '\n' +
      '> Classic markup: :wink: :cry: :laughing: :yum:\n' +
      '>\n' +
      '> Shortcuts (emoticons): :-) :-( 8-) ;)\n' +
      '\n' +
      '\n' +
      '### Subscript / Superscript\n' +
      '\n' +
      '- 19^th^\n' +
      '- H~2~O\n' +
      '\n' +
      '\n' +
      '### \\<ins>\n' +
      '\n' +
      '++Inserted text++\n' +
      '\n' +
      '\n' +
      '### \\<mark>\n' +
      '\n' +
      '==Marked text==\n' +
      '\n' +
      '\n' +
      '### Footnotes\n' +
      '\n' +
      'Footnote 1 link[^first].\n' +
      '\n' +
      'Footnote 2 link[^second].\n' +
      '\n' +
      'Inline footnote^[Text of inline footnote] definition.\n' +
      '\n' +
      'Duplicated footnote reference[^second].\n' +
      '\n' +
      '[^first]: Footnote **can have markup**\n' +
      '\n' +
      '    and multiple paragraphs.\n' +
      '\n' +
      '[^second]: Footnote text.\n' +
      '\n' +
      '\n'
  })
  // ssr渲染参考
  // async asyncData({ $axios }) {
  //   const resp = await $axios.$post('/questionInfo/listQuestions', {
  //     current: 1,
  //     size: 15,
  //     listType: 'RECENT'
  //   })
  //   const questionList = resp.data.records
  //   return { questionList }
  // },
}
</script>
<style scoped>
.question-tag {
  margin-right: 13px;
}
</style>
