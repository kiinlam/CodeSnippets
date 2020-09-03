import jstorage from './jStorage'

window.jstorage = jstorage

debugger

var windows = jstorage.create({
  name: 'systems',
  storeName: 'windows'
})

var linux = jstorage.create({
  name: 'systems',
  storeName: 'linux'
})

var mac = jstorage.create({
  name: 'systems',
  storeName: 'mac'
})

var javascript = jstorage.create({
  name: 'language',
  storeName: 'javascript'
})

function getText (id) {
  return document.getElementById(id).innerHTML
}
function setText (id, text) {
  document.getElementById(id).innerHTML = text
}

document.getElementById("reset").onclick = reset
function reset() {

  windows.set('person', 'Bill Gates')
  windows.set('status', 'lively')
  windows.set('say', 'I am rich')

  const duration = 20 * 365 * 12 * 3600 * 1000
  linux.set('person', 'Linus Torvalds', {duration})
  linux.set('status', 'retired', {duration})
  linux.set('say', 'Live another 20 years', {duration})

  const expires = -1
  mac.set('person', 'Steve Jobs', {expires})
  mac.set('status', 'gone', {expires})
  mac.set('say', 'Make it simple', {expires})
  
  javascript.set('info', {
    usefor: 'web app',
    say: 'Everything can be javascript'
  })

  setText('reset_result', 'everything has reset')
}

document.getElementById("getAll").onclick = getAll
async function getAll() {
  const text = []

  text.push('<br/>windows : <br/>')
  console.log('before windows', text)
  await windows.forEach((v, k, i) => {
    text.push(`${i}. ${k} = ${JSON.stringify(v)}<br/>`)
  })
  console.log('after windows', text)

  text.push('<br/>linux : <br/>')
  console.log('before linux', text)
  await linux.forEach((v, k, i) => {
    text.push(`${i}. ${k} = ${JSON.stringify(v)}<br/>`)
  })
  console.log('after linux', text)

  text.push('<br/>mac : <br/>')
  console.log('before mac', text)

  await mac.forEach((v, k, i) => {
    text.push(`${i}. ${k} = ${JSON.stringify(v)}<br/>`)
  })

  text.push('<br/>javascript : <br/>')
  await javascript.forEach((v, k, i) => {
    text.push(`${i}. ${k} = ${JSON.stringify(v)}<br/>`)
  })

  setText('get_result', text.join(' '))
}

document.getElementById("getMac").onclick = getMac
function getMac() {
  Promise.all([mac.get('person'), mac.get('status'), mac.get('say')])
    .then(arr => {
      console.log(arr)
      setText('getMac_result', arr.join('<br/>'))
    })
}

document.getElementById("getWindows").onclick = getWindows
function getWindows() {
  const id = 'getWindows_result'
  setText(id, '')
  windows.keys().then(keys => setText(id, getText(id) + 'keys(): [' + keys.join(', ') + ']<br/>'))
  windows.length().then(l => setText(id, getText(id) + 'length(): ' + l + '<br/>'))
  windows.length().then(l => {
    for (let i = 0; i < l; i++) {
      windows.key(i).then(keyname => {
        windows.get(keyname).then(value => setText(id, getText(id) + i + ': ' + keyname + ': ' + JSON.stringify(value) + '<br/>'))
      })
    }
  })
}

document.getElementById("removeSay").onclick = removeSay
function removeSay() {
  const id = 'removeSay_result'
  windows.remove('say').then(() => setText(id, new Date().toLocaleTimeString() + ': key is removed'))
}

document.getElementById("removeAll").onclick = removeAll
function removeAll() {
  const id = 'removeAll_result'
  linux.removeAll().then(() => setText(id, new Date().toLocaleTimeString() + ': all keys are removed'))
}

document.getElementById("dropLinux").onclick = dropLinux
function dropLinux() {
  const id = 'dropLinux_result'
  try {
    linux.drop()
      .then(() => setText(id, new Date().toLocaleTimeString() + ': linux is dropped, '))
  } catch (err) {
    console.log('drop error:')
    console.log(err)
    setText(id, err)
  }
}

document.getElementById("dropSystem").onclick = dropSystem
function dropSystem() {
  const id = 'dropSystem_result'
  try {
    linux.drop({name: 'systems'})
      .then(() => setText(id, new Date().toLocaleTimeString() + ': system is dropped, '))
  } catch (err) {
    console.log('drop error:')
    console.log(err)
    setText(id, err)
  }
}