export async function getFilesFromDataTransferItems(
  dataTransferItems,
  path = ''
) {
  const readFile = (entry, path = '') => {
    return new Promise((resolve, reject) => {
      entry.file(
        (file) => {
          file.filepath = path + file.name // save full path
          resolve(file)
        },
        (err) => {
          console.warn(err)
          reject(err)
        }
      )
    })
  }

  const dirReadEntries = (dirReader, path) => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries(
        async (entries) => {
          let files: any[] = []
          for (let entry of entries) {
            const itemFiles = await getFilesFromEntry(entry, path)
            files = files.concat(itemFiles)
          }
          resolve(files)
        },
        (err) => {
          console.warn(err)
          reject(err)
        }
      )
    })
  }

  const readDir = async (entry, path) => {
    const dirReader = entry.createReader()
    const newPath = path + entry.name + '/'
    let files = []
    let newFiles
    do {
      newFiles = await dirReadEntries(dirReader, newPath)
      files = files.concat(newFiles)
    } while (newFiles.length > 0)
    return files
  }

  const getFilesFromEntry = async (entry, path = '') => {
    if (entry.isFile) {
      const file = await readFile(entry, path)
      return [file]
    }
    if (entry.isDirectory) {
      throw Object.assign(new Error('不支持上传文件夹'), {
        code: 'ERR_FILES_ADD_FAILED',
      })
      const files = await readDir(entry, path)
      return files
    }
    return []
  }

  let files: any[] = []
  let entries: any[] = []

  // Pull out all entries before reading them
  for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
    entries.push(dataTransferItems[i].webkitGetAsEntry())
  }

  // Recursively read through all entries
  for (let entry of entries) {
    const newFiles = await getFilesFromEntry(entry, path)
    files = files.concat(newFiles)
  }

  return files
}

let isDropping = false
const onDragover = (e) => {
  e.preventDefault()
  isDropping = true
}
const onDragleave = (e) => {
  e.preventDefault()
  isDropping = false
}
const onDrop = async (e) => {
  e.preventDefault()
  isDropping = false
  const droppedFiles: DataTransferItemList = e.dataTransfer.items
  if ([...droppedFiles].every(({ kind }) => kind === 'string')) return
  const files = await getFilesFromDataTransferItems(droppedFiles)
}