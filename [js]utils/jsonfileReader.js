const fs = require('fs')

function readJSONFile(filename) {
  const data = fs.readFileSync(`jsonfiles/${filename}.json`).toString()
  const json = JSON.parse(data)
  return json
}