import { camelize } from './index'

const rootKeys = ['id', 'class', 'style']

export default function updateAttrs(attrs) {
  const rootAttrs: Record<string, any> = {}
  const tableAttrs: Record<string, any> = {}
  Object.keys(attrs).forEach(function (k) {
    const v = attrs[k]
    
    if (v !== undefined) {
      const camelizeKey = camelize(k)
      if (rootKeys.includes(camelizeKey)) {
        rootAttrs[camelizeKey] = v
      } else {
        tableAttrs[camelizeKey] = v
      }
    }
  })
  return {
    tableAttrs,
    rootAttrs,
  }
}
