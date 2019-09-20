<template>
  <v-app>
    <v-layout column shrink>
      <v-card-title>设置</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="px-10">
      <v-layout>
        <v-switch v-model="$vuetify.theme.dark" label="主题切换"></v-switch>
      </v-layout>
    </v-layout>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => (v && v.length >= 8) || 'Min 8 characters'
      }
    }
  }
}
</script>

<style scoped>
.logo {
  width: 100px;
  display: block;
}

.form {
  width: 500px;
  margin-top: 100px;
  border: 1px solid rgb(193, 193, 193);
  padding: 30px;
}
</style>
