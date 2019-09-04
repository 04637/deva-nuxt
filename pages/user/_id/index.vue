<template>
  <v-container v-if="userProfile" justify-center align-start>
    <v-layout column>
      <v-layout>
        <v-card-title>
          用户档案
          <v-btn class="ml-5" text to="editProfile">
            点此编辑
            <v-icon class="ml-2">edit</v-icon>
          </v-btn>
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center>
      <v-flex hidden-sm-and-down md3 lg4>
        <v-card class="pa-4">
          <v-layout justify-space-between>
            <v-flex align-center xs7 hidden-md-and-down>
              <v-layout justify-center>
                <v-avatar color="grey" size="200" tile right>
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                  ></v-img>
                </v-avatar>
              </v-layout>
              <v-layout class="mt-2" justify-center>
                <v-card-title>{{
                  userProfile.nickname || userProfile.username
                }}</v-card-title>
              </v-layout>
              <v-layout class="mt-2">
                <v-divider></v-divider>
              </v-layout>
              <v-layout justify-center>
                <v-card-text>{{ userProfile.bio }}</v-card-text>
              </v-layout>
              <v-layout justify-center>
                <v-icon class="mr-2">email</v-icon>
                {{ userProfile.email }}
              </v-layout>
            </v-flex>
            <v-flex lg4 md12>
              <v-card flat>
                <v-card-text
                  >提问: &nbsp;&nbsp;{{
                    userProfile.questions.length
                  }}</v-card-text
                >
                <v-card-text
                  >回答: &nbsp;&nbsp;{{
                    userProfile.answers.length
                  }}</v-card-text
                >
                <v-card-text
                  >采纳率: &nbsp;&nbsp;{{
                    userProfile.adoptionRate
                  }}&nbsp;%</v-card-text
                >
                <v-card-text
                  >关注者: &nbsp;&nbsp;{{
                    userProfile.followers.length
                  }}</v-card-text
                >
                <v-card-text
                  >声望: &nbsp;&nbsp;{{ userProfile.reputation }}</v-card-text
                >
              </v-card>
              <v-layout justify-start class="mt-5">
                <v-btn text icon color="pink">
                  <v-icon>favorite</v-icon>
                </v-btn>
                <v-card-text class="pa-2">← 关注他</v-card-text>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex lg7 md8>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab>
            提问
          </v-tab>
          <v-tab>
            回答
          </v-tab>
          <v-tab>
            收藏
          </v-tab>
          <v-tab>
            标签
          </v-tab>
          <v-tab>
            空间
          </v-tab>
          <v-tab>
            关注
          </v-tab>
          <v-tab>
            粉丝
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <!-- ask tab -->
          <v-tab-item>
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="askTab.search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="askTab.headers"
                :items="askTab.items"
                :search="askTab.search"
              >
                <template #item.title="{item}">
                  <router-link :to="'/question/' + item.questionId">{{
                    item.title
                  }}</router-link>
                </template>
                <template #item.status="{item}">
                  <v-icon
                    v-if="item.status === 1"
                    color="success"
                    title="已解决"
                    >done</v-icon
                  >
                  <v-icon v-else color="error" title="待解决">minimize</v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- answer tab -->
          <v-tab-item>
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="answerTab.search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="answerTab.headers"
                :items="answerTab.items"
                :search="answerTab.search"
              >
                <template #item.questionTitle="{item}">
                  <router-link :to="'/question/' + item.ownQuestionId">{{
                    item.questionTitle
                  }}</router-link>
                </template>
                <template #item.isAccepted="{item}">
                  <v-icon v-if="item.isAccepted" color="success" title="已采纳"
                    >check</v-icon
                  >
                  <v-icon v-else color="error" title="未采纳">close</v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- collect tab -->
          <v-tab-item>
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="collectTab.search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="collectTab.headers"
                :items="collectTab.items"
                :search="collectTab.search"
              >
                <template #item.title="{item}">
                  <router-link to="questionDetail">{{
                    item.title
                  }}</router-link>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- tag tab -->
          <v-tab-item>
            <v-layout wrap>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
              <v-btn class="pa-1 px-8 mt-2 mr-2" to="userProfile">
                <v-card-text>JAVA × 937</v-card-text>
              </v-btn>
            </v-layout>
          </v-tab-item>
          <!-- space tab -->
          <v-tab-item>
            <v-layout wrap class="px-3">
              <v-card class="pa-1 px-5 mt-2 mr-2" to="userProfile">
                <v-layout>
                  <strong class="subtitle-2">私密空间哦</strong>
                </v-layout>
                <v-layout justify-space-around column>
                  <v-layout>
                    <v-card-text class="d-inline-block text-truncate"
                      >空间描述空间描述</v-card-text
                    >
                  </v-layout>
                  <v-layout justify-end align-end>
                    <v-icon>group</v-icon>&nbsp;100
                  </v-layout>
                </v-layout>
              </v-card>
            </v-layout>
          </v-tab-item>
          <!-- watch tab -->
          <v-tab-item>
            <v-layout wrap class="px-3">
              <v-card class="pa-1 px-5 mt-2 mr-3">
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
                      <span class="subtitle-2 text-no-wrap">别叫我小海绵</span>
                    </v-layout>
                  </v-flex>
                  <v-flex xs8>
                    <v-layout justify-space-between column fill-height>
                      <v-layout>
                        <v-card-text class="pa-0"
                          >该用户太懒什么也没留下</v-card-text
                        >
                      </v-layout>
                      <v-layout justify-end align-end>
                        <svg class="icon heat-icon" aria-hidden="true">
                          <use xlink:href="#icon-zuanshi"></use></svg
                        >&nbsp;100
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-card class="pa-1 px-5 mt-2 mr-3">
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
                      <span class="subtitle-2 text-no-wrap">别叫我小海绵</span>
                    </v-layout>
                  </v-flex>
                  <v-flex xs8>
                    <v-layout justify-space-between fill-height column>
                      <v-layout>
                        <v-card-text class="pa-0"
                          >该用户太懒什么也没留下</v-card-text
                        >
                      </v-layout>
                      <v-layout justify-end align-end>
                        <svg class="icon heat-icon" aria-hidden="true">
                          <use xlink:href="#icon-zuanshi"></use></svg
                        >&nbsp;100
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-layout>
          </v-tab-item>
          <!-- follower tab -->
          <v-tab-item>
            <v-layout wrap class="px-3">
              <v-card class="pa-1 px-5 mt-2 mr-3">
                <v-layout justify-space-between>
                  <v-flex xs3>
                    <v-layout justify-center>
                      <v-avatar color="grey" class="white--text">
                        <v-img
                          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        >
                        </v-img>
                      </v-avatar>
                    </v-layout>
                    <v-layout justify-center class="mt-2">
                      <span class="subtitle-2 text-no-wrap">别叫我小海绵</span>
                    </v-layout>
                  </v-flex>
                  <v-flex xs8>
                    <v-layout justify-space-between column fill-height>
                      <v-layout>
                        <v-card-text class="pa-0"
                          >该用户太懒什么也没留下</v-card-text
                        >
                      </v-layout>
                      <v-layout justify-end align-end>
                        <svg class="icon heat-icon" aria-hidden="true">
                          <use xlink:href="#icon-zuanshi"></use></svg
                        >&nbsp;100
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-layout>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    tab: null,
    userProfile: null,
    // 提问tab
    askTab: {
      search: '',
      headers: [
        {
          text: '标题',
          sortable: false,
          align: 'left',
          value: 'title'
        },
        { text: '回答', value: 'answerNum' },
        { text: '赞成', value: 'voteNum' },
        { text: '状态', value: 'status', sortable: false }
      ],
      items: []
    },
    //  回答tab
    answerTab: {
      search: '',
      headers: [
        {
          text: '问题标题',
          align: 'left',
          sortable: false,
          value: 'questionTitle'
        },
        {
          text: '回答内容',
          align: 'left',
          sortable: false,
          value: 'content'
        },
        { text: '状态', value: 'isAccepted', sortable: false }
      ],
      items: []
    },
    // 收藏tab
    collectTab: {
      search: '',
      headers: [
        {
          text: '标题',
          sortable: false,
          align: 'left',
          value: 'title'
        },
        { text: '状态', value: 'status' },
        { text: '回答', value: 'answerNum' },
        { text: '支持', value: 'voteNum' },
        { text: '收藏', value: 'collectNum' },
        { text: '浏览', value: 'viewNum' }
      ],
      items: [
        {
          title: '你好世界1你好世界1你好世界1你好世界1',
          status: '已解决',
          answerNum: 43,
          voteNum: 13,
          collectNum: 52,
          viewNum: 24
        },
        {
          title: '你好世界1',
          status: '已解决',
          answerNum: 11,
          voteNum: 23,
          collectNum: 90,
          viewNum: 12
        },
        {
          title: '你好世界1',
          status: '已解决',
          answerNum: 21,
          voteNum: 78,
          collectNum: 32,
          viewNum: 44
        }
      ]
    }
  }),
  created() {
    this.loadUserProfile()
  },
  methods: {
    loadUserProfile() {
      this.$axios
        .$post('userInfo/getUserProfile', {
          userId: this.$route.params.id
        })
        .then((resp) => {
          if (resp.succeed) {
            console.log(resp)
            this.userProfile = resp.data
            this.askTab.items = this.userProfile.questions
            this.answerTab.items = this.userProfile.answers
          }
        })
    }
  }
}
</script>
<style scoped></style>
