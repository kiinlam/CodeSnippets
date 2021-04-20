/**
 * 在指定的Dom元素内添加水印，可以多次调用来刷新水印
 * @param {object} options 水印参数配置项
 * @param {string[]} options.lines 水印文字内容，每个数组元素对应一行，建议不超过3行 | default: []
 * @param {string} options.selector 要添加水印的选择器字符串 | default: body
 * @param {number} options.width 要添加水印的平铺瓦片高度 | default: 300
 * @param {number} options.height 要添加水印的平铺瓦片宽度 | default: 200
 * @param {number} options.fontsize 文字大小，单位px | default: 13
 * @param {number} options.rotate 水印倾斜角度，逆时针方向，单位度 | default: 45
 * @param {string} options.color 水印颜色，canvas支持的颜色 | default: #e0e0e0
 * @example watermark(['Hello', 'world'])
 * @example watermark(['foo', 'bar'], '.watermark', { width: 400, height: 300, fontsize: 16 })
 */
export function watermark(options = {}) {
  const self = watermark
  const { lines = [], selector = 'body', width = 300, height = 200, fontsize = 13, rotate = 45, color = '#e0e0e0' } = options

  // 没有文字内容时不需要设置水印
  const l = lines.length
  if (l === 0) return

  // 创建临时canvas元素
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  // 绘制水印图
  let context = canvas.getContext('2d')
  const offset = fontsize * 1.9
  const totalHeight = l * offset
  context.translate(width / 2, height / 2)
  context.rotate(-1 * rotate * Math.PI / 180)
  context.translate(0, -(totalHeight / 2))
  context.font = `lighter ${fontsize}px "STFangsong", "Microsoft YaHei", "PingFang SC", "SimSun"`
  context.fillStyle = color
  context.textAlign = 'center'
  lines.forEach((text, i) => {
    context.fillText(text, 0, i * offset)
  })
  context.setTransform(1, 0, 0, 1, 0, 0)

  // 创建水印层
  const bg = canvas.toDataURL('image/png')
  const tags = 'a|b|div|em|i|p|small|span|u'.split('|')
  const tag = tags[Math.floor(Math.random() * tags.length)]
  const node = document.createElement(tag)
  const id = `${tag}${new Date().getTime()}`
  const css = {
    display: 'block',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bg})`,
    border: 0,
    opacity: 1,
    visibility: 'visible',
    '-webkit-pointer-events': 'none',
    '-moz-pointer-events': 'none',
    '-ms-pointer-events': 'none',
    'pointer-events': 'none',
    'z-index': 99999
  }
  let style = ''
  for (const key in css) {
    style += `${key}: ${css[key]}!important;`
  }
  node.id = id
  node.style = style

  // 加入水印层
  const dom = document.querySelector(selector)
  if (self._id) {
    // 尝试移除原来的水印层
    // 先尝试通过id获取，id可能被修改，则使用缓存的数据
    try {
      const old = document.querySelector(`#${self._id}`) || self._el
      self._el = null
      // 如果dom节点被移除，会导致获取不到父节点
      old.parentNode.removeChild(old)
    } catch (e) {
      console.log(e)
      self._id = ''
      self._el = null
    }
  }
  dom.appendChild(node)

  // 保存创建的元素，当再次调用时，需要清除，避免多次调用导致添加了多个水印层
  self._id = id
  self._el = node

  // 防止水印被修改
  function reDraw(e) {
    // console.log(e)
    const target = e.target || e[0].target
    // 清理事件绑定，避免重复触发
    ob.disconnect()
    target.removeEventListener('DOMNodeRemoved', reDraw)
    // 重要判断，防止死循环
    self._el && self(options)
  }
  // 节点移除监听 DOMNodeRemoved 为 DOM level 3 规范
  node.addEventListener('DOMNodeRemoved', reDraw)
  // 节点属性修改为 DOM level 4 规范，使用 MutationObserver 来创建
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  const ob = new MutationObserver(reDraw)
  ob.observe(node, { attributes: true })

  // 释放内存
  setTimeout(() => {
    context = undefined
    canvas = undefined
  }, 200)
}
