import { camelize } from './index'

export default function resolveAttrs(attrs) {
  const _attrs: Record<string, any> = {}
  Object.keys(attrs).forEach(function (k) {
    const v = attrs[k]
    
    if (v !== undefined) {
      const camelizeKey = camelize(k)
      _attrs[camelizeKey] = v
    }
  })
  return _attrs
}
