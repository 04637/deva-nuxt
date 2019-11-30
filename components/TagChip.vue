<template>
  <v-chip
    small
    :color="color"
    text
    style="cursor: pointer; text-decoration: none;border-radius: 1px; font-size: 14px"
    :title="tagInfo.tagName"
    class="text-left my_blue--text"
    :to="'/search/' + tagInfo.tagName + '?match=tags'"
    v-on="von"
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
