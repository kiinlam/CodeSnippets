/**
 * jStorage
 * 扩展localForage，简化部分api命名，增加设置数据有效期功能
 */

/**
 * localForage: https://github.com/localForage/localForage
 * document: https://localforage.github.io/localForage
 * document(chinese): https://localforage.docschina.org
 */
import localforage from 'localforage'

/**
 * config
 * 同步方法，设置 localForage 选项。
 * 通常只需设置数据库名`name`、数据表名`storeName`，其他使用默认值即可。
 * `name`默认值为`localforage`
 * `storeName`默认值为`keyvaluepairs`
 */

/**
 * get
 * 根据键名获取数据表中指定键的值。
 * 不存在时返回null
 */

/**
 * set
 * 以键值对的形式向数据表插入一条数据
 */

/**
 * remove
 * 删除数据表中指定键值对
 */

/**
 * removeAll
 * 删除数据表中所有记录
 */

/**
 * length
 * 获取数据表中记录的总数
 */

/**
 * key
 * 根据下标获取数据表中对应的键名
 */

/**
 * keys
 * 获取数据表中所有键名的数组
 */

/**
 * forEach
 * 迭代数据表中所有 value/key/iterationNumber。
 * iterationNumber 从1开始
 * 使用`return 非undefined的值`提前退出迭代，返回值作为promise的结果
 * eg: forEach((value, key, iterationNumber) => {...}).then().catch()
 */

/**
 * create
 * 创建并返回一个 localForage 的新实例。
 * `config` 方法使用的配置选项都可用。
 * 每个实例对象指向一个独立数据库，互不影响。
 * 数据库已存在时，返回该数据库的引用。
 * eg:
 * create({
 *   name: 'dbName',
 *   storeName: 'tableName'
 * })
 */

/**
 * drop
 * 删除当前实例指向的数据库或数据表。
 * `options` 参数可指定`name`或`storeName`。
 * 未指定时，删除当前数据库下的对应数据表。
 * 仅指定`name`时，删除数据库（及其所有数据表）
 * 指定`name`与`storeName`时，删除指定数据表
 * 执行删除数据库操作后，任意指向该数据库的实例都不应该再使用
 * eg:
 * drop({
 *   name: 'dbName',
 *   storeName: 'tableName'
 * }).then()
 */

const proto = localforage.constructor.prototype

proto.create = proto.createInstance
proto.remove = function (key) {
  return this.removeItem(key)
}
proto.removeAll = function () {
  return this.clear()
}
proto.forEach = function (iterator) {
  return this.iterate(iterator)
}
proto.drop = function (options) {
  return this.dropInstance(options)
}

/**
 get: 根据键名获取数据表中指定键的值。不存在时返回null。
 @param:
   key: String
 @return: Promise
*/
proto.get = function (key) {
  return new Promise((resolve, reject) => {
    this.getItem(key)
      .then((result) => {
        if (result === null) {
          resolve(result)
          return
        }
        const { value, end } = result
        if (end < 0) {
          // 一次性存储
          this.removeItem(key)
          resolve(value)
        } else if (end > 0 && end < new Date().getTime()) {
          // 过期
          this.removeItem(key)
          resolve(null)
        } else {
          resolve(value)
        }
      })
      .catch((e) => reject(e))
  })
}

/**
 set: 以键值对的形式向数据表插入一条数据
 @param:
   key: String
 @param:
   value: Any
 @param:
   option: Object = {
     duration: Number = 0,
     expires: Number = 0 // TimeStamp in millisecond
   }
   duration大于0时有效，且以duration为准，小于等于0或未设置时，以expires为准。
   expires为负数时，表示仅一次有效。
   expires等于0或不设置时，表示长期有效。
   过期数据将在下次读取时清除。
 @return: Promise
*/
proto.set = function (key, value, option = {}) {
  var now = new Date().getTime()
  var duration = option.duration || 0
  var expires = option.expires || 0
  var end = duration > 0 ? now + duration : expires
  return this.setItem(key, { value, end })
}

export default localforage