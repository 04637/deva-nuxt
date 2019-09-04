<template>
  <v-container justify-center align-start>
    <v-layout justify-center>
      <v-flex xs9 md6 align-self-center>
        <v-layout justify-center>
          <img src="/deva.png" alt="" class="logo" />
        </v-layout>
        <v-layout>
          <v-text-field
            v-model="keywords"
            hide-details
            label="Search"
            prepend-inner-icon="search"
            outlined
            rounded
            @keyup.enter.native="search"
          ></v-text-field>
        </v-layout>
        <v-spacer></v-spacer>
        <v-subheader
          ><svg class="icon heat-icon" aria-hidden="true">
            <use xlink:href="#icon-heat0"></use></svg
          >实时热度，每分钟更新一次</v-subheader
        >
        <v-layout>
          <v-list width="100%" class="pt-0">
            <div v-for="(item, index) in heatList" :key="index">
              <v-list-item :to="'/search/' + item.keywords">
                <v-layout>
                  <v-flex xs11 align-start
                    >{{ index + 1 }}.&nbsp;&nbsp;{{ item.keywords }}
                  </v-flex>
                  <v-layout xs1 align-end>
                    <!--<v-flex></v-flex-->
                    <!--&gt;&nbsp;-->
                    <v-layout justify-end>
                      <span>{{ item.heat }}</span
                      >&nbsp;&nbsp;
                      <svg
                        class="icon heat-icon-2"
                        aria-hidden="true"
                        style="vertical-align: -3px"
                      >
                        <use
                          v-if="item.heat > 50"
                          xlink:href="#icon-huo3"
                        ></use>
                        <use
                          v-else-if="item.heat > 20"
                          xlink:href="#icon-huo2"
                        ></use>
                        <use v-else xlink:href="#icon-huo1"></use>
                      </svg>
                    </v-layout>
                  </v-layout>
                </v-layout>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </v-list>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    keywords: null,
    heatList: null
  }),
  created() {
    this.loadHeatList()
  },
  methods: {
    search() {
      this.$router.push({
        path: '/search/' + this.keywords
      })
    },
    loadHeatList() {
      this.$axios.$post('/hotSearch/getSearchHeat').then((resp) => {
        this.heatList = resp.data
      })
    }
  }
}
</script>
<style scoped>
.logo {
  width: 300px;
  height: 140px;
  display: block;
}
</style>
