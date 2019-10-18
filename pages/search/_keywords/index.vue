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
                ><strong class="ml-1">{{
                  $route.query.spaceName
                }}</strong></v-btn
              >
              <v-chip
                v-if="$route.query.match === 'tags'"
                color="primary"
                text
                style="max-width:170px; cursor: pointer; text-decoration: none;border-radius: 0"
                :title="$route.params.keywords"
                class="ml-3 d-inline-block text-truncate text-left no-flex"
              >
                <span>{{ $route.params.keywords }}</span></v-chip
              >
              <span v-else class="ml-3">{{
                $route.params.keywords
              }}</span></v-row
            ></v-card-title
          >
        </v-flex>
        <v-flex md5 lg3 align-self-end>
          <v-tabs center-active height="38" @change="searchQuestions">
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
        <HotTag></HotTag>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import QuestionCardList from '../../../components/QuestionCardList'
import HotTag from '../../../components/HotTag'
export default {
  components: {
    HotTag,
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
      const _url = '/esQuestionInfo/search'
      this.page.current = 1
      this.loadMore.isLoading = false
      this.loadMore.noMore = false
      this.$axios
        .$post(_url, {
          keywords: this.$route.params.keywords,
          current: this.page.current,
          size: this.page.size,
          sortType: this.listType,
          matchColumns: this.$route.query.match
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
          const _url = '/esQuestionInfo/search'
          this.$axios
            .$post(_url, {
              current: ++this.page.current,
              size: this.page.size,
              sortType: this.listType,
              keywords: this.$route.params.keywords
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
