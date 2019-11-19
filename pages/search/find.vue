<template>
  <v-app>
    <v-layout justify-center shrink class="mt-12">
      <v-flex xs12 md6 align-self-center grow>
        <logo class="mt-12"></logo>
        <v-layout class="mt-10">
          <v-text-field
            v-model="keywords"
            hide-details
            placeholder="搜索"
            append-icon="search"
            rounded
            solo
            class="search-input2"
            @click:append="search"
            @keyup.enter.native="search"
          ></v-text-field>
        </v-layout>
        <v-spacer></v-spacer>
        <v-subheader
          ><svg class="icon heat-icon" aria-hidden="true">
            <use xlink:href="#icon-heat0"></use></svg
          >实时热度，每分钟更新一次</v-subheader
        >
        <v-layout wrap justify-space-around>
          <div v-for="(item, index) in heatList" :key="index">
            <v-chip :to="'/search/' + item.keywords" class="mb-3">
              <v-layout align-center>
                {{ item.keywords }}
                <span style="font-weight: bolder">&nbsp;&nbsp;·&nbsp;</span>
                <span style="font-size: 14px;" class="my_gray--text">{{
                  item.heat
                }}</span
                ><v-icon
                  :color="
                    item.heat >= 50 ? 'red' : item.heat >= 30 ? 'orange' : ''
                  "
                  small
                  >mdi-fire</v-icon
                >
              </v-layout>
            </v-chip>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app>
</template>
<script>
import Logo from '../../components/Logo'
export default {
  components: {
    Logo
  },
  data: () => ({
    keywords: null,
    heatList: null
  }),
  created() {
    this.loadHeatList()
  },
  methods: {
    search() {
      if (this.keywords) {
        this.$router.push({
          path: '/search/' + this.keywords
        })
      }
    },
    loadHeatList() {
      this.$axios.$post('/hotSearch/getSearchHeat').then((resp) => {
        this.heatList = resp.data
      })
    }
  }
}
</script>
<style>
.theme--light .search-input2 .v-input__slot {
  background: #f6f6f6 !important;
}
.theme--dark .search-input2 .v-input__slot {
  background: #4b4b4b !important;
}
</style>
