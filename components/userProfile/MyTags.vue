<template>
  <div>
    <v-card flat>
      <v-layout wrap shrink class="mt-3">
        <TagCard
          v-for="tagInfo in likeTagList"
          :key="tagInfo.tagId"
          :tag-info="tagInfo"
          :show-love="false"
          :show-count="false"
        >
        </TagCard>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import TagCard from '../TagCard'
export default {
  components: { TagCard },
  props: {
    userId: {
      required: true,
      type: String
    }
  },
  data: () => ({
    likeTagList: null
  }),
  created() {
    this.loadLikeTags()
  },
  methods: {
    loadLikeTags() {
      this.$axios
        .$post('/tagLike/listOtherLikeTags', {
          userId: this.$route.params.id
        })
        .then((resp) => {
          this.likeTagList = resp.data
        })
    }
  }
}
</script>

<style scoped></style>
