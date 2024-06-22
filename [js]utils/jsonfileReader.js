// commonJS: use require
const fs = require('fs')

function readJSONFile(filename) {
  const data = fs.readFileSync(`jsonfiles/${filename}.json`).toString()
  const json = JSON.parse(data)
  return json
}

// ES module: use import
import fs from "fs";

function readJSONFile(filename) {
  let data = fs.readFileSync(`jsonfiles/${filename}.json`).toString();
  return JSON.parse(json);
}
