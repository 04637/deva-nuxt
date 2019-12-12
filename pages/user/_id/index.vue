<template>
  <div>
    <div class="bg"></div>
    <v-layout class="top-bg"></v-layout>
    <!-- 头部信息 -->
    <v-layout
      v-if="userProfile"
      justify-space-around
      align-start
      style="position:relative; top:103px;"
      class="white--text"
    >
      <div
        class="label-div"
        @click="
          tabIndex = $store.getters.getUserId === userProfile.userId ? 3 : 0
        "
      >
        <div class="label-des">提问</div>
        <div class="label-num">{{ userProfile.questions.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div
        class="label-div"
        @click="
          tabIndex = $store.getters.getUserId === userProfile.userId ? 4 : 1
        "
      >
        <div class="label-des">回答</div>
        <div class="label-num">{{ userProfile.answers.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div
        class="label-div"
        @click="
          tabIndex = $store.getters.getUserId === userProfile.userId ? 4 : 1
        "
      >
        <div class="label-des">采纳率</div>
        <div class="label-num">{{ userProfile.adoptionRate }}%</div>
      </div>
      <div class="label-divider d-lg-none d-sm-block d-md-none">
        <div class="label-des">|</div>
      </div>
      <v-flex shrink class="ml-2 mr-2" hidden-sm-and-down justify-center>
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-layout justify-center>
              <v-avatar size="130" style="z-index: 10">
                <v-img
                  :src="userProfile.avatar"
                  style="box-shadow: 0 0 20px #fafafa"
                ></v-img>
                <v-fade-transition>
                  <v-overlay
                    v-if="
                      hover && $store.getters.getUserId === userProfile.userId
                    "
                    absolute
                    color="primary"
                  >
                    <input
                      v-show="false"
                      ref="selectAvatar"
                      accept="image/png, image/jpeg, image/bmp"
                      type="file"
                      @change="uploadAvatar($event)"
                    />
                    <v-btn
                      icon
                      color="white"
                      text
                      @click="$refs.selectAvatar.click()"
                      ><v-icon>mdi-image-edit-outline</v-icon></v-btn
                    >
                  </v-overlay>
                </v-fade-transition>
              </v-avatar>
            </v-layout>
          </template>
        </v-hover>
        <v-layout
          class="primary--text text-center mt-2"
          style="z-index: 10;position: relative"
          justify-center
          align-center
          ><v-chip>
            <strong>{{ userProfile.nickname }}</strong>
            <b class="my_gray--text">&nbsp;·&nbsp;</b>
            <span style="font-size: 0.9rem;">{{ userProfile.reputation }}</span>
            <v-icon color="red">mdi-music-clef-bass</v-icon>
          </v-chip>
        </v-layout>
        <div
          v-if="userProfile.userId !== $store.getters.getUserId"
          style="z-index: 10;position: relative; left: 179px; top: -80px;"
        >
          <v-btn
            v-if="!userProfile.followed"
            color="blue"
            class="white--text"
            small
            @click="followUser"
            ><v-icon small>add</v-icon>关注他</v-btn
          >
          <v-btn
            v-else
            color="blue"
            class="white--text"
            small
            @click="unWatchUser"
            >取消关注</v-btn
          >
        </div>
      </v-flex>
      <div
        class="label-div"
        @click="
          tabIndex = $store.getters.getUserId === userProfile.userId ? 5 : 2
        "
      >
        <div class="label-des">博文</div>
        <div class="label-num">{{ userProfile.blogs.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div
        class="label-div"
        @click="
          tabIndex = $store.getters.getUserId === userProfile.userId ? 7 : 3
        "
      >
        <div class="label-des">粉丝</div>
        <div class="label-num">{{ userProfile.followers.length }}</div>
      </div>
      <div class="label-divider">
        <div class="label-des">|</div>
      </div>
      <div class="label-div" @click="tabIndex = 0">
        <div class="label-des">声望</div>
        <div class="label-num">{{ userProfile.reputation }}</div>
      </div>
    </v-layout>
    <v-layout class="top-m-bg" justify-center> </v-layout>
    <!--中部内容区-->
    <v-layout
      style="margin-top: 150px; z-index: 10; padding: 10px 15px 15px 0; position: relative;min-height: 900px"
      class="right-box"
    >
      <v-flex shrink hidden-sm-and-down>
        <v-tabs
          v-if="userProfile"
          v-model="tabIndex"
          vertical
          slider-size="3"
          slider-color="light_blue"
          hide-slider
          active-class="active-tab"
        >
          <div v-if="$store.getters.getUserId === userProfile.userId">
            <v-tab>个人资料</v-tab>
            <v-divider></v-divider>
            <v-tab>问题收藏</v-tab>
            <v-tab>博文收藏</v-tab>
            <v-divider></v-divider>
            <v-tab>我的提问</v-tab>
            <v-tab>我的回答</v-tab>
            <v-tab>我的博文</v-tab>
            <!--<v-tab>我的空间</v-tab>-->
            <v-divider></v-divider>
            <v-tab>我的关注</v-tab>
            <v-tab>我的粉丝</v-tab>
            <v-tab>我的标签</v-tab>
            <v-divider></v-divider>
            <v-tab>我的消息</v-tab>
          </div>
          <div v-else>
            <v-tab>他的提问</v-tab>
            <v-tab>他的回答</v-tab>
            <v-tab>他的博文</v-tab>
            <v-tab>他的粉丝</v-tab>
            <v-tab>他的标签</v-tab>
          </div>
        </v-tabs>
      </v-flex>
      <v-divider vertical></v-divider>
      <v-flex
        v-if="userProfile"
        class="ml-3"
        style="background-color: white;z-index: 10;"
      >
        <div v-if="$store.getters.getUserId === userProfile.userId">
          <v-tabs-items v-model="tabIndex">
            <v-tab-item>
              <base-info :user-info="userProfile"></base-info>
            </v-tab-item>
            <v-tab-item>
              <my-questions
                :questions="userProfile.questionCollection"
              ></my-questions>
            </v-tab-item>
            <v-tab-item>
              <my-blogs :blogs="userProfile.blogCollection"></my-blogs>
            </v-tab-item>
            <v-tab-item>
              <my-questions :questions="userProfile.questions"></my-questions>
            </v-tab-item>
            <v-tab-item>
              <my-answers :answers="userProfile.answers"></my-answers>
            </v-tab-item>
            <v-tab-item>
              <my-blogs :blogs="userProfile.blogs"></my-blogs>
            </v-tab-item>
            <!--<v-tab-item></v-tab-item>-->
            <v-tab-item>
              <my-watch :users="userProfile.watchUsers"></my-watch>
            </v-tab-item>
            <v-tab-item>
              <my-watch :users="userProfile.followers"></my-watch>
            </v-tab-item>
            <v-tab-item>
              <my-tags :user-id="userProfile.userId"></my-tags>
            </v-tab-item>
            <v-tab-item>
              <my-messages></my-messages>
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div v-else>
          <v-tabs-items v-model="tabIndex">
            <v-tab-item>
              <my-questions :questions="userProfile.questions"></my-questions>
            </v-tab-item>
            <v-tab-item>
              <my-answers :answers="userProfile.answers"></my-answers>
            </v-tab-item>
            <v-tab-item>
              <my-blogs :blogs="userProfile.blogs"></my-blogs>
            </v-tab-item>
            <v-tab-item>
              <my-watch :users="userProfile.followers"></my-watch>
            </v-tab-item>
            <v-tab-item>
              <my-tags :user-id="userProfile.userId"></my-tags>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-flex>
    </v-layout>
    <InfoDialog
      :msg="['修改成功', uploadResult.errorMsg]"
      :succeed="uploadResult.resp != null && uploadResult.resp.succeed"
      :dialog="uploadResult.dialog"
      @update:dialog="uploadResult.dialog = $event"
    >
    </InfoDialog>
  </div>
</template>

<script>
import InfoDialog from '../../../components/dialog/InfoDialog'
import BaseInfo from '../../../components/userProfile/BaseInfo'
import MyWatch from '../../../components/userProfile/MyWatch'
import MyQuestions from '../../../components/userProfile/MyQuestions'
import MyAnswers from '../../../components/userProfile/MyAnswers'
import MyBlogs from '../../../components/userProfile/MyBlogs'
import MyMessages from '../../../components/userProfile/MyMessages'
import MyTags from '../../../components/userProfile/MyTags'
export default {
  components: {
    MyTags,
    MyMessages,
    MyBlogs,
    MyAnswers,
    BaseInfo,
    InfoDialog,
    MyWatch,
    MyQuestions
  },
  transition: 'none',
  data: () => ({
    tabIndex: 0,
    userProfile: null,
    likeTagList: null,
    uploadResult: {
      dialog: false,
      resp: null,
      errorMsg: null
    }
  }),
  created() {
    this.loadUserProfile()
  },
  mounted() {
    const _tab = this.$route.query.tab
    if (_tab === 'message') {
      this.tabIndex = 9
    } else if (_tab === 'collection') {
      this.tabIndex = 1
    } else if (_tab === 'ask') {
      this.tabIndex = 3
    } else {
      this.tabIndex = 0
    }
  },
  methods: {
    uploadAvatar(e) {
      const _newAvatar = e.target.files[0]
      if (!_newAvatar) {
        return
      }
      if (_newAvatar.size > 5 * 1024 * 1024) {
        this.uploadResult.dialog = true
        this.uploadResult.errorMsg = '请选择5M以下的图片'
        this.uploadResult.resp = { succeed: false }
        return
      }
      const _formData = new FormData()
      _formData.append('newAvatar', _newAvatar)
      this.$axios
        .$post('/userInfo/updateUserAvatar', _formData)
        .then((resp) => {
          this.uploadResult.resp = resp
          if (resp.succeed) {
            this.userProfile.avatar = resp.data
            this.$store.commit('setAvatar', resp.data)
          } else {
            this.uploadResult.errorMsg = resp.msg
            this.uploadResult.dialog = true
          }
        })
    },
    loadUserProfile() {
      this.$axios
        .$post('userInfo/getUserProfile', {
          userId: this.$route.params.id
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userProfile = resp.data
          }
        })
    },
    followUser() {
      this.$axios
        .$post('/userFollow/followUser', {
          toUserId: this.userProfile.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userProfile.followed = !this.userProfile.followed
          }
        })
    },
    unWatchUser() {
      this.$axios
        .$post('/userFollow/unFollowUser', {
          toUserId: this.userProfile.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userProfile.followed = !this.userProfile.followed
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
.bg {
  background-size: cover;
  width: 100vw;
  height: 100vh;
  /*background: transparent url('/svg/star-bg.svg') center;*/
  position: fixed;
  left: 0;
  z-index: 0;
  top: 56px;
}
.top-m-bg {
  background-size: cover;
  width: 100vw;
  height: 130px;
  position: fixed;
  left: 0;
  background-color: white;
  top: 256px;
  z-index: 0;
}
.label-div,
.label-divider {
  text-align: center;
}
.label-div {
  padding: 10px 16px;
  min-width: 80px;
  position: relative;
  top: -10px;
}
.label-div:hover {
  /*background-color: rgba(250, 250, 250, 0.24);*/
  cursor: pointer;
}
.label-div:hover .label-des {
  color: white !important;
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
