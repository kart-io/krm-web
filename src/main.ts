import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import installUI from './plugins/ui'

const app = createApp(App)

app.use(createPinia())
app.use(router)
installUI(app)

app.mount('#app')
