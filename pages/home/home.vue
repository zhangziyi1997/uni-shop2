<template>
  <view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" 	:autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <view class="swiper-item" @click="toGoodsDetail(item.goods_id)">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </view>
      </swiper-item>
    </swiper>
    <!-- 分类导航区 -->
    <view class="nav">
      <view class="nav-item" v-for="(item, i) in navList" :key="i">
        <image :src="item.image_src" mode=""></image>
      </view>
    </view>
     
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层  -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box"  :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix">           </image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"  :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view> 
        </view>
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
        // 轮播图数据
        swiperList: [],
        // 分类导航的数据列表
        navList: [],
        // 楼层的数据列表
        floorList: [],
      };
    },
    onLoad() {
      // 调用请求轮播图数据的方法
      this.getSwiperList()
      // 在 onLoad 中调用获取数据的方法
      this.getNavList()
      // 在 onLoad 中调用获取楼层数据的方法
      this.getFloorList()
    },
    methods: {
        // 获取轮播图数据的方法
        async getSwiperList() {
          // 发起请求
          const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
          // 数据请求中
          new showMsg('数据加中', 'none').showloading()
          // 请求失败
          if(res.meta.status !== 200) {
            return new showMsg('数据加载失败', 'none', 3000).showtoast()
          }
          // 数据请求成功
          uni.hideLoading()
          // 请求成功为 data 中的数据赋值
          this.swiperList = res.message
          // log(this.swiperList)
        },
        // 点击去商品详情
        toGoodsDetail(goodId) {
          uni.navigateTo({
              url: `../../subpkg/goods_detail/goods_detail?goods_id= ${goodId}`
          });
        },
        // 获取分类导航区数据
        async getNavList() {
          const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
          // 判断是否获取成功
          if (res.meta.status !== 200) return new showMsg('数据加载失败', 'none', 3000).showtoast()
          this.navList = res.message
          // log(res)
        },
        
        // 3. 定义获取楼层列表数据的方法
        async getFloorList() {
          const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
          if (res.meta.status !== 200) return uni.$showMsg()
          // 通过双层 forEach 循环，处理 URL 地址
          res.message.forEach(floor => {
            floor.product_list.forEach(prod => {
              prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
            })
          })

          this.floorList = res.message
          log(this.floorList)
        },
        
      }
    
}
    
</script>

<style lang="scss" scoped>
  // 轮播图
  swiper {
    height: 360rpx;
    .swiper-item, image {
      width: 100%;
      height: 100%;
    }
  }
  // nav导航
  .nav {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
    .nav-item image {
        width: 128rpx;
        height: 140rpx;
    }
  }
  // 楼层标题
  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
</style>
