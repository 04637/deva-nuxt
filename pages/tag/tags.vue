<template>
  <v-container justify-center align-start>
    <v-flex>
      <v-layout>
        <v-text-field
          hide-details
          label="Search"
          prepend-inner-icon="search"
          outlined
          rounded
        ></v-text-field>
      </v-layout>
      <v-layout wrap class="mt-5">
        <v-flex xs3 style="height: 60px">
          <v-card class="pa-3">
            <v-layout>
              <v-btn x-small elevation text><strong>JAVA</strong></v-btn>
              <span style="height: 20px; line-height: 20px" class="ml-2"
                >× 937</span
              >
            </v-layout>
            <v-layout class="label-description mt-1">
              <v-card-text class="d-inline" title="hello wrold">
                Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。
              </v-card-text>
            </v-layout>
            <v-layout
              style="font-size: 14px"
              class="mt-1"
              justify-space-between
            >
              <v-layout>
                今日使用 15 次
              </v-layout>
              <v-layout justify-end>
                近一周使用 427 次
              </v-layout>
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
.label-description {
  font-size: 14px;
  text-indent: 14px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
