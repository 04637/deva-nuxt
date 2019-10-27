<template>
  <v-list class="pa-0 ma-0 mb-10">
    <transition-group name="list-down">
      <div v-for="blog in blogList" :key="blog.blogId">
        <BlogCard :blog="blog"></BlogCard>
      </div>
    </transition-group>
  </v-list>
</template>
<script>
import BlogCard from './BlogCard'

export default {
  components: {
    BlogCard
  },
  props: {
    blogList: {
      type: Array,
      required: true
    }
  }
}
</script>
