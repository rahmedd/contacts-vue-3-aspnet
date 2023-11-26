import './assets/main.css'
import './blooma/blooma.scss'
// import 'bulma/css/bulma.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueClickAway from "vue3-click-away"

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueClickAway)

app.mount('#app')
