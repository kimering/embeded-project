
import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-dark.css'
Vue.use(MuseUI)

import app from './app.vue'

new Vue(app).$mount('#app')
