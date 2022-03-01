// read file from disk
// store a reference to our file handle

async function getFile() {
  let fileHandle;

  // open file picker
  [fileHandle] = await window.showOpenFilePicker();

  if (fileHandle.kind === 'file') {
    console.log('file handle:', fileHandle);

    // get file contents
    const fileData = await fileHandle.getFile();
    
    // use fileReader to read file data
    // or use File.text() to get file content
    // getAsText(fileData);
    fileData.text().then(res => console.log(res));

  } else if (fileHandle.kind === 'directory') {
    // run directory code
    console.log('directory handle:', fileHandle)
  }

}

// https://w3c.github.io/FileAPI/
function getAsText(readFile) {

  var reader = new FileReader();

  // Read file into memory as UTF-16
  reader.readAsText(readFile, "UTF-8");

  // Handle progress, success, and errors
  // reader.onprogress = updateProgress;
  reader.onload = loaded;
  // reader.onerror = errorHandler;
}

function loaded(evt) {
  // Obtain the read file data
  var fileString = evt.target.result;
  console.log(fileString);
}
