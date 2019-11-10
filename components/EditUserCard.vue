<template>
  <v-layout justify-end style="width: 220px;max-width: 220px">
    <v-card
      style="width: 100%"
      class="pt-3 pr-2 pb-1 user_card"
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
          <v-layout column align-end justify-space-between style="height:100%">
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
