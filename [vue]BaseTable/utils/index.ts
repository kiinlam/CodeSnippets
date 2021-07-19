// const cacheStringFunction = function cacheStringFunction(fn) {
//   const cache = Object.create(null)
//   return function (str) {
//     const hit = cache[str]
//     return hit || (cache[str] = fn(str))
//   }
// }

// const onRE = /^on[^a-z]/
// const isOn = function isOn(key) {
//   return onRE.test(key)
// }

// // 转为驼峰
// const camelizeRE = /-(\w)/g
// const camelize = cacheStringFunction(function (str) {
//   return str.replace(camelizeRE, function (_, c) {
//     return c ? c.toUpperCase() : ''
//   })
// })

// // 转为连词
// const hyphenateRE = /\B([A-Z])/g
// const hyphenate = cacheStringFunction(function (str) {
//   return str.replace(hyphenateRE, '-$1').toLowerCase()
// })

// // 转为大写
// const capitalize = cacheStringFunction(function (str) {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// })

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key)
}

const isEmptyObject = function isEmptyObject(value) {
  for (let key in value) {
    if (hasOwn(value, key)) {
      return false
    }
  }
  return true
}

/**
 * check value is empty or not
 * @description if value is oneof '' | null | undefined | NaN | [] | {}, then it is empty
 * @param {any} value value to be check
 * @returns {boolean} true if value is empty, otherwise false
 */
const isEmpty = function isEmpty(value) {
  if (
    (typeof value === 'string' && value.trim() === '') ||
    value === null ||
    value === undefined ||
    (typeof value === 'number' && isNaN(value)) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && isEmptyObject(value))
  )
    return true
  return false
}

const isValueNil = function isValueNil(val) {
  return val === undefined || val === null
}

export {
  // isOn,
  // camelize,
  // hyphenate,
  // capitalize,
  hasOwn,
  isEmptyObject,
  isEmpty,
  isValueNil,
}
