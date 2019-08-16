<template>
  <v-container justify-center align-start>
    <v-flex>
      <v-layout>
        <v-text-field
          hide-details
          label="Search"
          outlined
          prepend-inner-icon="search"
          rounded
        ></v-text-field>
      </v-layout>
      <v-layout wrap style="margin-top: 20px">
        <v-flex xs4 style="height: 60px">
          <v-card>
            <v-layout justify-space-between>
              <v-flex xs3>
                <v-layout justify-center>
                  <v-avatar color="grey">
                    <v-img
                      src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
                    ></v-img>
                  </v-avatar>
                </v-layout>
                <v-layout justify-center class="mt-2">
                  <v-btn x-small elevation text to="userProfile"
                    >别叫我小海绵</v-btn
                  >
                </v-layout>
              </v-flex>
              <v-flex xs8>
                <v-layout justify-space-between fill-height column>
                  <v-layout>
                    该用户太懒什么也没留下
                  </v-layout>
                  <v-layout justify-end align-end>
                    <svg class="icon heat-icon" aria-hidden="true">
                      <use xlink:href="#icon-zuanshi"></use></svg
                    >&nbsp;100
                  </v-layout>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-container>
</template>
<script>
export default {}
</script>

<style scoped>
.v-card {
  padding: 8px;
}
</style>
