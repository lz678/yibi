<template>
  <div class="bbox">
    <van-nav-bar title="订单详情" left-arrow @click-left="onClickLeft" />
    <!-- <div class="title">交易中</div> -->
    <!-- <div class="warn">订单将在{{59-mytime}}分钟后自动取消</div> -->
    <div class="order">
      <div
        class="warn"
        v-if="isfukuan==1&&listone.status==2&&cha"
      >订单将在{{59-hour|time}}:{{59-sec|time}}后自动取消，请尽快打款上传截图</div>
      <div
        class="warn"
        v-if="isshoukuan==1&&listone.status==2&&cha"
      >对方不打款，订单将在{{59-hour|time}}:{{59-sec|time}}后自动取消</div>
      <div
        class="warn"
        v-if="!iscover&&isfukuan==1&&pcha&&listone.status==3"
      >{{59-payhour|time}}:{{59-paysec|time}}后可以发起申诉</div>
      <!-- <div>{{hour}}{{sec}}</div> -->
      <div class="titlebox">
        <div class="title">订单信息</div>
        <div class="appeal" v-if="isshoukuan==1&&status==3" @click="sellshow=true">申诉</div>
        <div
          class="appeal"
          v-if="isfukuan==1&&up==1&&listone.status==3&&iscover"
          @click="buyshow=true"
        >申诉</div>
        <div class="appeal" v-if="isfukuan==1&&up==0" @click="handleCancelOrd">取消</div>
      </div>

      <div class="typeone">
        <div class="popone">币名</div>
        <div class="poptwo">{{listone.coin_name}}</div>
      </div>
      <div class="typeone">
        <div class="popone">数量</div>
        <div class="poptwo">{{listone.amount}}</div>
      </div>
      <div class="typeone">
        <div class="popone">总计</div>
        <div class="poptwo">{{listone.total_price}}</div>
      </div>
      <div class="typeone">
        <div class="popone">创建时间</div>
        <div class="poptwo">{{listone.order_time}}</div>
      </div>
      <!-- <div class="typeone" v-if="listone.deal_time">
        <div class="popone">完成时间</div>
        <div class="poptwo">{{listone.deal_time}}</div>
      </div>-->
    </div>

    <div class="info">
      <div class="warn" v-if="isfukuan==1">收款用户务必与真实名字一致才能打款</div>
      <div class="title">对方信息</div>
      <!-- <div class="typeone">
        <div class="popone">{{isshoukuan|role}}</div>
        <div class="poptwo">{{listtwo.nickname}}</div>
      </div>-->
      <div class="typeone">
        <div class="popone">真实名字</div>
        <div class="poptwo">{{listtwo.realname}}</div>
      </div>
      <div class="typeone">
        <div class="popone">手机号</div>
        <div class="poptwo">{{listtwo.mobile}}</div>
      </div>
      <div class="typeone">
        <div class="popone">支付宝号</div>
        <div class="poptwo">{{listtwo.zfb_number}}</div>
      </div>
    </div>
    <div v-if="isshoukuan==1&&listone.status==3&&issell==0" class="btn" @click="givecoin">确认收款</div>
    <div
      v-if="isfukuan==1&&status==2&&up==1&&listone.status==2"
      class="btn"
      @click.once="givemoney"
    >确认付款</div>
    <div v-if="isfukuan==1&&isup==0" class="btn">
      <van-uploader :after-read="handleUpload">
        <div>上传打款凭证</div>
      </van-uploader>
    </div>
    <!-- <div v-if="(side==1&&!(buyid == otherid) == userid)||(side==2&&(sellid == otherid) == userid)" class="btn" @click="givecoin">确认收款</div>
    <div v-if="(side==1&&(buyid == otherid) == userid)||(side==2&&(sellid == otherid) == userid)" class="btn" @click="givemoney">确认付款</div>-->
    <!-- 卖家申诉 -->
    <van-popup v-model="sellshow" round position="bottom" :overlay="false" class="mypopup">
      <van-radio-group v-model="result">
        <van-radio name="打款金额有误">打款金额有误</van-radio>
        <van-radio name="没有打款">没有打款</van-radio>
      </van-radio-group>
      <div class="btn" @click="sellsend">确定</div>
      <div class="btn" @click="sellshow=false">取消</div>
    </van-popup>
    <!-- 买家申诉 -->
    <van-popup v-model="buyshow" round position="bottom" :overlay="false" class="mypopup">
      <van-radio-group v-model="result">
        <van-radio name="请求平台确认订单">请求平台确认订单</van-radio>
        <!-- <van-radio name="订单有误">没有打款</van-radio> -->
      </van-radio-group>
      <div class="btn" @click="buysend">确定</div>
      <div class="btn" @click="buyshow=false">取消</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iscover: false,
      issell: "",
      isshoukuan: "",
      isfukuan: "",
      apply: false,
      isup: "",
      status: this.$route.query.status,
      result: "",
      sellshow: false,
      buyshow: false,
      orderid: this.$route.query.id,
      listone: "",
      listtwo: "",
      side: "",
      payhour: "",
      paysec: "",
      buyid: "",
      otherid: "",
      sellid: "",
      userid: "",
      ordertime: "",
      payordertime: "",
      mytime: 60,
      hour: 59,
      sec: 60,
      cha: "",
      pcha: ""
    };
  },
  computed: {
    up() {
      return this.isup;
    }
  },

  filters: {
    time(binging) {
      return binging.toString().padStart(2, "0");
    },
    role(a) {
      if (a == 1) {
        return "买家";
      } else {
        return "卖家";
      }
    }
  },
  mounted() {},

  methods: {
    //判断卖家是否已申诉
    issellappeal() {
      this.$api
        .issellappeal({
          order_id: this.orderid
        })
        .then(data => {
          if (data.code == 1) {
            console.log(data, 111);
            this.issell = data.data.info;
          }
        });
    },
    paycountdown() {
      const ptim = this.payordertime;
      const pbg = new Date(ptim).getTime();

      const now = new Date().getTime();

      const pcha = now - pbg;

      this.pcha = pcha;
      //小时
      const ptihour = parseInt((pcha / 1000 / 60 / 60) % 24);

      // 分钟
      const phour = parseInt((pcha / 1000 / 60) % 60);

      // 秒数
      const psec = parseInt((pcha / 1000) % 60);

      if (ptihour >= 1) {
        this.iscover = true;
      }
      this.payhour = phour;
      this.paysec = psec;
 
      const that = this;
      var psettime = setTimeout(() => {
        if (ptihour >= 1) {
          clearTimeout(psettime);
        } else {
          that.paycountdown();
        }
      }, 1000);
    },

    // 倒计时
    countdown() {
      const tim = this.ordertime;

      const bg = new Date(tim).getTime();
      const now = new Date().getTime();
      const cha = now - bg;

      this.cha = cha;

      //小时

      const tihour = parseInt((cha / 1000 / 60 / 60) % 24);
      // 分钟

      const hour = parseInt((cha / 1000 / 60) % 60);
      // 秒数

      const sec = parseInt((cha / 1000) % 60);

      if (tihour >= 1 && this.listone.status == 2) {
        this.handleCancelOrdone();
        clearTimeout(settime);
        return;
      } 
      // else {
        this.hour = hour;
        this.sec = sec;
        // this.hour = hour > 9 ? hour : "0" + hour;
        // this.sec = sec > 9 ? sec : "0" + sec;
      // }
      const that = this;
      var settime = setTimeout(() => {
        if (tihour >= 1) {
          clearTimeout(settime);
        } else {
          that.countdown();
        }
      }, 1000);
    },
    //定时器
    // timeout() {
    //   var self = this;
    //   const time = this.ordertime;
    //   const bgtime = new Date(time).getTime();
    //   const nowtime = new Date().getTime();
    //   // console.log(bgtime);
    //   // console.log(nowtime);
    //   var st = nowtime - bgtime;
    //   // const tisec = parseInt(((nowtime - bgtime) / 1000) % 60);
    //   const timin = parseInt(((nowtime - bgtime) / 1000 / 60) % 60);
    //   const tihour = parseInt(((nowtime - bgtime) / 1000 / 60 / 60) % 24);
    //   if (tihour >= 1 && this.listone.status == 2) {
    //     this.handleCancelOrd();
    //   } else {
    //     this.mytime = timin;
    //     console.log(tihour, timin);
    //   }
    // },
    //判断是否上传凭证
    isuppickture() {
      this.$api
        .isuppickture({
          order_id: this.orderid
        })
        .then(data => {
          if (data.code == 1) {
            console.log(data, "是否上传凭证");
            this.isup = data.data.info;
          }
        });
    },
    //上传凭证
    handleUpload(file, index) {
      console.log(file, index);
      this.$store.dispatch("uploadFile", [file]).then(data => {
        console.log(data);
        this.fileurl = data[0];
        console.log(this.fileurl);
        this.$api
          .uploadFiles({
            order_id: this.orderid,
            pay_img: this.fileurl
          })
          .then(data => {
            console.log(data);
            if (data.code == 1) {
              // this.$store.commit('isUP',true)
              this.isuppickture();
            }
          });
      });
    },
    //取消订单
    handleCancelOrd() {
      this.$dialog
        .confirm({
          message: "确认取消订单吗？",
          overlay: false
        })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: "提交中..."
          });
          // const __token__ = await this.$store.dispatch("getCommonToken");
          // console.log(__token__);
          this.$api.cancelBuy({ order_id: this.orderid }).then(data => {
            this.$toast(data.msg);
            if (data.code === 1) {
              this.$toast(data.msg);
              // this.getTransctionList();
              // this.getorderlist();
              this.$router.go(-1);
            }
          });
        })
        .catch(err => {});
    },
    //取消订单
    handleCancelOrdone() {
      this.$api.cancelBuy({ order_id: this.orderid }).then(data => {
        // this.$toast(data.msg);
        if (data.code === 1) {
          // this.$toast(data.msg);

          this.$router.go(-1);
        }
      });
    },
    //卖家申诉
    sellsend() {
      console.log(this.result);
      this.$api
        .complaintOrder({
          type: 1,
          order_id: this.orderid,
          describe: this.result
        })
        .then(data => {
          if (data.code == 1) {
            this.$toast(data.msg);
            console.log(data, "卖家申述");
            this.$toast(data.msg);
            this.sellshow = false;
            this.issellappeal();
          } else {
            this.$toast(data.msg);
            this.sellshow = false;
          }
          // console.log(data);
        });
    },
    // 买家申诉
    buysend() {
      console.log(this.result);
      this.$api
        .complaintOrder({
          type: 2,
          order_id: this.orderid,
          describe: this.result
        })
        .then(data => {
          if (data.code == 1) {
            this.$toast(data.msg);
            console.log(data, "买家申诉");
            // this.$toast(data.msg);
            this.buyshow = false;
          } else {
            this.$toast(data.msg);
            this.buyshow = false;
          }
          // console.log(data);
        });
    },
    //买家确认付钱
    givemoney() {
      console.log(this.sellid, this.buyid, this.userid);
      const ID = this.$route.query.id;
      this.$dialog
        .confirm({
          message: "确认已付款？",
          overlay: false
        })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: "提交中..."
          });

          this.$api
            .confirmYesOrder({
              order_id: ID
            })
            .then(data => {
              this.$toast(data.msg);
              console.log(data.msg);
              if (data.code == 1) {
                console.log(data, "确认付钱");
                this.getorderlist();
                // this.$store.commit("isOK", true);
              }
            });
        })
        .catch(err => {});
    },
    //卖家确认收款放币
    givecoin() {
      console.log(this.sellid, this.buyid, this.userid);
      const ID = this.$route.query.id;
      this.$dialog
        .confirm({
          message: "确认已收款？",
          overlay: false
        })
        .then(async () => {
          // this.$toast.loading({
          //   mask: true,
          //   duration: 0,
          //   message: "提交中..."
          // });

          this.$api
            .givecoin({
              order_id: ID
            })
            .then(data => {
              // this.$toast(data.msg);
              // console.log(data.msg);
              if (data.code == 1) {
                // console.log(data,'放币');
                this.$toast(data.msg);
                this.uppick = false;
                this.$router.go(-1);
              } else {
                this.$toast(data.msg);
              }
            });
        })
        .catch(err => {});
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    getorderlist() {
      const ID = this.$route.query.id;
      // console.log(ID);
      this.$api
        .getorderlist({
          id: ID
        })
        .then(data => {
          // this.$toast(data.msg)
          if (data.code == 1) {
            console.log(data, "订单详情");
            this.isshoukuan = data.data.info.is_shoukuan;
            this.isfukuan = data.data.info.is_fukuan;
            this.listone = data.data.info;
            this.ordertime = data.data.info.order_time;
            this.payordertime = data.data.info.pay_time;
            if (data.data.info.is_shoukuan == 1) {
              this.listtwo = data.data.info.seller;
            } else {
              this.listtwo = data.data.info.buyer;
            }
            // this.timeout();
          }
        });
    }
  },
  created() {
    this.issellappeal();
    this.getorderlist();
    this.isuppickture();
    this.countdown();
    this.paycountdown()
  }
};
</script>

