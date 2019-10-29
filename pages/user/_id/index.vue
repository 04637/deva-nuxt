<template>
  <v-layout v-if="userProfile" column justify-center>
    <v-layout column>
      <v-layout>
        <v-card-title>
          <v-row align="end">
            用户档案
            <v-btn
              v-if="userProfile.userId === $store.getters.getUserId"
              class="ml-5"
              text
              small
              to="editProfile"
              color="private"
            >
              <span>点此编辑</span>
              <v-icon class="ml-2" small>edit</v-icon>
            </v-btn>
          </v-row>
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
                  <v-img :src="userProfile.avatar"></v-img>
                </v-avatar>
              </v-layout>
              <v-layout class="mt-2" justify-center>
                <v-card-title style="align-items: baseline"
                  >{{ userProfile.nickname || userProfile.username }}&nbsp;<span
                    title="用户名"
                    class="my_gray--text"
                    style="font-size: 1rem"
                    >({{ userProfile.username }})</span
                  ></v-card-title
                >
              </v-layout>
              <v-layout class="mt-2">
                <v-divider></v-divider>
              </v-layout>
              <v-layout justify-center>
                <v-card-text>{{ userProfile.bio }}</v-card-text>
              </v-layout>
              <!--<v-layout justify-center>-->
              <!--  <v-icon class="mr-2">email</v-icon>-->
              <!--  {{ userProfile.email }}-->
              <!--</v-layout>-->
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
                  }}%</v-card-text
                >
                <v-card-text
                  >粉丝: &nbsp;&nbsp;{{
                    userProfile.followers.length
                  }}</v-card-text
                >
                <v-card-text
                  >声望: &nbsp;&nbsp;{{ userProfile.reputation }}</v-card-text
                >
              </v-card>
              <v-layout justify-center class="mt-2">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-show="isFollowed"
                      text
                      icon
                      :color="isFollowed ? 'pink' : ''"
                      v-on="on"
                      @click="unWatchUser"
                    >
                      <v-icon>favorite</v-icon>
                    </v-btn>
                  </template>
                  <span>取消关注</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-if="userProfile.userId !== $store.getters.getUserId"
                      v-show="!isFollowed"
                      text
                      icon
                      :color="isFollowed ? 'pink' : ''"
                      @click="followUser"
                    >
                      <v-icon>favorite</v-icon>
                    </v-btn>
                  </template>
                  <span>关注他/她</span>
                </v-tooltip>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout wrap class="mt-2">
            <div v-for="tag in likeTagList" :key="tag.tagId" class="mr-2 mb-2">
              <TagChip :tag-info="tag"></TagChip>
            </div>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex lg7 md8 sm12 class="ml-8">
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
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="askTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                locale="zh-Hans"
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
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="answerTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="answerTab.headers"
                :items="answerTab.items"
                :search="answerTab.search"
              >
                <template #item.questionTitle="{item}">
                  <router-link
                    :to="
                      '/question/' + item.ownQuestionId + '#' + item.answerId
                    "
                    >{{ item.questionTitle }}</router-link
                  >
                </template>
                <template #item.isAccepted="{item}">
                  <v-icon v-if="item.isAccepted" color="success" title="已采纳"
                    >check</v-icon
                  >
                  <v-icon v-else color="error" title="未采纳">minimize</v-icon>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- collect tab -->
          <v-tab-item>
            <v-card>
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="collectTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="collectTab.headers"
                :items="collectTab.items"
                :search="collectTab.search"
              >
                <template #item.title="{item}">
                  <router-link :to="'/question/' + item.questionId">{{
                    item.title
                  }}</router-link>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- watch tab -->
          <v-tab-item>
            <v-layout wrap class="px-3">
              <div
                v-for="watch in userProfile.watchUsers"
                :key="watch.userId"
                class="ma-2"
              >
                <UserCard min-width="220px" :user-info="watch"> </UserCard>
              </div>
            </v-layout>
          </v-tab-item>
          <!-- follower tab -->
          <v-tab-item>
            <v-layout wrap class="px-3">
              <div
                v-for="follower in userProfile.followers"
                :key="follower.userId"
                class="ma-2"
              >
                <UserCard min-width="220px" :user-info="follower"> </UserCard>
              </div>
            </v-layout>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import UserCard from '../../../components/UserCard'
import TagChip from '../../../components/TagChip'
export default {
  components: { TagChip, UserCard },
  data: () => ({
    tab: null,
    userProfile: null,
    likeTagList: null,
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
        { text: '浏览', value: 'viewNum' }
      ],
      items: []
    }
  }),
  computed: {
    isFollowed() {
      const curUserId = this.$store.getters.getUserId
      if (curUserId) {
        for (let i = 0; i < this.userProfile.followers.length; ++i) {
          if (this.userProfile.followers[i].userId === curUserId) {
            return true
          }
        }
      }
      return false
    }
  },
  created() {
    this.loadUserProfile()
    this.loadLikeTags()
  },
  methods: {
    loadUserProfile() {
      this.$axios
        .$post('userInfo/getUserProfile', {
          userId: this.$route.params.id
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userProfile = resp.data
            this.askTab.items = this.userProfile.questions
            this.answerTab.items = this.userProfile.answers
            this.collectTab.items = this.userProfile.questionCollection
          }
        })
    },
    loadLikeTags() {
      if (this.$store.getters.getUserId) {
        this.$axios
          .$post('/tagLike/listOtherLikeTags', {
            userId: this.$route.params.id
          })
          .then((resp) => {
            this.likeTagList = resp.data
          })
      }
    },
    followUser() {
      this.$axios
        .$post('/userFollow/watchUser', {
          toUserId: this.userProfile.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userProfile.followers = resp.data
          }
        })
    },
    unWatchUser() {
      this.$axios
        .$post('/userFollow/unWatchUser', {
          toUserId: this.userProfile.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userProfile.followers = resp.data
          }
        })
    }
  }
}
</script>
<style scoped></style>
