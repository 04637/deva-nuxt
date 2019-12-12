<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-flex md7 lg6 shrink hidden-sm-and-down>
          <v-card-title class="pa-0"
            ><v-layout align-center>
              <v-flex v-if="$route.query.match === 'tags'">
                <v-chip
                  text
                  style="max-width:170px; cursor: pointer; text-decoration: none;border-radius: 0"
                  :title="$route.params.keywords"
                >
                  <span>{{ $route.params.keywords }}</span></v-chip
                >
              </v-flex>
              <v-flex v-if="$route.query.match === 'tags' && tagInfo">
                <span
                  style="font-size: 14px;line-height: 17px"
                  class=" ml-3 my_gray--text label-description"
                  :title="tagInfo.description"
                  >{{ tagInfo.description }}</span
                >
                <span v-if="$route.query.match !== 'tags'" class="ml-3">{{
                  $route.params.keywords
                }}</span></v-flex
              ></v-layout
            ></v-card-title
          >
        </v-flex>
        <v-flex md5 lg6 align-self-end>
          <v-tabs
            height="38"
            slider-color="slider_color"
            background-color="transparent"
            @change="searchBQ"
          >
            <v-tab @click="sortType = 'RELEVANCE'">相关</v-tab>
            <v-tab @click="sortType = 'RECENT'">最新</v-tab>
            <v-tab @click="sortType = 'ACTIVE'">活跃</v-tab>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <span class="my_gray--text" style="font-size: 0.7rem"
        >找到相关结果约 {{ totalElements }} 个</span
      >
    </v-layout>
    <v-layout justify-center justify-space-around class="mt-4">
      <v-flex xs12 md9 lg9 justify-start shrink>
        <BQCardList v-if="bqList" :bq-list="bqList"></BQCardList>
      </v-flex>
      <v-flex md3 lg3 justify-end shrink hidden-sm-and-down class="ml-3">
        <right-header></right-header>
        <MyTags class="mt-3"></MyTags>
        <relate-post class="mt-3"></relate-post>
        <active-users class="mt-3"></active-users>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import BQCardList from '../../../components/post/BQCardList'
import RelatePost from '../../../components/rightBox/RelatePost'
import ActiveUsers from '../../../components/rightBox/ActiveUsers'
import RightHeader from '../../../components/rightBox/RightHeader'
import MyTags from '../../../components/rightBox/MyTags'
export default {
  components: {
    MyTags,
    RightHeader,
    ActiveUsers,
    RelatePost,
    BQCardList
  },
  data: () => ({
    sortType: null,
    bqList: null,
    hotQuestionList: null,
    page: {
      current: 1,
      size: 15
    },
    loadMore: {
      isLoading: false,
      noMore: false
    },
    totalElements: 0,
    tagInfo: null
  }),
  created() {
    this.loadTagInfo()
  },
  mounted() {
    this.scroll()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setTransparentHeader', false)
    next()
  },
  methods: {
    searchBQ() {
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post('/es/search', {
          keywords: this.$route.params.keywords,
          current: this.page.current,
          size: this.page.size,
          sortType: this.sortType,
          matchColumns: this.$route.query.match
        })
        .then((resp) => {
          if (resp.succeed) {
            this.bqList = resp.data.content
            this.totalElements = resp.data.totalElements
          } else {
            this.bqList = []
          }
        })
    },
    loadTagInfo() {
      if (this.$route.query.match === 'tags') {
        this.$axios
          .$post('/tagInfo/getTagInfo', {
            tagName: this.$route.params.keywords
          })
          .then((resp) => {
            if (resp.succeed) {
              this.tagInfo = resp.data
            }
          })
      }
    },
    scroll() {
      window.onscroll = () => {
        if (!/\/search\//.test(this.$route.path)) {
          return false
        }
        if (document.documentElement.scrollTop > 62) {
          this.$store.commit('setTransparentHeader', true)
        } else {
          this.$store.commit('setTransparentHeader', false)
        }
        // 距离底部200px时加载一次
        const bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          200
        if (
          bottomOfWindow &&
          !this.loadMore.isLoading &&
          !this.loadMore.noMore
        ) {
          this.loadMore.isLoading = true
          const _url = '/es/search'
          this.$axios
            .$post(_url, {
              current: ++this.page.current,
              size: this.page.size,
              sortType: this.sortType,
              keywords: this.$route.params.keywords
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.bqList = this.bqList.concat(resp.data.content)
              } else {
                this.loadMore.noMore = true
              }
            })
            .catch((e) => {
              this.loadMore.isLoading = false
            })
        }
      }
    }
  }
}
</script>
<style>
/* 控制展示两行 */
.label-description {
  font-size: 14px;
  /*text-indent: 12px;*/
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  min-height: 34px;
}
</style>