<style lang="scss" scoped>
.bbox {
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
  //   .van-dialog{

  //   border: 2px solid #f4f4f4
  // }

  .mypopup {
    width: 100%;
    border: 2px solid #f4f4f4;
    height: 50vh;
    // .mypopupbox {
    //   width: 80%;
    //   margin: 0 auto;
    // }
    div {
      padding: 18px;
      font-size: 1.2rem;

      // margin-top: 20px;
    }
    .btn {
      width: 70%;
      // height: 2.5rem;
      padding: 0px;
      //  padding: 10px;
      border-radius: 0.8rem;
      margin: 0 auto;
      margin-top: 1.875rem;
      text-align: center;
      color: white;
      font-size: 1rem;
      // line-height: 1rem;
      font-weight: 600;
      background-color: #4773ff;
    }
  }
  .order {
    padding: 20px;
    margin: 20px auto;
    background: #fff;
    .warn {
      width: 100%;
      text-align: center;
      color: #da2e63;
    }
    .titlebox {
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d6d6d6;
      .title {
        width: 50%;
        height: 3.5rem;
        line-height: 3.5rem;
        text-align: left;
        padding-left: 20px;
        font-size: 1.2rem;
        // color: #60F05C;
        font-weight: 600;
        // background-color: #fff;
      }
      .appeal {
        width: 20%;
        height: 20px;
        margin-top: 10px;
        font-size: 1rem;
        text-align: center;
        line-height: 20px;
        color: #333333;
        border: 1px solid #4773ff;
        border-radius: 10px;
      }
    }

    .typeone {
      display: flex;
      justify-content: space-around;
      margin-top: 1.25rem;

      .popone {
        width: 26%;
      }
      .poptwo {
        width: 50%;
        text-align: right;
      }
    }
  }
  .info {
    padding: 20px;
    // margin: 20px auto;
    background: #fff;
    .warn {
      width: 100%;
      text-align: center;
      color: #da2e63;
    }
    .title {
      width: 94%;
      height: 3.5rem;
      border-bottom: 1px solid #d6d6d6;
      text-align: left;
      padding-left: 20px;
      line-height: 3.5rem;
      font-size: 1.2rem;
      font-weight: 600;
    }
    .typeone {
      display: flex;
      justify-content: space-around;
      margin-top: 1.25rem;
      .popone {
        width: 26%;
      }
      .poptwo {
        width: 50%;
        text-align: right;
      }
    }
  }
  .btn {
    width: 60%;
    height: 3.125rem;
    margin: 0px auto;
    margin-top: 30px;
    border-radius: 1.5rem;
    background-color: #4470ff;
    color: white;
    line-height: 3.125rem;
    text-align: center;
  }
}
</style>