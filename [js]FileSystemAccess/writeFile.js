// write data into file on disk

// https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
// https://blog.meathill.com/js/use-file-system-access-api-to-handle-local-files.html

let fileHandle;
async function getFile() {
  // open file picker
  [fileHandle] = await window.showOpenFilePicker();

  if (fileHandle.kind === 'file') {
    console.log('file handle:', fileHandle);

    // create a FileSystemWritableFileStream to write to
    const writableStream = await fileHandle.createWritable();

    // write our file
    await writableStream.write('1234567890');

    // close the file and write the contents to disk.
    await writableStream.close();
    
  } else if (fileHandle.kind === 'directory') {
    // run directory code
    console.log('directory handle:', fileHandle)
  }

}
