<template>
  <div>
    <nuxt-link
      :to="'/user/' + user.userId"
      class="d-xs-block d-sm-block d-md-none d-lg-none blue--text"
      >{{ user.nickname }}</nuxt-link
    >
    <v-layout
      class="hidden-sm-and-down"
      justify-end
      style="width: 220px;max-width: 220px"
    >
      <v-card
        style="width: 100%"
        class="pt-3 pr-2 pb-2 user_card no-shadow-box"
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
<style>
.theme--light .no-shadow-box {
  box-shadow: none;
  border: 1px solid #e7e7e7;
}
.theme--dark .no-shadow-box {
  box-shadow: none;
  border: 1px solid #4b4b4b;
}
</style>
