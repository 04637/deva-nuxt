<template>
  <v-app v-show="questionList">
    <v-layout column shrink>
      <v-layout>
        <v-flex md7 xs4 shrink hidden-sm-and-down>
          <v-card-title
            ><v-row align="center"
              ><v-btn
                v-if="$route.query.spaceId"
                :to="'/space/' + $route.query.spaceId"
                text
                outlined
                color="private"
                small
                class="mr-5"
                ><v-icon small>visibility_off</v-icon
                ><strong class="ml-1">{{
                  $route.query.spaceName
                }}</strong></v-btn
              >{{ $route.params.keywords }}</v-row
            ></v-card-title
          >
        </v-flex>
        <v-flex md5 lg3 align-self-end>
          <v-tabs centered height="38" @change="searchQuestions">
            <v-tab @click="listType = 'RELEVANCE'">相关</v-tab>
            <v-tab @click="listType = 'NEWEST'">最新</v-tab>
            <v-tab @click="listType = 'ACTIVE'">活跃</v-tab>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center justify-space-around class="mt-4">
      <v-flex xs11 lg9 justify-start shrink>
        <QuestionCardList
          v-if="questionList"
          :question-list="questionList"
        ></QuestionCardList>
      </v-flex>
      <v-flex lg2 justify-end shrink hidden-md-and-down class="ml-3">
        <HotQuestionList></HotQuestionList>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import QuestionCardList from '../../../components/QuestionCardList'
import HotQuestionList from '../../../components/HotQuestionList'
export default {
  components: {
    HotQuestionList,
    QuestionCardList
  },
  data: () => ({
    listType: null,
    questionList: null,
    hotQuestionList: null,
    page: {
      current: 1,
      size: 15
    },
    loadMore: {
      isLoading: false,
      noMore: false
    }
  }),
  created() {},
  mounted() {
    this.scroll()
  },
  methods: {
    searchQuestions() {
      let _url = '/esQuestionInfo/search'
      if (this.$route.query.spaceId) {
        _url = '/esQuestionInfo/searchFromSpace'
      }
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post(_url, {
          keywords: this.$route.params.keywords,
          current: this.page.current,
          size: this.page.size,
          sortType: this.listType,
          spaceId: this.$route.query.spaceId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.questionList = resp.data.content
          } else {
            this.questionList = []
          }
        })
    },
    scroll() {
      window.onscroll = () => {
        if (!/\/search\//.test(this.$route.path)) {
          return false
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
          let _url = '/esQuestionInfo/search'
          if (this.$route.query.spaceId) {
            _url = '/esQuestionInfo/searchFromSpace'
          }
          this.$axios
            .$post(_url, {
              current: ++this.page.current,
              size: this.page.size,
              sortType: this.listType,
              keywords: this.$route.params.keywords,
              spaceId: this.$route.query.spaceId
            })
            .then((resp) => {
              this.loadMore.isLoading = false
              if (resp.succeed) {
                this.questionList = this.questionList.concat(resp.data.content)
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
