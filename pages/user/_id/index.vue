<template>
  <div>
    <v-layout class="top-bg"></v-layout>
    <!-- 头部信息 -->
    <v-layout
      v-if="userProfile"
      justify-space-around
      align-start
      style="position:relative; top:103px;"
      class="white--text"
    >
      <div class="label-div">
        <div class="label-des">提问</div>
        <div class="label-num">{{ userProfile.questions.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div class="label-div">
        <div class="label-des">回答</div>
        <div class="label-num">{{ userProfile.answers.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div class="label-div">
        <div class="label-des">采纳率</div>
        <div class="label-num">{{ userProfile.adoptionRate }}%</div>
      </div>
      <div class="label-divider d-lg-none d-sm-block d-md-none">
        <div class="label-des">|</div>
      </div>
      <v-flex shrink class="ml-2 mr-2" hidden-sm-and-down>
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-avatar size="130" style="z-index: 10">
              <v-img
                :src="userProfile.avatar"
                style="box-shadow: 0 0 20px #fafafa"
              ></v-img>
              <v-fade-transition>
                <v-overlay v-if="hover" absolute color="primary">
                  <v-btn icon color="white" text
                    ><v-icon>mdi-image-edit-outline</v-icon></v-btn
                  >
                </v-overlay>
              </v-fade-transition>
            </v-avatar>
          </template>
        </v-hover>
        <v-layout
          class="primary--text text-center mt-2"
          justify-center
          align-center
          ><v-chip>
            <strong>{{ userProfile.nickname }}</strong>
            <b class="my_gray--text">&nbsp;·&nbsp;</b>
            <span style="font-size: 0.9rem;">{{ userProfile.reputation }}</span>
            <v-icon color="red">mdi-music-clef-bass</v-icon>
          </v-chip>
        </v-layout>
      </v-flex>
      <div class="label-div">
        <div class="label-des">博文</div>
        <div class="label-num">{{ userProfile.blogs.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div class="label-div">
        <div class="label-des">粉丝</div>
        <div class="label-num">{{ userProfile.followers.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div class="label-div">
        <div class="label-des">声望</div>
        <div class="label-num">{{ userProfile.reputation }}</div>
      </div>
    </v-layout>
    <v-layout class="top-m-bg" justify-center> </v-layout>
    <!--中部内容区-->
    <v-layout style="margin-top: 150px; background-color: #e7e7e7">
      <v-flex shrink>
        <v-tabs
          v-model="tabIndex"
          vertical
          slider-size="3"
          slider-color="light_blue"
          hide-slider
          active-class="active-tab"
        >
          <v-tab>基本资料</v-tab>
          <v-tab>我的关注</v-tab>
          <v-tab>我的收藏</v-tab>
          <v-tab>我的提问</v-tab>
          <v-tab>我的回答</v-tab>
          <v-tab>我的空间</v-tab>
          <v-divider></v-divider>
          <v-tab>我的消息</v-tab>
          <v-tab>设置中心</v-tab>
        </v-tabs>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex class="ml-3" style="background-color: white;">
        <v-tabs-items v-model="tabIndex">
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>
                  Fusce a quam. Phasellus nec sem in justo pellentesque
                  facilisis. Nam eget dui. Proin viverra, ligula sit amet
                  ultrices semper, ligula arcu tristique sapien, a accumsan nisi
                  mauris ac eros. In dui magna, posuere eget, vestibulum et,
                  tempor auctor, justo.
                </p>

                <p class="mb-0">
                  Cras sagittis. Phasellus nec sem in justo pellentesque
                  facilisis. Proin sapien ipsum, porta a, auctor quis, euismod
                  ut, mi. Donec quam felis, ultricies nec, pellentesque eu,
                  pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>
                  Fusce a quam. Phasellus nec sem in justo pellentesque
                  facilisis. Nam eget dui. Proin viverra, ligula sit amet
                  ultrices semper, ligula arcu tristique sapien, a accumsan nisi
                  mauris ac eros. In dui magna, posuere eget, vestibulum et,
                  tempor auctor, justo.
                </p>

                <p class="mb-0">
                  Cras sagittis. Phasellus nec sem in justo pellentesque
                  facilisis. Proin sapien ipsum, porta a, auctor quis, euismod
                  ut, mi. Donec quam felis, ultricies nec, pellentesque eu,
                  pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  transition: 'none',
  data: () => ({
    tabIndex: 0,
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
.top-bg {
  background-size: cover;
  width: 100vw;
  height: 200px;
  background: #24292e url('/bg/stars-color.png') top;
  position: fixed;
  left: 0;
  top: 56px;
}
.top-m-bg {
  background-size: cover;
  width: 100vw;
  height: 100px;
  position: fixed;
  left: 0;
  background-color: white;
  opacity: 0.2;
  top: 256px;
}
.label-div,
.label-divider {
  text-align: center;
}
.label-num {
  margin-top: 15px;
}
.label-des {
  color: lightgrey;
  font-size: 13px;
}
.label-divider {
  margin-left: 15px;
  margin-right: 15px;
}
.active-tab {
  color: #2196f3;
  background-color: rgba(246, 246, 246, 0.8);
  border-right: 5px solid #6bb3e7 !important;
}
</style>
