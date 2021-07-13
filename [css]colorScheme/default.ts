/*
  配色方案
  样式规则基于element-ui框架，设计时应参考该框架的变量设计：
  node_modules\element-ui\packages\theme-chalk\src\common\var.scss

  命名规则：
  组件-类别-功能-状态
  如：
  table-icon-del-hover

  新增属性命名前缀时，按字母顺序排序，方便查找

  新增或属性名时，目录下所有配色方案文件都需要对应处理

  属性值存在，但为空，表示需要将此变量属性移除

  TODO：
  - 支持变量依赖解析
  - 支持函数
 */
const scheme = {

  /* 产品属性
  -------------------------- */

  // logo
  logo: {
    'img-url-large': `url(${process.env.VUE_APP_PUBLIC_PATH}logoImg/bzlLogo.png)`,
    'img-url-small': `url(${process.env.VUE_APP_PUBLIC_PATH}logoImg/bzlLogo1.png)`,
    height: '70px',
    shadow: 'none' // logo 投影
  },

  /* 通用属性
  -------------------------- */

  // 背景色
  background: {
    // 基本背景色，通常为白色或淡灰色
    'color-base': '#fff',
    'color-secondary': ''
  },

  // 边线
  border: {
    'color-base': '',
    'color-light': '',
    'color-dark': '',
    'color-hover': '',
    'width-base': '',
    'width-thick': ''
  },

  // 色彩
  color: {
    // 品牌色
    brand: '',
    primary: '#4778FF',
    'primary-light-1': '#5986ff',
    'primary-light-2': '#6c93ff',
    'primary-light-3': '#7ea1ff',
    'primary-light-4': '#91aeff',
    'primary-light-5': '#a3bcff',
    'primary-light-6': '#b5c9ff',
    'primary-light-7': '#c8d7ff',
    'primary-light-8': '#dae4ff',
    'primary-light-9': '#edf2ff',
    success: '',
    'success-light': '',
    warning: '',
    'warning-light': '',
    danger: '',
    'danger-light': '',
    info: '',
    'info-light': '',
    // 品牌色
    'text-brand': '',
    // 基础色
    'text-base': '#333',
    // 主题色
    'text-primary': '',
    'text-secondary': '',
    'text-minor': '#999'
  },

  // 禁用
  disabled: {
    fill: '',
    color: '',
    'border-color': ''
  },

  // 字体
  font: {
    'size-extra-large': '',
    'size-large': '',
    'size-medium': '',
    'size-base': '',
    'size-small': '',
    'size-extra-small': '',
    'weight-base': '',
    'weight-bold': '',
    'weight-light': '',
    'line-height-base': '',
    'line-height-large': '',
    'line-height-small': ''
  },

  // 层级
  // 配合calc可实现增减计算
  // eg:
  // z-index: calc(var(--zindex-top) + 10)
  zindex: {
    base: 1,
    top: 1000,
    popper: 2000
  },

  /* 自定义组件属性
  -------------------------- */

  // 左侧边栏
  sidebar: {
    'width-base': '208px',
    'background-color': '#112F79', // 背景色
    'background-color-hover': '#4778ff',
    'border-left-color-hover': 'transparent', // 一级菜单激活状态左侧竖线
    'background-color-2': '#fff', // 二级弹出层背景色
    'margin-top-2': '0', // 二级弹出层距离顶部距离
    'pad-top-2': '46px', // 二级弹出层距离顶部距离
    'font-color-1': '#fff', // 一级菜单颜色
    'font-color-1-active': '#fff', // 一级菜单颜色
    'font-color-2': '#999', // 二级分类模块文字
    'border-bottom-width-2': '1px', // 二级分类模块下划线
    'pad-vertical-2': '8px', // 三级菜单上下边距
    'pad-horizontal-2': '20px', // 三级菜单左右边距
    'height-3': '45px', // 三级菜单高度
    'font-color-3': '#333', // 三级菜单文字
    'font-color-3-active': '#fff', // 三级菜单激活状态文字
    'background-color-3': '#4778FF' // 三级菜单激活状态背景色
  },

  /* 组件属性
  -------------------------- */

  // 警告
  alert: {},

  // 头像
  avatar: {},

  // 返回顶部
  backtop: {},

  // 标记
  badge: {},

  // 面包屑
  breadcrumb: {
    display: 'inherit' // 面包屑是否显示
  },

  // 按钮
  button: {
    'default-border-color': '#d7d9de', // 默认按钮边框色
    'default-font-color': '#666', // 默认按钮文字颜色
    'primary-background-color': '#4778FF', // primary按钮背景色
    'primary-border-color': '#4778FF', // primary按钮边框色
    'plain-border-color': '#D7D9DE', // 朴素按钮边框色
    'plain-font-color': '#333333', // 朴素按钮文字颜色
    'cross-color': '#999' // “X”关闭按钮颜色
  },

  // 日历
  calendar: {},

  // 级联选择器
  cascader: {},

  // 卡片
  card: {},

  // 走马灯
  carousel: {},

  // 多选框
  checkbox: {},

  // 折叠面板
  collapse: {},

  // 日期选择器
  datepicker: {},

  // 对话框
  dialog: {
    'title-font-color': '#000', // 对话框标题文字颜色
    'footer-border-top': '1px solid #ececec'
  },

  // 下拉菜单
  dropdown: {},

  // 页脚
  footer: {},

  // 表单
  form: {},

  // 页头
  header: {},

  // 输入框
  input: {
    'border-color-light': '#4778FF', // 输入框边框色
    width: '224px'
  },

  // 链接
  link: {
    'color-base': '',
    'color-hover': ''
  },

  // 加载
  loading: {},

  // 页面主体
  main: {
    background: '#F3F5F7',
    'dashboard-height': 'calc(100vh - 48px)'
  },

  // 导航菜单
  menu: {},

  // 消息提示（会自动消失）
  message: {},

  // 消息弹框（有交互按钮）
  msgbox: {},

  navbar: {
    'header-height': '48px'
  },

  // 通知
  notification: {},

  // 分页
  pagination: {
    'border-bottom-color-active': 'transparent', // 当前页激活状态下划线
    'color-base': '#666', // 翻页文字颜色
    'font-size': '14px' // 翻页文字大小
  },

  // 弹出框
  popover: {},

  // 气泡确认框
  popup: {},

  // 单选框
  radio: {},

  // 评分
  rate: {},

  // route
  route: {
    'border-color': '#4778FF'
  },

  // 滚动条
  scrollbar: {},

  // 选择器
  select: {},

  // 滑块
  slider: {
    'button-hover-color': '#4574f7'
  },

  // 步骤条
  steps: {},

  // 开关
  switch: {},

  // 标签页
  tab: {
    'text-color-base': '#666', // Tab标签文字颜色
    'text-color-active': '#4778FF', // Tab标签激活状态文字颜色
    'background-color-base': '#EBEBEB', // Tab标签背景色
    'background-color-active': '#fff', // Tab标签激活状态背景色
    'border-bottom-color-active': '#4778FF', // 卡片式Tab标签激活状态上划线
    'card-border-top-color-active': 'transparent' // 卡片式Tab标签激活状态上划线
  },

  // 表格
  table: {
    'page-height': 'calc(100vh - 120px)',
    'border-color': '#ececec', // 边框色
    'header-background-color': '#fafafa', // 表头背景色
    'td-font-color': '#666', // 单元格文字颜色
    'td-height': '54px', // 单元格高度
    'border-width': '1px', // 单元格右边框宽度
    'td-font-size': '14px' // td单元格字体大小
  },

  // 标签
  tag: {
    'item-height': '40px',
    'item-background': '#EBEBEB',
    'item-fontColor': '#666666',
    'item-borderWidth-active': '0',
    'item-fontColor-active': '#4778FF'
  },

  // 时间线
  timeline: {},

  // 文字提示
  tooltip: {},

  // 穿梭框
  transfer: {},

  // 树形控件
  tree: {}
}

export default scheme
