import { Message } from 'element-ui'

export interface ISchemes {
  id: string
  name: string
}

const storeKey = 'colorScheme'

// 配色方案列表，新增配色方案后，需要在此处注册方案信息
export const schemes: ISchemes[] = [
  {
    // 配色方案id，建议与文件名一致
    id: 'default',
    // 外显命名
    name: '默认'
  },
  {
    // 配色方案id，建议与文件名一致
    id: 'light',
    // 外显命名
    name: '亮色'
  }
]

/*
 注册配色方案主题，目前不需要用到
 */
// function registerColorScheme() {}

/*
 从本地存储获取主题id
 */
export function getSchemeId(): string {
  return localStorage.get(storeKey) || 'default'
}

/*
 将主题id存储到本地存储
 */
function setSchemeId(id: string): void {
  localStorage.set(storeKey, id)
}

/*
 实现配色的核心方法
 */
function handleConfig(config: object): void {
  for (const [k, v] of Object.entries(config)) {
    for (const [prop, value] of Object.entries(v)) {
      if (value) {
        document.documentElement.style.setProperty(`--${k}-${prop}`, `${value}`)
      } else {
        document.documentElement.style.removeProperty(`--${k}-${prop}`)
      }
    }
  }
}

/*
 切换主题
 */
export function switchColorScheme(id: string): void {
  // 打包不包含index文件
  // 打包到单独文件
  // 以下块注释内容用于webpack打包配置，不可删除
  import(
    /* webpackExclude: /^index/ */
    /* webpackMode: "lazy" */
    `./${id}`
  ).then(({ default: config }) => {
    if (!config) {
      Message.error('当前主题不存在')
      return
    }
    handleConfig(config)
    // 配置获取成功后才将主题id存储
    setSchemeId(id)
  }).catch(error => {
    console.log(error)
    Message.error('主题设置失败')
  })
}

/*
 初始化设置主题，默认值为 default 主题
 */
export function initColorScheme(): void {
  const id = getSchemeId()
  switchColorScheme(id)
}
