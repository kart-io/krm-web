import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// VxeTable
import VxeUITable from 'vxe-table'
import VxeUITooltip from 'vxe-pc-ui/es/tooltip'
import 'vxe-table/lib/style.css'

// Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VxeUITable)
app.use(VxeUITooltip)
app.use(Antd)

app.mount('#app')
