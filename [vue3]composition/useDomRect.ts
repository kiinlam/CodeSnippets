/**
 * useDomRect
 */
import { reactive, Ref, ref, toRefs, watchEffect } from 'vue'

export function useDomRect(refDom: Element) {
  const rect: Ref<Partial<DOMRect>> = ref({})
  if (refDom) {
    rect.value = refDom.getBoundingClientRect()
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        console.log('entry: ', entry)
      }
    })
    resizeObserver.observe(refDom)
  }

  return rect
}
