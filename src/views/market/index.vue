<!-- market -->
<template>
  <div class="market">
    <van-nav-bar fixed title="交易中心" right-text="发布订单" @click-right="handpush" />
    <!-- <div class="title">交易中心</div> -->
    <div class="typebox">
      <div class="type">
        <div
          v-for="(item,index) in typelist"
          :class="{typeclass:index==type}"
          :key="index"
          @click="changetype(item,index)"
        >{{item.coin_name}}</div>
      </div>
      <!-- <div class="bgc"></div> -->
    </div>
    <div class="main">
      <!-- <div class="type">
        <div
          v-for="(item,index) in typelist"
          :class="{typeclass:index==type}"
          :key="index"
          @click="changetype(item,index)"
        >{{item.coin_name}}</div>
      </div>
      <div class="bgc"></div>-->
      <div class="type-name">{{typename}}走势图</div>
      <div id="myChart" :style="{width: '320px', height: '250px'}"></div>
      <div class="bgc"></div>

      <div class="first" @click="roleone">
        <div class="top" :class="{typeone:select==1}">买方</div>
        <!-- <div class="top" :class="{typeone:select==2}">卖方</div> -->
      </div>
      <div class="list_wrap">
        <market-list ref="list" />
      </div>
    </div>

    <market-tip ref="tip" :isShow.sync="isTip" :typecoin="typename" :coin_id="coin_id"></market-tip>
  </div>
</template>

<script>
import { setStore, getStore } from "@/utils/utils";
import echarts from "echarts";
import marketList from "./list";
import marketTip from "./modules/tip";
export default {
  name: "market",
  components: { marketList, marketTip },

  data() {
    return {
      charts: "",
      opinion: [],
      opinionData: [],
      price: [],
      curType: 1,
      type: 0,
      select: 1,
      typename: "",
      coin_id: 1,
      side: 2,
      curSortTime: 1,
      curSortPrice: 1,
      curSortNum: 1,
      curSortClinch: 1,
      typelist: [],
      total: {},
      rang: {},
      search: "",
      isTip: false
    };
  },
  updated() {
    this.getmap();
    this.handleSearch();
  },
  methods: {
    // 切换角色
    roleone(e) {
      console.log(e);
      console.log(e.target.innerText);
      if (e.target.innerText == "买方") {
        this.select = 1;
        this.side = 2;
        this.$refs.list.side = this.side;

        // this.handleSearch();
      }
      if (e.target.innerText == "卖方") {
        this.select = 2;
        this.side = 1;
        this.$refs.list.side = this.side;

        // this.handleSearch();
      }
    },
    // 走势图
    drawLine() {
      this.charts = echarts.init(document.getElementById("myChart"));
      this.charts.setOption({
        grid: {
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.opinion,
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 45,
            textStyle: {
              color: "#333"
            }
          }
        },
        yAxis: [{ name: "单位(元)", type: "value" }],
        series: [
          {
            type: "line",
            stack: "总量",
            data: this.opinionData
          }
        ]
      });
    },
    // 获取某币种走势
    getmap() {
      this.$api.getmap({ coin_id: this.coin_id }).then(data => {
        // console.log(data, "走势图");
        if (data.code == 1) {
          this.opinion = data.data.info_x;
          this.opinionData = data.data.info_y;
          this.drawLine();
        }
      });
    },
    // 获取币种
    gettype() {
      this.$api.gettype().then(data => {
        console.log(data, "获取币种");
        if (data.code == 1) {
          this.typename = data.data.info[0].coin_name;
          this.coin_id = data.data.info[0].coin_id;
          this.typelist = data.data.info;
        }
      });
    },
    // 改变币种
    changetype(a, b) {
      this.type = b;
      this.typename = a.coin_name;
      this.coin_id = a.coin_id;
      this.$refs.list.coin_id = this.coin_id;
      // this.getmap();
      // this.handleSearch();
    },
    // 获取列表
    handleSearch() {
      this.$refs.list.page = 1;
      this.$refs.list.getMarketList();
    },
    handpush() {
      this.isTip = true;
      this.$refs.tip.getprice();
      this.$refs.tip.getmax();
    }
  },

  created() {
    this.gettype();
    this.getmap();
  },
  mounted() {
    this.drawLine();
  }
};
</script>

