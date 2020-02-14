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
          :items="questions"
          :search="search"
          :mobile-breakpoint="-1"
          fixed-header
          style="width: 100%"
        >
          <template #item.title="{item}">
            <router-link
              :to="'/question/' + item.questionId"
              class="hover-line"
              >{{ item.title }}</router-link
            >
          </template>
          <template #item.status="{item}">
            <v-icon v-if="item.status === 1" color="success" title="已解决"
              >check</v-icon
            >
            <v-icon v-else color="error" title="待解决">minimize</v-icon>
          </template>
        </v-data-table>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    questions: {
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
      { text: '解决状态', value: 'status', align: 'center', sortable: false },
      { text: '回答', value: 'answerNum', align: 'center', sortable: false },
      { text: '赞成', value: 'voteNum', align: 'center', sortable: false },
      { text: '浏览', value: 'viewNum', align: 'center', sortable: false }
    ]
  }),
  methods: {}
}
</script>
<style scoped></style>
