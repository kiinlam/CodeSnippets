// 计算文件hash，使用 crypto-js 的 sha-256 算法
import CryptoJS from "crypto-js";

export async function createFileHash(file, chunkSize = 10) {
  const fileSize = file.size;
  chunkSize = chunkSize * 1024 * 1024; // 10MB
  let currentChunk = 0;
  let hasher = CryptoJS.algo.SHA256.create();
  
  while (currentChunk < fileSize) {
    const nextPoint = currentChunk + chunkSize;
    const chunk = file.slice(currentChunk, nextPoint);
    await readChunk(hasher, chunk).then(() => {
      currentChunk = nextPoint;
    });
  }

  const hash = hasher.finalize().toString();
  hasher = null
  return hash
}

async function readChunk(hasher, chunk) {
  await new Promise((resolve) => {
    let reader = new FileReader();
    reader.onload = function (e) {
      let wdArr = CryptoJS.lib.WordArray.create(e.target.result);
      hasher.update(wdArr);
      wdArr = null;
      reader = null;
      resolve();
    };
    reader.readAsArrayBuffer(chunk);
  });
}
