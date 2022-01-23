<template>
  <view>
    <!-- 使用列表组件 -->
    <my-goods :goods="goodsList"></my-goods>
  </view>
</template>

<script>
  var {log} = console
  import showMsg from '../../public/showMsg.js'
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量，用来实现分页
        total: 0,
        // 是否正在请求数据 节流阀
        isloading: false
        }
      },
    onLoad(options) {
      // 将页面参数转存到 this.queryObj 对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      log(this.queryObj)
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    // 触底的事件
    onReachBottom() {
      // 判断是否还有下一页数据
        if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return new showMsg('没有更多数据了', 'none', 1000).showtoast()
      // 判断节流阀是否正在请求其它数据，如果是，则不发起额外的请求
      if(this.isloading) return
      // 让页码值自增 +1
      this.queryObj.pagenum += 1
      // 重新获取列表数据
      this.getGoodsList()
    },
    // 下拉刷新的事件
    onPullDownRefresh() {
      // 1. 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
    
      // 2. 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        //  打开节流阀
        this.isloading = true
        // 发起请求
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isloading = false
        // 只要数据请求完毕，就立即按需调用 cb 回调函数
        cb && cb()
        // 数据请求中
        new showMsg('数据加中', 'none').showloading()
        // 请求失败
        if (res.meta.status !== 200) return new showMsg('数据加载失败', 'none', 1000).showtoast()
        // 数据请求成功
        uni.hideLoading()
        
        // 请求成功为 data 中的数据赋值
        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
        log(this.goodsList)
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
