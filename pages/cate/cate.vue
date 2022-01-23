<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <my-search @click="gotoSearch"></my-search>
    
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}" >
        <view :class="['left-scroll-view-item', index === active ? 'active' : '']" v-for="(item, index) in cateList" :key="item.cat_id" @click="activeChanged(index)">{{item.cat_name}}</view>
      </scroll-view>
      
      
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        
        <view class="cate-lv2" v-for="(item2, index2) in cateLevel2" :key="index2">
          
            <!-- 动态渲染二级标题 -->
            <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
            
            
            <!-- 动态渲染三级分类的列表数据 -->
            <view class="cate-lv3-list">
              <!-- 每一个图片文字项 -->
              <view class="cate-lv3-item" v-for="(item3, index3) in item2.children" :key="index3" @click="gotoGoodsList(item3)">
                <!-- 图片 -->
                <image :src="item3.cat_icon"></image>
                <!-- 文本 -->
                <text>{{item3.cat_name}}</text>
              </view>
            </view>
            
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  var {log} = console
  import showMsg from '../../public/showMsg.js'
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        // 分类数据列表
        cateList: [],
        // 当前选中项的索引，默认让第一项被选中
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight - 50
      // 调用获取分类列表数据的方法
      this.getCateList()
      
    },
    methods: {
      // 获取分类列表数据
      async getCateList() {
          // 数据请求中
          new showMsg('数据加中', 'none').showloading()
          // 发起请求
          const { data: res } = await uni.$http.get('/api/public/v1/categories')
          // 判断是否获取失败
          if (res.meta.status !== 200) return new showMsg('数据加载失败', 'none', 3000).showtoast()
          // 转存数据
          this.cateList = res.message
          // log(this.cateList)
          // 为二级分类赋值
          this.cateLevel2 = res.message[0].children
        },
      // 点击激活
      activeChanged(index) {
        this.active = index
        // 为二级分类列表重新赋值
        this.cateLevel2 = this.cateList[index].children
        // 让 scrollTop 的值在 0 与 1 之间切换
        this.scrollTop = this.scrollTop ? 0 : 1
      },
      // 点击跳转到商品列表页
      gotoGoodsList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      // 跳转到分包中的搜索页面
     gotoSearch() {
       uni.navigateTo({
         url: '/subpkg/search/search'
       })
     }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll-view-container {
    display: flex;
  
    .left-scroll-view {
      width: 120px;
  
      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;
  
        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;
  
          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .right-scroll-view {
      .cate-lv2-title {
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
      }
      .cate-lv3-list {
        display: flex;
        flex-wrap: wrap;
        
        .cate-lv3-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 33.33%;
          image {
            height: 60px;
            width: 60px;
          }
          text {
                font-size: 12px;
          }
        }
      }
    }
    
  }
</style>
