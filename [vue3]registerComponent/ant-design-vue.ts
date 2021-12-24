import { App } from 'vue'
// import * as antdv2 from 'ant-design-vue'
// import * as antdvicon from '@ant-design/icons-vue'
import {
  Avatar,
  Button,
  Col,
  Checkbox,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Table,
  Tooltip,
  Tree,
} from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/index'
import 'ant-design-vue/es/modal/style/css'
import 'ant-design-vue/es/notification/style/css'

// 使用 unplugin-vue-components 插件，无需手动注册 src/components 下的组件

const antdvComps = [
  Avatar,
  Button,
  Col,
  Checkbox,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Row,
  Select,
  Spin,
  Switch,
  Table,
  Tooltip,
  Tree,
]

const antdvIcons = [
  ExclamationCircleOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
]

export function registerComponents(app: App) {
  // console.log(antdv2)
  // console.log(antdvicon)
  message.config({ prefixCls: 'ant-bdr-sub-message' })
  antdvComps.forEach((comp: any) => {
    app.use(comp)
  })
  antdvIcons.forEach((comp: any) => {
    app.component(comp.displayName || comp.name, comp)
  })
}
