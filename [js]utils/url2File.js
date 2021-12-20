export function url2File(url) {
  const link = document.createElement('a')
  link.download = 'fileName'
  link.style.display = 'none'
  link.target = '_top'
  link.href = url
  document.body.appendChild(link)
  link.click()
  setTimeout(function () {
    URL.revokeObjectURL(link.href) // 释放URL对象
    document.body.removeChild(link)
  }, 1500)
}