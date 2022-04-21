// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle
function main() {
  var elem = document.body;
  elem.addEventListener('dragover', (e) => {
    // Prevent navigation.
    e.preventDefault();
  });
  elem.addEventListener('drop', async (e) => {
    // Prevent navigation.
    e.preventDefault();

    // Process all of the items.
    for (const item of e.dataTransfer.items) {
      console.log('item: ', item);
      // kind will be 'file' for file/directory entries.
      if (item.kind === 'file') {
        console.log('file: ', item);
        // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle
        const entry = await item.getAsFileSystemHandle(); // 使用该方法后会导致items变为0个元素
        if (entry.kind === 'file') {
          // run code for if entry is a file
          console.log('file: ', item);
        } else if (entry.kind === 'directory') {
          // run code for is entry is a directory
          console.log('directory: ', item);
        }
      } else {
        console.log('not file')
      }
    }
  });
}
main();