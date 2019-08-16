<template>
  <v-container justify-center align-start>
    <v-layout justify-center>
      <v-flex xs9 md6 align-self-center>
        <v-layout justify-center>
          <img src="/deva.png" alt="" class="logo" />
        </v-layout>
        <v-layout>
          <v-text-field
            hide-details
            label="Search"
            prepend-inner-icon="search"
            outlined
            rounded
          ></v-text-field>
        </v-layout>
        <v-spacer></v-spacer>
        <v-subheader
          ><svg class="icon heat-icon" aria-hidden="true">
            <use xlink:href="#icon-heat0"></use></svg
          >实时热度，每分钟更新一次</v-subheader
        >
        <v-layout>
          <v-list width="100%">
            <v-list-item width="100%">
              <v-layout>
                <v-flex xs11 align-start>1. 我是谁 </v-flex>
                <v-layout xs1>
                  <v-flex>100</v-flex>
                  <v-flex>
                    <svg class="icon heat-icon-2" aria-hidden="true">
                      <use xlink:href="#icon-huo3"></use>
                      <!--<use v-else-if="heat.heat>20" xlink:href="#icon-huo2"></use>-->
                      <!--<use v-else xlink:href="#icon-huo1" ></use>-->
                    </svg>
                  </v-flex>
                </v-layout>
              </v-layout>
            </v-list-item>
          </v-list>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {}
</script>
<style scoped>
.logo {
  width: 300px;
  height: 140px;
  display: block;
}
</style>
