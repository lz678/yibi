<!-- market_md" -->
<template>
  <van-popup class="market_md" v-model="isShowMd">
    <!-- 头部 -->
    <div class="header">
      <!-- <div class="close"></div> -->
      支付
      <!-- <div class="close" @click="isShowMd = false">
        <van-icon name="close" />
      </div>-->
    </div>
    <!-- 中间部分 -->
    <div class="content">
      <div class="sell_item">
        <div class="label">{{inf.btname}}单价</div>
        <div class="value">¥{{inf.price}}</div>
      </div>
     
      <div class="sell_item">
        <div class="label">总价</div>
        <!-- <div class="value">¥{{(inf.price)*number}}</div> -->
        <div class="value">¥{{all}}</div>
      </div>
      <!-- <div class="charge">手续费：{{inf.id}}</div> -->

      <van-field
        style="width:96%;margin:10px auto;"
        v-model="inf.num"
        readonly
        :label="inf.btname|purchar"
        placeholder="请输入数量"
      ></van-field>
      <div class="warn">注：最小购买或卖出个数为1个</div>
      <!-- <div class="foot">
        <div class="footitem">
          <div class="tyone">卖家</div>
          <div class="tytwo">{{other.realname}}</div>
        </div>
        <div class="footitem">
          <div class="tyone">真实姓名</div>
          <div class="tytwo">{{other.zfb_number}}</div>
        </div>
        <div class="footitem">
          <div class="tyone">手机号</div>
          <div class="tytwo">{{other.mobile}}</div>
        </div>
        <div class="footitem">
          <div class="tyone">支付宝号</div>
          <div class="tytwo">{{other.nickname}}</div>
        </div>
      </div> -->
      <!-- <van-field v-model="tradepass" type="password" clearable label="安全密码" placeholder="请输入安全密码" /> -->

      <!-- <van-field class="password" v-model="tradepass" placeholder="请输入验证码"> -->
      <!-- <div slot="left-icon">
          <div class="login_icon">
            <img class="icon" slot="left-icon" src="./static/images/login_code.png" alt />
          </div>
      </div>-->

      <!-- :disabled="isDisabled" -->
      <!--  @click="getValidImg" -->
      <!-- <van-button
          slot="button"
          class="code_btn"
          size="small"
          type="primary"
          @click="getSmsCode"
      >发送验证码</van-button>-->
      <!--          
          v-if="!showReminderTime"
      :disabled="!info.mobile" <div class="verify_timer" slot="button" v-else>重新发送({{reminderTime}}s)</div>-->
      <!-- </van-field> -->
      <van-field
        style="width:88%;margin:10px auto;"
        v-model="pwd"
        label="支付密码"
        placeholder="请输入支付密码"
        type="password"
      ></van-field>
      <div class="warn">注：线下支付后请上传支付凭证，请核对收款账户，如收款账户与收款人信息不符，严谨付款！</div>
      <div class="btn" :class="{'confirm':tradepass}" @click="getCommonMarket">确定支付</div>
    </div>
  </van-popup>
</template>

<script>
import { getStore } from "@/utils/utils";
export default {
  name: "market_md",
  components: {},
  props: {
    isShow: Boolean,
    inf: ""
  },
  data() {
    return {
      total:'',
      tradepass: "",
      mobile: "",
      number: "",
      pwd:'',
      other: "",
      aid:''
    };
  },
  computed: {
    all(){
      return this.inf.price*this.inf.num
    },
    isShowMd: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.tradepass = "";
        this.$emit("update:isShow", val);
      }
    }
  },
  filters: {
    purchar(a) {
      return a + "数量";
    }
  },
  methods: {
    getCommonMarket(){
      this.$api.getCommonMarket({
        id:this.aid,
        price:this.inf.price,
        total_price:this.all,
        amount:this.inf.num,
        changePwd:this.pwd
      })
        .then((data)=>{
          this.isShowMd=false
          this.$toast(data.msg)
            console.log(data);
          if(data.code===1){
            console.log(data);
            this.$toast(data.msg)
            this.isShowMd=false
          }else(
            this.$toast(data.msg)
          )
        })
    },
    getother() {
      console.log(this.aid);

      // const id = this.inf.aid;
      this.$api.getother({ id:this.aid }).then(data => {
        console.log(data);
        if (data.code === 1) {
          this.other = data.data.info;
        }
        if(data.code === 0){
          this.$toast(data.msg)
        }

      });
    },
    getSmsCode() {
      this.$api
        .getSmsCode({
          mobile: this.mobile,
          event: "sale"
        })
        .then(data => {
          if (data.code === 1) {
            this.$toast("验证码已发送");
          } else {
            this.$toast(data.msg);
          }
        });
    },

    validate() {
      console.log(213);
      let res = true;
      const tradepass = this.tradepass;
      if (tradepass === "") {
        res = false;
        this.$toast("请输入短信验证码");
        return false;
      }
      return res;
    },

    async handleSale() {
      const res = this.validate();
      if (!res) return false;
      this.$toast.loading({
        mask: true,
        duration: 0,
        message: "提交中..."
      });
      const __token__ = await this.$store.dispatch("getCommonToken");
      console.log(__token__);
      this.$api
        .getMarketMatchSale({
          id: this.info.id,
          tradepass: this.tradepass,
          __token__
        })
        .then(data => {
          if (data.code === 1) {
            this.$toast(data.msg);
            this.$emit("changeData");
            this.isShowMd = false;
          } else {
            this.$toast(data.msg);
          }
        });
    }
  },
  created() {
    // this.getother();
    const mobile = getStore("userInfo").mobile;
    console.log(mobile, "mobilemobile");
    this.mobile = mobile;
  },
  mounted() {}
};
</script>

<style lang='scss' >
.van-overlay {
  z-index: 2012 !important;
}
.market_md {
  width: 82%;
  // height: 84vh;
  border-radius: 4px;
  z-index: 2013 !important;
  // .header {
  //   display: flex;
  //   align-items: center;
  // }
  .header {
    // flex: 1;
    width: 100%;
    height: 4rem;
    // border-bottom: 1px solid red;
    text-align: center;
    line-height: 3.4rem;
    font-size: 1.4rem;
  }
  .foot {
    width: 100%;
    margin-top: 10px;
    background-color: #f9f9f9;
    .footitem {
      padding: 10px;
      display: flex;
      font-size: 1.2rem;
      justify-content: space-around;
      .tyone {
        width: 30%;
      }
      .tytwo {
        text-align: right;
        width: 40%;
      }
    }
  }
  .sell_item {
    width: 100%;
    height: 4.5rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 1.2rem;
    // line-height: 4rem;

    .label {
      width: 40%;
    
      color: #505050;
       
    }
    .value {
      width: 20%;
      text-align: center;
      color: #f44c4c;
      
    }
  }
  .btn {
    width: 76%;
    height: 3.4rem;
    text-align: center;
    line-height: 3.4rem;
    margin: 26px auto;
   
    color: white;
    background-color: #4470ff;
   
    
  }
  .charge {
    width: 30%;
    margin-top: 0.625rem;
    margin-left: 12%;
    font-size: 0.8rem;
    color: #f44c4c;
  }
  .warn {
    width: 80%;
    margin-top: 1rem;
    margin-left: 12%;
    font-size: 0.8rem;
    color: #f44c4c;
  }
  .van-field {
    border: transparent;
    // width: 2rem;
  }
  // .password .van-field__left-icon {
  //   margin-right: 0.8rem;
  // }

  .van-field__control {
    // width: 100%;
    font-size: 1.2rem;
     
  }

}
</style>