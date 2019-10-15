<template>
  <v-list>
    <v-list-item v-for="spaceInfo in spaceInfoList" :key="spaceInfo.spaceId">
      <v-card>{{ spaceInfo.spaceName }}</v-card>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  props: {
    spaceInfoList: {
      required: true,
      type: Array
    }
  }
}
</script>
