<!-- mall -->
<template>
  <div class="mall">
    <div class="nav">首页</div>
    <div>
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in swipelist" :key="index">
          <img class="my-swipe" :src="'http://fulishijie.oss-cn-hangzhou.aliyuncs.com'+item.img" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-notice-bar @click="open" :text="notice" left-icon="volume-o" />

    <div class="foot">
      <div class="last">最近成交</div>
      <!-- <van-pull-refresh class="list" v-model="isLoadRefresh" @refresh="refreshList"> -->
      <van-list
        v-model="isLoading"
        :finished="isFinished"
        @load="pullList"
        :offset="100"
        finished-text="人家也是有底线的"
      >
        <div class="list" v-for="(item,index) in list" :key="index">
          <!-- <div> -->
            <div class="styletwo">{{item.coin_name}}</div>
            <!-- <div class="styleone">{{item.id}}</div> -->
          <!-- </div> -->
          <!-- <div> -->
            <div class="styleone">¥{{item.min_price}}</div>
            <div class="stylethree">{{item.add_times}}</div>
            <!-- <div class="styleone">{{item.id}}</div> -->
          <!-- </div> -->
          <!-- <div> -->
            <!-- <div class="isup">{{item.rate}}</div> -->
            <div class="isup" :class="{down:parseInt(item.rate)>0?false:true}">{{item.rate}}</div>
          <!-- </div> -->
        </div>
      </van-list>
      <!-- </van-pull-refresh> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "mall",

  data() {
    return {
      notice:'',
      curTab: 0,
      page: 0,
      isLoadRefresh: false,
      isLoading: false,
      isFinished: false,
      pageSize:8,
      list: [],
      swipelist: [
        require("@/assets/images/BANNER.png"),
        require("@/assets/images/BANNER.png")
      ]
    };
  },
//  filters:{
//    time(a){
//      var addtime=new Date(a)
//      var Time=new Date().getTime()
//       // var addtime=a.toString()
//      var addyear=addtime.getFullYear()
//      var addmonth=addtime.getMonth()
//      var adddata=addtime.getDate()
//      var b=addtime.getTime()
//     //  console.log(b,Time);
     
//      return `${addyear}-${addmonth}-${adddata}`
//    }
//  },
  methods: {
    // gettime(){
    //   var nowtime=new Date()
    //   var month=nowtime.getMonth()+1
    //   var data=nowtime.getDate()
    //   console.log(month,data);
      
    // },
    // refreshList() {
    //   this.page = 1;
    //   console.log("下拉刷新");
    //   this.isLoadRefresh = false;
    //   this.getMallList();
    // },
    open(e){
      // console.log(e);
      this.$router.push('/notice')
    },
    pullList() {
      console.log("上拉加载");
      this.page++;
      this.getMallList();
    },

    getMallList() {
      console.log("获取列表");
      const page = this.page;
      if (page === 0) return false;
      if (page === 1) this.list = [];
      this.$api.getMarketBuyList({ p: this.page,pageSize:this.pageSize }).then(data => {
        console.log(data, "首页");
        this.isLoadRefresh = false;
        this.isLoading = false;
        if (data.code === 1) {
          this.notice=data.data.notice.title
          this.swipelist=data.data.image
          // if (data.data.info) {
          //   this.list.push(...data.data.info);
          // }
           if (page === 1) {
              this.list = data.data.info;
            } else {
              this.list.push(...data.data.info);
            }

          if (data.data.total / 8 <= page) {
            this.isFinished = true;
          } else {
            this.isFinished = false;
          }
        } else {
          this.isLoadRefresh = false;
          this.isLoading = false;
          this.isFinished = true;
        }
      });
    }
  },
  created() {
    this.getMallList()
     
     
    
    // this.gettime()
  },
  mounted() {}
};
</script>

<style lang='scss'>
.mall {
  width: 100%;
  .last {
    font-size: 0.875rem;
    padding: 10px 10px 10px 10px;
    //  padding-left: 10px;
    //  padding-top: 10px;
  }
  .nav {
    width: 100%;
    height: 15%;
    font-size: 1.5rem;
    text-align: center;
    line-height: 3.125rem;
  }
  .my-swipe {
    width: 100%;
    height: 30%;
  }
  // .list {
  //   width: 100%;
  //   height: 20rem;
  //   border: 1px solid red;
  // }
  // padding-top: 4rem;
  .foot {
    width: 100%;
    height: 47vh;
    overflow: scroll;
    // border: 1px solid red;

    .list {
      width: 100%;
      height: 3.4rem;
      // border: 1px solid red;
      background-color: #F7F7F7;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 4px;
      // &>div{
      //   width: 20%
      // }
      .styleone{
        width: 20%;
        font-size: 1.4rem;
        color:#949EA5;
      }
      .styletwo{
        width: 20%;
        text-align: center;
        font-size: 1.4rem;
        // color:#949EA5;
        // font-weight: 600;
      }
      .stylethree{
         font-size: 1.2rem;
        color:#949EA5;
      }
      .isup {
        width: 5rem;
        height: 25px;
        // padding-left: 10px;
        margin-right: .625rem;
        text-align: center;

        line-height: 25px;
        background-color: #03BE87;
        // border: 1px solid red;
      }
      .down{
        background-color: #F8784C;
      }
    }
  }
}
</style>