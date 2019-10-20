<template>
  <v-chip
    small
    :color="color"
    text
    style="max-width:170px; cursor: pointer; text-decoration: none;border-radius: 0"
    :title="tagInfo.tagName"
    class="d-inline-block text-truncate text-left no-flex"
    :to="'/search/' + tagInfo.tagName + '?match=tags'"
    v-on="von"
  >
    <span style="font-size: 14px">{{ tagInfo.tagName }}</span></v-chip
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
      default: 'primary'
    },
    von: {
      required: false,
      type: Object,
      default: null
    }
  }
}
</script>
<style scoped>
.theme--light.v-chip {
  color: white !important;
}
</style>
