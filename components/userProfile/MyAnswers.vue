<template>
  <div>
    <v-card flat class="mt-3">
      <v-flex hidden-sm-and-down md6>
        <v-text-field
          v-model="search"
          placeholder="搜索"
          style="width: 300px"
          append-icon="search"
          class="min-input"
          hide-details
          solo
        ></v-text-field>
      </v-flex>
      <v-layout class="mt-1">
        <v-data-table
          :headers="headers"
          :items="answers"
          :search="search"
          fixed-header
          :mobile-breakpoint="-1"
          style="width: 100%"
        >
          <template #item.questionTitle="{item}">
            <router-link
              class="hover-line"
              :to="'/question/' + item.ownQuestionId + '#' + item.answerId"
              >{{ item.questionTitle }}</router-link
            >
          </template>
          <template #item.isAccepted="{item}">
            <v-icon v-if="item.isAccepted" color="success" title="已采纳"
              >check</v-icon
            >
            <v-icon v-else color="error" title="未采纳">minimize</v-icon>
          </template>
        </v-data-table>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    answers: {
      required: true,
      type: Array
    }
  },
  data: () => ({
    search: '',
    headers: [
      {
        text: '问题标题',
        align: 'left',
        sortable: false,
        value: 'questionTitle'
      },
      { text: '赞成', value: 'voteNum', sortable: false, align: 'center' },
      {
        text: '采纳状态',
        value: 'isAccepted',
        sortable: false,
        align: 'center'
      }
    ]
  }),
  methods: {}
}
</script>

<style scoped></style>
