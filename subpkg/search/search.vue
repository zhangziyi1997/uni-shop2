<template>
  <view>
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <uni-search-bar placeholder="请输入搜索内容" @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
    </view>
    

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag class="uni-tag" :text="item" :inverted="true"	 v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
    
  </view>
</template>

<script>
  var {log} = console
  import showMsg from '../../public/showMsg.js'
  export default {
    data() {
      return {
        // 防抖定时器的
        timer: null,
        // 搜索关键字
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: ['a', 'app', 'apple']
      };
    },
    onLoad() {
      // 取出缓存中的搜索历史
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
      
    },
    methods: {
      // 取到用户输入的的value
      input(e) {
        // 清除 timer 对应的延时器
        clearTimeout(this.timer)
        // 重新启动一个延时器，并把 timerId 赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e
          // 根据关键词，查询搜索建议列表
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 先判断关键词是否为空
        if(this.kw === '') {
          // 重置列表
          this.searchResults = []
          return
        }
        // 发起请求，获取搜索列表
        const { data:res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
        // 数据请求中
        new showMsg('数据加中', 'none').showloading()
        // 判断请求结果
        if (res.meta.status !== 200) return new showMsg('数据加载失败', 'none', 3000).showtoast()
        // 数据请求成功
        uni.hideLoading()
        // 请求成功为 data 中的数据赋值
        this.searchResults = res.message
        // log(this.searchResults)
        
        // 1. 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
        this.saveSearchHistory()
        
      },
      // 跳转页面
      gotoDetail(id) {
        uni.navigateTo({
          // 指定详情页面的 URL 地址，并传递 goods_id 参数
          url: `/subpkg/goods_detail/goods_detail?goods_id= ${id}`
        })
      },
      // 存储关键字到本地缓存
      saveSearchHistory() {
        // 2.1 直接把搜索关键词 push 到 historyList 数组中
        this.historyList.unshift(this.kw)
        // 数组去重
        this.historyList = [...new Set(this.historyList)]
         // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清空搜索历史记录
      cleanHistory() {
        // 清空 data 中保存的搜索历史
        this.historyList = []
        // 清空本地存储中记录的搜索历史
        uni.setStorageSync('kw', '[]')
      },
      // 点击搜索历史跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-box {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 999;
  }
  
  
  .sugg-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px solid #efefef;
    padding: 13px 5px;
    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
  
  
  .history-box {
    padding: 0 5px;
  
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
  
    .history-list {
      display: flex;
      flex-wrap: wrap;
  
      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
