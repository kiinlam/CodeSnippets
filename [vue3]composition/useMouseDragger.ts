// 鼠标框选
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Rect {
  width: number,
  height: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
}

export function useMouseDragger() {
  const x1 = ref(0)
  const y1 = ref(0)
  const x2 = ref(0)
  const y2 = ref(0)
  const event = ref()
  const active = ref(false)

  const offset = 5
  let minX = 0
  let minY = 0
  let maxX = 0
  let maxY = 0
  let _x1 = 0
  let _y1 = 0
  let selector = 'body'
  let container: Element

  const box = computed(() => {
    const _x1 = x1.value
    const _y1 = y1.value
    const _x2 = x2.value
    const _y2 = y2.value
    return {
      width: Math.abs(_x2 - _x1),
      height: Math.abs(_y2 - _y1),
      left: Math.min(_x1, _x2),
      top: Math.min(_y1, _y2),
      right: Math.max(_x1, _x2),
      bottom: Math.max(_y1, _y2),
      x1: _x1,
      y1: _y1,
      x2: _x2,
      y2: _y2,
      minX,
      minY,
      maxX,
      maxY,
    }
  })

  const meta = computed(() => {
    return {
      container,
      event: event.value,
    }
  })

  function init() {
    active.value = false
    x1.value = 0
    y1.value = 0
    x2.value = 0
    y2.value = 0
  }

  function prepare(e) {
    selector = e._useMouseDragger_
    container = document.querySelector(selector) || document.body
    if (container) {
      const rect = container.getBoundingClientRect()
      minX = rect.left
      minY = rect.top
      maxX = rect.right
      maxY = rect.bottom
    }
    _x1 = e.pageX
    _y1 = e.pageY
  }

  function addListener() {
    window.addEventListener('mousemove', update)
    window.addEventListener('mouseup', end)
  }

  function removeListener() {
    window.removeEventListener('mousemove', update)
    window.removeEventListener('mouseup', end)
  }

  function astrictNum(num, min, max) {
    return Math.min(max, Math.max(min, num))
  }

  function start(e) {
    if (e._useMouseDragger_ && e.button === 0) {
      init()
      prepare(e)
      addListener()
    }
  }

  function update(e) {
    const _x2 = e.pageX
    const _y2 = e.pageY
    if (active.value || Math.abs(_x2 - _x1) > offset || Math.abs(_y2 - _y1) > offset) {
      active.value = true
      x1.value = _x1
      y1.value = _y1
      x2.value = astrictNum(_x2, minX, maxX)
      y2.value = astrictNum(_y2, minY, maxY)
    }
  }

  function end(e) {
    event.value = e
    active.value = false
    removeListener()
  }

  onMounted(() => {
    window.addEventListener('mousedown', start)
  })

  onUnmounted(() => {
    window.removeEventListener('mousedown', start)
  })

  return { active, box, meta }
}

// 碰撞检测：边在x|y轴上的投影是否重叠或包含
export function isCollide(rect1: Rect, rect2: Rect) {
  const maxX = Math.max(rect1.right, rect2.right)
  const maxY = Math.max(rect1.bottom, rect2.bottom)
  const minX = Math.min(rect1.left, rect2.left)
  const minY = Math.min(rect1.top, rect2.top)
  return (
    maxX - minX <= rect1.width + rect2.width &&
    maxY - minY <= rect1.height + rect2.height
  )
}

/**
 * how to use
 */
/**
<template>
  <div
    class="content-list"
    @mousedown="($event) => {$event._useMouseDragger_ = '.content-list'}"
  >
    <long-list :dataSource="fileList"></long-list>
  </div>

  <div
    class="mask"
    v-show="active"
    :style="{
      width: box.width + 'px',
      height: box.height + 'px',
      left: box.left + 'px',
      top: box.top + 'px'
    }"
  ></div>
</template>

<script setup>
import { watch } from 'vue'
import { useMouseDragger, isCollide } from './useMouseDragger'

const { active, box, meta } = useMouseDragger()
watch(active, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    const selectBox = box.value
    const selectMeta = meta.value
    const nodes = []
    selectMeta.container.querySelectorAll('.long-list-item').forEach((node) => {
      const rects = node.getBoundingClientRect()
      if (isCollide(rects, selectBox)) {
        nodes.push(node)
      }
    })
    console.log(nodes)
  }
})
</script>

<style scoped>
.mask {
  position: fixed;
  background: #409eff;
  opacity: 0.4;
  border: 2px dashed #009e94;
  pointer-events: none;
}
</style>

 */