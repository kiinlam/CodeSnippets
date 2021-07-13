/**
 * 统一注册组件
 */
import {
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Menu,
  message,
  Select,
  Spin,
  Switch,
  Table,
  Tabs,
} from 'ant-design-vue'

import {
  EllipsisOutlined,
  LoadingOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'

import { App } from 'vue'

const compList = [
  // 组件
  // 使用方法，在组件名前加上`A`，如`<AAvatar />`
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  Input,
  Input.Search,
  Menu,
  Menu.Item,
  Select,
  Select.Option,
  Spin,
  Switch,
  Tabs,
  Tabs.TabPane,
  Table,

  // 图标
  // 使用方法，直接使用，如`<TeamOutlined />`
  EllipsisOutlined,
  LoadingOutlined,
  SearchOutlined,
  TeamOutlined,
]

export function globalConfig(app: App) {
  console.groupCollapsed('Click here to show all Components')
  compList.forEach((comp: any) => {
    console.log(comp.displayName || comp.name)
    app.component(comp.displayName || comp.name, comp)
    // app.use(comp) // 注册图标组件会报错，不使用
  })
  console.groupEnd()

  // 注册message组件方法
  // 使用方法：
  // import { getCurrentInstance } from 'vue'
  // const global = getCurrentInstance()?.appContext.config.globalProperties
  // global?.$message.warn('warnning')
  message.config({ prefixCls: 'ant-bdr-sub-message' })
  app.config.globalProperties.$message = message
}
