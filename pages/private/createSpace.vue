<template>
  <v-container justify-center align-start>
    <v-layout column>
      <v-card-title>空间创建</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center>
      <v-card class="pa-8 mt-6" width="520px">
        <v-form>
          <v-layout justify-center>
            <img src="/deva.png" alt="" class="logo-md" />
          </v-layout>
          <v-layout justify-space-around column class="mt-3">
            <v-layout class="mt-4">
              <v-text-field
                hint="空间的名称，不能重复"
                :counter="20"
                label="空间名"
                outlined
                required
                :rules="[rules.required, rules.min]"
              ></v-text-field>
            </v-layout>
            <v-layout class="mt-4">
              <v-text-field
                hint="其他用户可通过空间名和密码加入该空间"
                :counter="16"
                label="空间密码"
                outlined
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :rules="[rules.required, rules.min]"
                :type="show ? 'text' : 'password'"
                name="input-10-1"
                required
                @click:append="show = !show"
              ></v-text-field>
            </v-layout>
            <v-layout class="mt-4">
              <v-textarea
                hint="空间的简短描述"
                :counter="200"
                label="空间描述"
                outlined
                required
                no-resize
              ></v-textarea>
            </v-layout>
            <v-layout justify-end class="mt-4">
              <v-btn outlined accent depressed min-width="150px"
                >创建空间</v-btn
              >
            </v-layout>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
  </v-container>
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

<style scoped></style>
