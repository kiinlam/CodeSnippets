/**
 * useDomRect
 * @description 获取指定dom引用的尺寸信息
 * @param {Ref<Element>} refDom - dom引用
 * @returns {({ rect: Ref<Partial<DOMRect>> }) | ({})} 返回空对象或尺寸
 * @example
 * const tableWrapRef = ref()
 * const { rect: tableRect } = useDomRect(tableWrapRef)
 */
import { Ref, ref, watchEffect } from 'vue'

export function useDomRect(refDom: Ref<Element>): { rect: Ref<Partial<DOMRect>> } {
  const rect: Ref<Partial<DOMRect>> = ref({})
  let resizeObserver: ResizeObserver | null
  watchEffect(() => {
    if (refDom.value) {
      rect.value = refDom.value.getBoundingClientRect()
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          rect.value = entry.contentRect
          console.log('entry.contentRect: ', rect.value)
        }
      })
      resizeObserver.observe(refDom.value)
    } else {
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
    }
  })

  return {
    rect
  }
}
