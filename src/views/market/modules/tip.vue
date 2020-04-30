<template>
  <van-popup class="market_tip" v-model="isShowMd">
    <div class="first" @click="role">
      <div class="top" :class="{typeone:select==1}">我要买</div>
      <!-- <div class="top" :class="{typeone:select==2}">我要卖</div> -->
    </div>
    <div class="price">{{typecoin}}价格区间</div>
    <div class="priceone">{{range}}</div>
    <div v-if="select==1" class="typetwo">买进单价</div>
    <div v-if="select==2" class="typetwo">卖出单价</div>
    <div></div>
    <van-field class="inputnum" v-model="info.price" placeholder="请输入单价"></van-field>
    <div v-if="select==2" style="color:#F2B0B0">可售卖数量：{{rare}}</div>
    <div v-if="select==1" class="typetwo">买进数量</div>
    <div v-if="select==2" class="typetwo">卖出数量</div>
    <van-field class="inputnum" v-model="info.num" placeholder="请输入数量"></van-field>
    <!-- <div class="content" v-html="info"></div> -->
    <div class="typetwo">交易密码</div>
    <van-field class="inputnum" v-model="info.pwd" type="password" placeholder="请输入交易密码"></van-field>
    <div class="tip_btn" @click="add">确 认</div>
    <div class="tip_btn1" @click="no">取消</div>
  </van-popup>
</template>

<script>
export default {
  name: "market_tip",
  components: {},
  props: {
    isShow: Boolean,
    typecoin: String,
    coin_id: Number
  },
  data() {
    return {
      select: 1,
      range: "",
      rare: "",
      info: {
        side: 2,
        price: "",
        num: "",
        pwd: ""
      }
    };
  },
  filters: {
    mytofixed(a) {
      return a.tofixed();
    }
  },
  computed: {
    isShowMd: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      }
    }
  },
  watch: {},

  methods: {
    validate() {
      const acyprice = /^[0-9]+([.]?[0-9]{0,2})$/;
      // const dcyprice=/^[0-9]+\.[0-9]{0,1}$/
      const dcyprice = /^[0-9]+([.]?[0-9]{0,1})$/;
      const dcynum = /^[1-9][0-9]?$/;
      let res = true;
      // let dcy=true
      if (this.coin_id == 1) {
        if (!acyprice.test(this.info.price)) {
          this.$toast("ACY价格最小准确到小数点后两位");
          res = false;
          return false;
        }
      } else if (this.coin_id == 2) {
        if (!dcyprice.test(this.info.price)) {
          this.$toast("DCY价格最小准确到小数点后一位");
          res = false;
          return false;
        }
        if (!dcynum.test(this.info.num)) {
          this.$toast("DCY一次交易最大数量为99个");
          res = false;
          return false;
        }
      }
      return res;
    },
    getmax() {
      this.$api
        .getmaxnum({
          coin_id: this.coin_id
        })
        .then(data => {
          console.log(data);
          this.rare = data.data.info;
        });
    },
    no() {
      this.isShowMd = false;
      this.info.price = "";
      this.info.num = "";
      this.info.pwd = "";
    },
    add() {
      const res = this.validate();
      if (!res) {
        this.isShowMd = false;
        return false;
      }
      this.$api
        .addorder({
          coin_id: this.coin_id,
          coin_name: this.typecoin,
          side: this.info.side,
          changepwd: this.info.pwd,
          num: this.info.num,
          price: this.info.price
        })
        .then(data => {
          this.info.price = "";
          this.info.num = "";
          this.info.pwd = "";
          if (data.code === 1) {
            this.isShowMd = false;
            console.log(data);
            this.$toast(data.msg);
          } else {
            this.isShowMd = false;
            this.$toast(data.msg);
            this.isShowMd = false;
          }
        });
    },
    getMarketTip() {
      this.$api.getMarketTip().then(data => {
        // console.log(data, "klklkl");
        if (data.code === 1) {
          var regRN = /\r\n/g;
          let str = data.data.content;
          str = str.replace(regRN, "<br />");
          this.info = str;
        } else {
          this.isShowMd = false;
        }
      });
    },
    role(e) {
      // console.log(e);
      // console.log(this.typecoin);
      // console.log(this.coin_id);

      // console.log(e.target.innerText);
      if (e.target.innerText == "我要买") {
        this.select = 1;
        this.info.side = 2;
        return;
      }
      if (e.target.innerText == "我要卖") {
        this.select = 2;
        this.info.side = 1;
        // this.getmax()
        return;
      }
    },
    getprice() {
      console.log(123);

      this.$api.getprice({ coin_id: this.coin_id }).then(data => {
        // console.log(data, "获取价格区间");
        if (data.code == 1) {
          this.range = data.data.info;
        }
      });
    }
  },

  created() {
    this.getprice();
    // this.getMarketTip();
  },

  mounted() {}
};
</script>

<style lang='scss' scope>
.market_tip {
  width: 80%;
  // height: 80vh;
  padding: 15px;
  margin-bottom: 10%;
  border-radius: 10px;
  z-index: 2013 !important;
  .price {
    font-family: "MicrosoftYaHei";
    color: #505050;
    font-size: 14px;
    margin-top: 16px;
  }
  .priceone {
    font-size: 14px;
    margin-top: 16px;
    border-bottom: 1px solid #dddddd;
  }
  .inputnum {
    width: 100%;
    // height: 30px;
    border-radius: 0px;
    border: transparent;
    border-bottom: 1px solid #dddddd;
  }
  .typetwo {
    margin-top: 16px;
    font-family: "MicrosoftYaHei";
    color: #505050;
    font-size: 14px;
  }
  .van-field__control {
    // width: 100%;
    // font-size: 1.5rem;
    // color: #b0b0b0;
    // color: #fff;
  }
  .first {
    // width: 100%;
    display: flex;
    justify-content: space-around;

    .top {
      width: 40%;
      height: 3rem;
      text-align: center;
      border-radius: 4px;
      line-height: 3rem;
      // align-items: center;
      border: 1px solid #bebebe;
    }
    .typeone {
      color: #4470ff;
      border: 1px solid #4470ff;
    }
  }
  // .top {
  //   text-align: center;
  //   font-size: 16px;
  // }
  .content {
    margin-top: 1.6rem;
    height: 300px;
    line-height: 20px;
    overflow: auto;
    border-radius: 10px;
  }

  .tip_btn {
    margin: 20px auto 0;
    width: 130px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 40px;
    background: #da2e63;
    color: #fff;
  }
  .tip_btn1 {
    margin: 20px auto 0;
    width: 130px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 40px;
    background: #8a8a8a;
    color: #fff;
  }
}
</style>

