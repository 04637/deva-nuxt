<template>
  <div>
    <v-layout class="top-bg"></v-layout>
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
        <div class="label-num">{{ userProfile.adoptionRate }} %</div>
      </div>
      <v-avatar size="130">
        <v-img
          :src="userProfile.avatar"
          style="box-shadow: 0 0 20px #fafafa"
        ></v-img>
      </v-avatar>
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
  </div>
</template>

<script>
export default {
  transition: 'none',
  data: () => ({
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
</style>
