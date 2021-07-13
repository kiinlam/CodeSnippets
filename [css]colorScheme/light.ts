/*
  配色方案
  详细说明见 default.ts 文件
 */
const scheme = {

  /* 产品属性
  -------------------------- */

  // logo
  logo: {
    'img-url-large': `url(${process.env.VUE_APP_PUBLIC_PATH}logoImg/sgLogo.png)`,
    'img-url-small': `url(${process.env.VUE_APP_PUBLIC_PATH}logoImg/sgLogo1.png)`,
    height: '60px',
    shadow: '0px 1px 2px 0px #0015292e'
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
    primary: '#00ABD5',
    'primary-light-1': '#1ab3d9',
    'primary-light-2': '#33bcdd',
    'primary-light-3': '#4dc4e2',
    'primary-light-4': '#66cde6',
    'primary-light-5': '#80d5ea',
    'primary-light-6': '#99ddee',
    'primary-light-7': '#b3e6f2',
    'primary-light-8': '#cceef7',
    'primary-light-9': '#e6f7fb',
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
    'text-base': '#2b2f37',
    // 主题色
    'text-primary': '',
    'text-secondary': '',
    'text-minor': '#8EA3B8'
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
    'width-base': '200px',
    'background-color': '#fff',
    'background-color-hover': '#F3FAFC',
    'border-left-color-hover': '#00ABD5',
    'background-color-2': '#F7F8FA',
    'margin-top-2': '60px',
    'pad-top-2': '20px',
    'font-color-1': '#2B2F37',
    'font-color-1-active': '#00ABD5',
    'font-color-2': '#2B2F37',
    'border-bottom-width-2': '0px',
    'pad-vertical-2': '8px',
    'pad-horizontal-2': '0px',
    'height-3': 'auto',
    'font-color-3': '#888D95',
    'font-color-3-active': '#00ABD5',
    'background-color-3': 'transparent'
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
    display: 'none'
  },

  // 按钮
  button: {
    'default-border-color': '#8EA3B8',
    'default-font-color': '#2B2F37',
    'primary-background-color': 'linear-gradient(135deg,#4dc4e2,#00abd5)',
    'primary-border-color': '#4dc4e2', // primary按钮边框色
    'plain-border-color': '#00ABD5',
    'plain-font-color': '#00ABD5',
    'cross-color': '#9C9FA7'
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
    'title-font-color': '#2B2F37',
    'footer-border-top': 'none'
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
    'border-color-light': '#4dc4e2',
    width: '220px'
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
    background: '#EBF1F4',
    'dashboard-height': 'calc(100vh - 60px)'
  },

  // 导航菜单
  menu: {},

  // 消息提示（会自动消失）
  message: {},

  // 消息弹框（有交互按钮）
  msgbox: {},

  navbar: {
    'header-height': '60px'
  },

  // 通知
  notification: {},

  // 分页
  pagination: {
    'border-bottom-color-active': '#00ABD5',
    'color-base': '#8EA3B8',
    'font-size': '12px'
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
    'border-color': '#00ABD5'
  },

  // 滚动条
  scrollbar: {},

  // 选择器
  select: {},

  // 滑块
  slider: {
    'button-hover-color': '#00a6cf'
  },

  // 步骤条
  steps: {},

  // 开关
  switch: {},

  // 标签页
  tab: {
    'text-color-base': '#383D47',
    'text-color-active': '#383D47',
    'background-color-base': '#fff',
    'background-color-active': '#fff',
    'border-bottom-color-active': '#00ABD5',
    'card-border-top-color-active': '#00ABD5'
  },

  // 表格
  table: {
    'page-height': 'calc(100vh - 126px)',
    'border-color': '#E9EDF2',
    'header-background-color': '#E9EDF2',
    'td-font-color': '#3E4451',
    'td-height': '48px', // 单元格高度
    'border-width': '0', // 单元格右边框宽度
    'td-font-size': '12px' // td单元格字体大小
  },

  // 标签
  tag: {
    'item-height': '36px',
    'item-background': '#FFFFFF',
    'item-fontColor': '#383D47',
    'item-borderWidth-active': '100%',
    'item-fontColor-active': '#383D47'
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
