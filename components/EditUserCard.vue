<template>
  <div class="right-box">
    <v-layout
      class="my_gray--text d-sm-block d-md-none d-lg-none"
      style="font-size: 0.9rem"
      ><nuxt-link
        :to="'/user/' + user.userId"
        class="d-xs-block hover-line  blue--text"
        >{{ user.nickname }}</nuxt-link
      >&nbsp;·&nbsp;{{ createTime | timeago }}</v-layout
    >

    <v-layout justify-end>
      <v-card
        style="width: 100%"
        flat
        class="pt-3 pr-2 pb-2 user_card"
        :to="'/user/' + user.userId"
      >
        <v-layout justify-space-between>
          <v-flex xs5>
            <v-layout justify-center>
              <v-avatar color="grey">
                <v-img :src="user.avatar"></v-img>
              </v-avatar>
            </v-layout>
            <v-layout justify-center class="mt-2">
              <span class="subtitle-2 text-no-wrap text-truncate d-block">{{
                user.nickname || user.username
              }}</span>
            </v-layout>
          </v-flex>
          <v-flex xs7>
            <v-layout
              column
              align-end
              justify-space-between
              style="height:100%"
            >
              <v-layout>
                <small :title="$options.filters.moment(createTime)">
                  {{ prefix }}于&nbsp; {{ createTime | timeago }}</small
                >
              </v-layout>
              <v-layout v-if="createTime !== modifiedTime">
                <small :title="$options.filters.moment(modifiedTime)">
                  更新于&nbsp;
                  {{ modifiedTime | timeago }}</small
                ></v-layout
              >
              <v-layout justify-end align-end>
                <v-layout align-center>
                  <v-chip small color="light_yellow">
                    <v-icon small color="red" title="用户声望"
                      >mdi-music-clef-bass</v-icon
                    >&nbsp;{{ user.reputation }}
                  </v-chip>
                </v-layout>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      required: true,
      type: Object
    },
    createTime: {
      required: true,
      type: Number
    },
    modifiedTime: {
      required: true,
      type: Number
    },
    prefix: {
      required: false,
      type: String,
      default: '创建'
    }
  }
}
</script>
<style></style>
