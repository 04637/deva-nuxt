<template>
  <v-layout v-if="userProfile" column justify-center>
    <v-layout column>
      <v-layout>
        <v-card-title>
          <v-row align="end">
            用户档案
          </v-row>
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center>
      <v-flex hidden-sm-and-down md3 lg4>
        <v-card class="pa-4">
          <v-row justify="end" style="position: relative; top: -14px;">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-show="userProfile.userId === $store.getters.getUserId"
                  small
                  text
                  to="editProfile"
                  icon
                  v-on="on"
                  @click="unWatchUser"
                >
                  <v-icon small>edit</v-icon>
                </v-btn>
              </template>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-show="isFollowed"
                  small
                  text
                  icon
                  :color="isFollowed ? 'private' : ''"
                  v-on="on"
                  @click="unWatchUser"
                >
                  <v-icon small>favorite</v-icon>
                </v-btn>
              </template>
              <span>取消关注</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="userProfile.userId !== $store.getters.getUserId"
                  v-show="!isFollowed"
                  text
                  small
                  icon
                  :color="isFollowed ? 'private' : ''"
                  v-on="on"
                  @click="followUser"
                >
                  <v-icon small>favorite</v-icon>
                </v-btn>
              </template>
              <span>关注他/她</span>
            </v-tooltip>
          </v-row>
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
              <v-card flat style="border: none">
                <v-card-text class="pt-0"
                  >提问：{{ userProfile.questions.length }}</v-card-text
                >
                <v-card-text
                  >回答：{{ userProfile.answers.length }}</v-card-text
                >
                <v-card-text
                  >采纳率：{{ userProfile.adoptionRate }}%</v-card-text
                >
                <v-card-text
                  >粉丝：{{ userProfile.followers.length }}</v-card-text
                >
                <v-card-text>声望：{{ userProfile.reputation }}</v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout wrap class="mt-2">
            <div v-for="tag in likeTagList" :key="tag.tagId" class="mr-2 mb-2">
              <TagChip :tag-info="tag" color="blue"></TagChip>
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
            博文
          </v-tab>
          <v-tab>
            问题收藏
          </v-tab>
          <v-tab>
            博文收藏
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
            <v-card flat>
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="askTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0 hidden-sm-and-down"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                locale="zh-Hans"
                :headers="askTab.headers"
                :items="askTab.items"
                :search="askTab.search"
              >
                <template #item.title="{item}">
                  <router-link
                    class="hover-color"
                    :to="'/question/' + item.questionId"
                    >{{ item.title }}</router-link
                  >
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
            <v-card flat>
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="answerTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0 hidden-sm-and-down"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="answerTab.headers"
                :items="answerTab.items"
                :search="answerTab.search"
              >
                <template #item.questionTitle="{item}">
                  <router-link
                    class="hover-color"
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
          <!-- blog tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="blogTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0 hidden-sm-and-down"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                locale="zh-Hans"
                :headers="blogTab.headers"
                :items="blogTab.items"
                :search="blogTab.search"
              >
                <template #item.title="{item}">
                  <router-link
                    class="hover-color"
                    :to="'/blog/' + item.blogId"
                    >{{ item.title }}</router-link
                  >
                </template>
                <template #item.isPublic="{item}">
                  {{ item.isPublic ? '是' : '否' }}
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- collect tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="collectTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0 hidden-sm-and-down"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="collectTab.headers"
                :items="collectTab.items"
                :search="collectTab.search"
              >
                <template #item.title="{item}">
                  <router-link
                    class="hover-color"
                    :to="'/question/' + item.questionId"
                    >{{ item.title }}</router-link
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <!-- 博文收藏-->
          <v-tab-item>
            <v-card flat>
              <v-card-title class="pt-0">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="likeBlogTab.search"
                  append-icon="search"
                  label="搜索"
                  single-line
                  hide-details
                  class="pt-0 hidden-sm-and-down"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="likeBlogTab.headers"
                :items="likeBlogTab.items"
                :search="likeBlogTab.search"
              >
                <template #item.title="{item}">
                  <router-link
                    class="hover-color"
                    :to="'/blog/' + item.blogId"
                    >{{ item.title }}</router-link
                  >
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
                class="ma-2 hidden-sm-and-down"
              >
                <MiniUserCard min-width="220px" :user-info="watch">
                </MiniUserCard>
              </div>
            </v-layout>
          </v-tab-item>
          <!-- follower tab -->
          <v-tab-item>
            <v-layout wrap class="px-3">
              <div
                v-for="follower in userProfile.followers"
                :key="follower.userId"
                class="ma-2 hidden-sm-and-down"
              >
                <MiniUserCard min-width="220px" :user-info="follower">
                </MiniUserCard>
              </div>
            </v-layout>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import MiniUserCard from '../../../components/MiniUserCard'
import TagChip from '../../../components/TagChip'
export default {
  components: { TagChip, MiniUserCard },
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
        { text: '状态', value: 'status' }
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
        { text: '状态', value: 'isAccepted' }
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
    },
    likeBlogTab: {
      search: '',
      headers: [
        {
          text: '标题',
          sortable: false,
          align: 'left',
          value: 'title'
        },
        { text: '喜欢', value: 'likeNum' },
        { text: '支持', value: 'voteNum' },
        { text: '浏览', value: 'viewNum' }
      ],
      items: []
    },
    blogTab: {
      search: '',
      headers: [
        {
          text: '标题',
          sortable: false,
          align: 'left',
          value: 'title'
        },
        { text: '公开', value: 'isPublic' },
        { text: '喜欢', value: 'likeNum' },
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
            this.likeBlogTab.items = this.userProfile.blogCollection
            this.blogTab.items = this.userProfile.blogs
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
<style scoped>
.theme--light .hover-color {
  color: black;
  text-decoration: none;
}
.theme--dark .hover-color {
  color: white;
  text-decoration: none;
}
.hover-color:hover {
  color: #01a687 !important;
}
.theme--light .v-card--flat {
  border: 1px solid #e7e7e7;
}
.theme--dark .v-card--flat {
  border: 1px solid #4b4b4b;
}
</style>
