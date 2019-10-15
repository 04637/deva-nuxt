<template>
  <SpaceCardList
    v-if="spaceInfoList"
    :space-info-list="spaceInfoList"
  ></SpaceCardList>
</template>
<script>
import SpaceCardList from '../../components/SpaceCardList'
export default {
  components: { SpaceCardList },
  data: () => ({
    spaceInfoList: null,
    keywords: null,
    page: {
      current: 1,
      size: 30
    }
  }),
  created() {
    this.loadSpaceList()
  },
  methods: {
    loadSpaceList() {
      if (this.$store.getters.isAdmin) {
        this.$axios
          .$post('/admin/getSpaceList', {
            current: this.page.current,
            size: this.page.size,
            keywords: this.keywords
          })
          .then((resp) => {
            if (resp.succeed) {
              this.spaceInfoList = resp.data.records
              console.log(this.spaceInfoList)
            }
          })
      }
    }
  }
}
</script>
