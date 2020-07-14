// 使用范例
import { useMousePosition } from './MouseTracker'

export default {
  setup() {
    const { x, y } = useMousePosition()
    // 其他逻辑...
    return { x, y }
  },
}