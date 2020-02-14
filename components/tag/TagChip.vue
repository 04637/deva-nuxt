<template>
  <v-chip
    :title="tagInfo.tagName"
    :to="'/search/' + tagInfo.tagName + '?match=tags'"
    v-on="von"
    small
    color="rgba(221, 238, 255, 0.5411764705882353)"
    text
    style="cursor: pointer; text-decoration: none;border-radius: 3px; font-size: 13px !important;"
    class="text-left my_blue--text"
  >
    {{ tagInfo.tagName }}</v-chip
  >
</template>
<script>
export default {
  props: {
    tagInfo: {
      required: true,
      type: Object
    },
    color: {
      required: false,
      type: String,
      default: 'light_blue'
    },
    von: {
      required: false,
      type: Object,
      default: null
    }
  }
}
</script>
<style scoped></style>
