<template>
  <v-card class="pa-2">
    <v-toolbar dense flat class="mb-1">
      <span>{{ spaceInfo.spaceName }}</span>
      <v-row justify="end">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              small
              color="private"
              v-on="on"
              @click="batchAdd.dialog = true"
              ><strong>封禁</strong></v-btn
            >
          </template>
          <span>逻辑释放该空间</span>
        </v-tooltip>
      </v-row>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list subheader>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          空间成员：{{ spaceInfo.memberNum }}
          人
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                :to="'/space/userView?spaceId=' + spaceInfo.spaceId"
                v-on="on"
                ><v-icon>mdi-account-search</v-icon></v-btn
              >
            </template>
            <span>查看所有成员信息</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>mdi-comment-question</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          发布问题：{{ spaceInfo.questionNum }}
          个
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>mdi-comment-check</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          解决问题：{{ spaceInfo.solvedNum }}
          个
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-avatar>
          <strong>ID</strong>
        </v-list-item-avatar>
        <v-list-item-content title="空间ID"
          ><v-layout class="primary--text" align-center>
            <strong>{{ spaceInfo.spaceId }}</strong
            ><v-btn
              v-clipboard:copy="spaceInfo.spaceId"
              style="position: relative; top: -6px"
              icon
              x-small
              title="复制空间ID"
              ><v-icon x-small>mdi-content-copy</v-icon></v-btn
            ></v-layout
          >
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-textarea hide-details solo readonly :value="spaceInfo.description">
      </v-textarea>
    </v-list>
  </v-card>
</template>
<script>
export default {
  props: {
    spaceInfo: {
      required: true,
      type: Object
    }
  }
}
</script>
