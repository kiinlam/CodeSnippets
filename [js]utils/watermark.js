/**
 * 在指定的Dom元素内添加水印，可以多次调用来刷新水印
 * @param {string[]} textList 水印文字内容，每个数组元素对应一行，建议不超过3行 | default: []
 * @param {string} selector 要添加水印的选择器字符串 | default: body
 * @param {number} width 要添加水印的平铺瓦片高度 | default: 300
 * @param {number} height 要添加水印的平铺瓦片宽度 | default: 200
 * @param {number} fontsize 文字大小，单位px | default: 13
 * @example watermark(['Hello', 'world'])
 * @example watermark(['foo', 'bar'], '.watermark', 400, 300, 14)
 */
export function watermark(textList = [], selector = 'body', width = 300, height = 200, fontsize = 13) {
  // 没有文字内容时不需要设置水印
  const lines = textList.length
  if (lines === 0) return

  // 创建临时canvas元素
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  // 绘制水印图
  let context = canvas.getContext('2d')
  const offset = fontsize * 1.9
  const totalHeight = lines * offset
  context.translate(width / 2, height / 2)
  context.rotate(-25 * Math.PI / 180)
  context.translate(0, -(totalHeight / 2))
  context.font = `lighter ${fontsize}px "Microsoft YaHei", "PingFang SC", "SimSun"`
  context.fillStyle = 'RGB(224, 224, 224)'
  context.textAlign = 'center'
  textList.forEach((text, i) => {
    context.fillText(text, 0, i * offset)
  })
  context.setTransform(1, 0, 0, 1, 0, 0)

  // 创建水印层
  const bg = canvas.toDataURL('image/png')
  const div = document.createElement('div')
  const css = {
    display: 'block',
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url(${bg})`,
    border: 0,
    opacity: 1,
    visibility: 'visible',
    'pointer-events': 'none',
    'z-index': 99999
  }
  let style = ''
  for (const key in css) {
    style += `${key}: ${css[key]}!important;`
  }
  div.style = style

  // 加入水印层
  const self = watermark
  const dom = document.querySelector(selector)
  if (self.el) {
    // 尝试移除原来的水印层
    try {
      self.el.parentNode.removeChild(self.el)
    } catch (e) {
      console.log(e)
    }
  }
  dom.appendChild(div)
  // 保存创建的元素，当再次调用时，需要清除，避免多次调用导致添加了多个水印层
  self.el = div
  // 释放内存
  setTimeout(() => {
    context = undefined
    canvas = undefined
  }, 200)
}
