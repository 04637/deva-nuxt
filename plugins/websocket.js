// https://www.npmjs.com/package/vue-native-websocket
import VueNativeSock from 'vue-native-websocket'
import Vue from 'vue'
Vue.use(VueNativeSock, 'wss://ws.deva.wiki', {
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  connectManually: true
})
