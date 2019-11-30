<template>
  <v-chip small :to="'/user/' + user.userId" color="white">
    <span class="link_color--text">{{ user.nickname || user.username }}</span
    >&nbsp;<span style="font-weight: bold; color:red">·</span>&nbsp;{{
      user.reputation
    }}
    <!--<v-icon color="red" small title="用户声望">mdi-music-clef-bass</v-icon>-->
  </v-chip>
</template>
<script>
export default {
  props: {
    user: {
      required: true,
      type: Object
    }
  }
}
</script>