<style lang='scss'>
.first {
  margin-top: 6px;
  display: flex;
  justify-content: space-around;

  .top {
    width: 30%;
    height: 2.5rem;
    text-align: center;
    border-radius: 4px;
    line-height: 2.5rem;
    border: 1px solid #bebebe;
  }
  .typeone {
    color: #4470ff;
    border: 1px solid #4470ff;
  }
}
.type-name {
  color: black;
  font-size: 14px;
  padding-top: 10px;
  font-weight: 600;
}
 
#myChart {
  margin: 0 auto;
}
.typeclass {
  color: #567dff;
  border-bottom: 2px solid #567dff;
}
 
.title {
  width: 100%;
  height: 3rem;
  font-weight: 600;
  border-bottom: 1px solid #efefef;
  line-height: 3rem;
  text-align: center;
  color: black;
  background-color: #fff;
}
.market {
  // padding-top: 4rem;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  .typebox {
    width: 100%;
    position: fixed;
    top: 46px;
    left: 0px;
    z-index: 1999;
    background-color: #f4f4f4;
    .bgc {
      width: 100%;
      height: 1vh;
      
    }
    .type {
      width: 100%;
      height: 3rem;
      z-index: 1999;
      border-bottom: 1px solid #efefef;
      line-height: 3rem;
      display: flex;
      justify-content: space-around;
      color: black;
 
    }
  }
  .main {
    
    margin-top: 92px;
    z-index: -1;
    
    .list_wrap {
      width: 100%;
      height: 46vh;
      overflow: scroll;
      margin-bottom: 52px;
    }
  }
  .market_type {
    display: flex;
    align-items: center;
    width: 100%;
    height: 2.56rem;
    line-height: 2.56rem;
    text-align: center;
    border-radius: 2.56rem;
    border: 1px solid rgba(52, 34, 47, 1);
    font-size: 1.44rem;
  }
  .type_item {
    width: 100%;
    border-radius: 2.56rem;
  }
  .type_item.active {
    background: #34222f;
  }

  .total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-top: 1.2rem;
    padding: 1.2rem;
    background: #34222f;
    border-radius: 0.4rem;
  }
  .total_item {
    font-size: 0.96rem;
  }

  .total_value {
    margin-top: 0.8rem;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
  }

  .sort {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.6rem;
  }
  .sort_item {
    display: flex;
    align-items: center;
  }
  .sort_name {
  }
  .sort_opt {
    position: relative;
    top: -0.32rem;
    margin-left: 0.64rem;
    margin-right: 0.8rem;
  }

  .sort_opt::before {
    content: "";
    position: absolute;
    top: 0.4rem;
    left: 0;
    border-width: 0.32rem 0.24rem;
    border-color: transparent;
    border-style: solid;
    border-top-color: #fff;
  }
  .sort_opt::after {
    content: "";
    position: absolute;
    top: -0.4rem;
    left: 0;
    border-width: 0.32rem 0.24rem;
    border-color: transparent;
    border-style: solid;
    border-bottom-color: #da2e63;
  }

  .time_top::before {
    border-top-color: #da2e63;
  }
  .time_top::after {
    border-bottom-color: #fff;
  }
  .price_top::before {
    border-top-color: #da2e63;
  }
  .price_top::after {
    border-bottom-color: #fff;
  }
  .num_top::before {
    border-top-color: #da2e63;
  }
  .num_top::after {
    border-bottom-color: #fff;
  }
  .clinch_top::before {
    border-top-color: #da2e63;
  }
  .clinch_top::after {
    border-bottom-color: #fff;
  }

  .search {
    margin-top: 1.2rem;
  }

  .van-search,
  .van-search__content {
    padding: 0;
    background: transparent !important;
  }
  .van-cell {
    padding-right: 1.2rem;
    border-radius: 34px;
    background: transparent;
    border: 1px solid #da2e63;
  }
  .van-field__control::-webkit-input-placeholder {
    color: #da2e63;
  }
  .van-field__control {
    padding: 0 1.2rem;
    color: #da2e63;
  }
  .van-icon-search {
    color: #da2e63;
  }
}
</style>