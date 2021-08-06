<template>
  <div class="loading">
    <div class="loading-content">
      <LoadingOutlined style="color:#009E94;font-size: 16px;"/>
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
export default {
  name: 'loading',
  components: {LoadingOutlined},
  setup() {
    const title = ref('正在载入...')

    function setTitle(title) {
      this.title = title
    }
    return {
      title,
      setTitle
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  position: absolute;
  // top: 50%;
  // left: 50%;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  opacity: .5;
  display: flex;
  align-items: center;
  justify-content: center;
  // transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: 14px;
      color: #009E94;
    }
  }
}
</style>