import type { App } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import VxeUITable from 'vxe-table'
import VxeUITooltip from 'vxe-pc-ui/es/tooltip'
import 'vxe-table/lib/style.css'

// 基础全局组件（示例）
import BasicModal from '@/components/modal/BasicModal.vue'
import BaseForm from '@/components/form/BaseForm.vue'

export function installUI(app: App) {
  // Ant Design Vue
  app.use(Antd)

  // VXE Table
  app.use(VxeUITable)
  app.use(VxeUITooltip)

  // 基础通用组件
  app.component('BasicModal', BasicModal)
  app.component('BaseForm', BaseForm)
}

export default installUI


