<template>
  <div>
    <v-card flat class="mt-3">
      <v-flex hidden-sm-and-down md6>
        <v-text-field
          v-model="search"
          placeholder="搜索"
          style="width: 300px"
          class="min-input"
          solo
          height="30px"
          hide-details
          append-icon="search"
        ></v-text-field>
      </v-flex>
      <v-layout class="mt-1">
        <v-data-table
          :headers="headers"
          :items="blogs"
          :search="search"
          fixed-header
          style="width: 100%"
        >
          <template #item.title="{item}">
            <router-link
              class="hover-line"
              :to="'/question/' + item.questionId"
              >{{ item.title }}</router-link
            >
          </template>
        </v-data-table>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    blogs: {
      required: true,
      type: Array
    }
  },
  data: () => ({
    search: '',
    headers: [
      {
        text: '标题',
        sortable: false,
        align: 'left',
        value: 'title'
      },
      { text: '喜欢', value: 'likeNum', align: 'center', sortable: false },
      { text: '赞成', value: 'voteNum', align: 'center', sortable: false },
      { text: '浏览', value: 'viewNum', align: 'center', sortable: false }
    ]
  }),
  methods: {}
}
</script>
<style scoped></style>
