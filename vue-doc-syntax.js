/**  
* 这里是一个组件描述，会在提示标签的时候显示  
* @description 这里也是一个组件描述  
* @tutorial https://uniapp.dcloud.io/api/media/image?id=chooseimage  
* @property {String} type = [button|input|...值域] 这里是属性描述  
* @event {Function} tap 这是是事件描述   
* @example 这里是示例代码  
*/

// 其中@property和@event内{ }中间的是类型，event的类型必须是Function。

// example:

<script>  
  /**  
   * 翻页组件  
   * @description 翻页组件  
   * @tutorial http://www.xxoo.com  
   * @property {Number} total 翻页数据总数  
   * @property {String} size = [big|small] 组件大小  
   * @event {Function} close 关闭事件  
   * @example <Pagination @total="50" @close=""></Pagination>  
   */  
  export default {  
    props: {  
      "total": Number,  
      "size": String  
    },  
    data () {  
      return {  
        pageSize: 10,  
        pageNumber: 0  
      }  
    },  
    methods: {  
      handleChange(data, event) {  
        this.$emit('PsPn', this.pageSize, this.pageNumber)  
      }  
    }  
  }  
</script>
