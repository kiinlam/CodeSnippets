export function blob2File(data, fileName) {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 5000)
}