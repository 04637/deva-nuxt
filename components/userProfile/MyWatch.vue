<template>
  <div>
    <v-card flat>
      <v-layout wrap shrink class="mt-3">
        <UserCard
          v-for="userInfo in users"
          :key="userInfo.userId"
          :user-info="userInfo"
        ></UserCard>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import UserCard from '../UserCard'
export default {
  components: { UserCard },
  props: {
    users: {
      required: true,
      type: Array
    }
  },
  data: () => ({}),
  methods: {}
}
</script>

<style scoped></style>
