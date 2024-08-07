export function downloadFile(options) {
  const {
    url,
    filename = 'download',
    MIME = 'video/mp4',
    responseType = 'arraybuffer',
    onPrepare,
    onStart,
    onProgress,
    onSuccess,
    onFail,
    onDone,
    onError
  } = options
  
  if (typeof onPrepare === 'function') {
    const before = onPrepare(options)
    if (before === false) {
      return
    }
  }

  if (typeof onStart === 'function') {
    onStart(options)
  }

  let xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = responseType
  xhr.onprogress = function (e) {
    let percent = Math.floor((e.loaded / e.total) * 100) // 下载进度

    if (typeof onProgress === 'function') {
      onProgress(xhr, percent)
    }
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        if (typeof onSuccess === 'function') {
          onSuccess(xhr)
        }
        const blob = new Blob([xhr.response], { type: MIME })
        const downLoadLink = document.createElement('a')
        downLoadLink.download = filename
        downLoadLink.href = URL.createObjectURL(blob)
        downLoadLink.click()
        URL.revokeObjectURL(downLoadLink.href)
      } else if (xhr.status >= 400) {
        if (typeof onFail === 'function') {
          onFail(xhr)
        }
      }
      if (typeof onDone === 'function') {
        onDone(xhr)
      }
    }
  }
  if (typeof onError === 'function') {
    xhr.onerror = onError
  }
  xhr.send()
}
