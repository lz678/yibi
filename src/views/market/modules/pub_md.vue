<!-- market_md" -->
<template>
  <van-popup class="market_md" v-model="isShowMd">
    <div class="header">
      <div class="close"></div>
      <span class="title">发布求购</span>
      <div class="close" @click="isShowMd = false">
        <van-icon name="close" />
      </div>
    </div>
    <div class="content">
      <van-field
        v-model="info.money"
        clearable
        label="单价(¥)"
        placeholder="请输入单价"
        :disabled="isUpdatePrice"
      >
        <div slot="right-icon" class="right_icon">
          <van-switch v-model="isUpdatePrice" size="20px" active-color="#da2e63" />
          <van-icon name="warning-o" @click="handlePriceTip" />
        </div>
      </van-field>
      <van-field
        v-model="info.yijia"
        clearable
        :disabled="!isYijia"
        label="溢价倍数"
        placeholder="请输入溢价"
      >
        <div slot="right-icon" class="right_icon">
          <van-switch v-model="isYijia" size="20px" active-color="#da2e63" />
          <van-icon name="warning-o" @click="handleYijiaTip" />
        </div>
      </van-field>
      <van-field v-model="info.num" clearable label="数    量" placeholder="请输入数量" />

      <van-field
        v-model="info.tradepass"
        type="password"
        clearable
        label="安全密码"
        placeholder="请输入安全密码"
      />

      <div class="btn_wrap">
        <div class="btn" :class="{'confirm':isConfirm}" @click="confirm">发 布</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'market_md',
  components: {},
  props: {
    isShow: Boolean,
    total: Object
  },
  data () {
    return {
      isUpdatePrice: true,
      isYijia: false,

      minNum: 1,
      maxNum: 1,

      info: {
        money: '',
        yijia: '',
        num: '',
        tradepass: ''
      }

    }
  },
  computed: {
    isShowMd: {
      get () {
        return this.isShow
      },
      set (val) {
        this.tradepass = ''
        this.$emit('update:isShow', val)
      }
    },
    isConfirm () {
      return this.info.money && this.info.num && this.info.tradepass
    }
  },

  watch: {
    isShowMd (n) {
      if (n) {
        this.info.money = this.total.today_trade_price
        this.getNumRang()
      } else {
        this.info = {
          money: '',
          yijia: '',
          num: '',
          tradepass: ''
        }
      }
    },
    isUpdatePrice: {
      handler (n) {
        if (n) {
          this.info.money = this.total.today_trade_price
        } else {
          this.info.money = ''
        }
      },
      immediate: true
    },
  },
  methods: {
    getNumRang () {
      this.$api.getNumRang()
        .then(data => {
          if (data.code === 1) {
            this.minNum = data.data.min
            this.maxNum = data.data.max
          }
        })
    },

    handlePriceTip () {
      this.$dialog.alert({
        title: '价格同步说明',
        messageAlign: 'left',
        message: '1、开启价格同步后，您求购的域石的价格将和系统的每日价格保持一致，即：随着系统的价格变化而变化；\n\n2、关闭价格同步后，您求购域石的价格将和发布当天系统的价格一致，并保持不变；\n\n3、价格同步默认开启。'
      }).then(() => { });
    },
    handleYijiaTip () {
      this.$dialog.alert({
        title: '溢价说明',
        messageAlign: 'left',
        message: '1、开启溢价后，您求购的域石价格将乘以溢价倍数；同时您发布的求购订单，将不会显示在求购列表中，卖家只能通过搜索手机号和您进行交易；\n\n2、溢价倍数请设置在1.1-5.0倍之间；\n\n3、溢价默认关闭。'
      }).then(() => { });
    },

    validate () {
      let res = true
      const { money, yijia, num, tradepass } = this.info

      if (!this.isUpdatePrice) {
        let reg = /^\d*(\.\d{1,2})?$/
        if (money === '') {
          res = false
          this.$toast('请输入单价')
          return false
        } else if (!reg.test(money)) {
          res = false
          this.$toast('请输入正确的单价')
          return false
        }
      }


      if (this.isYijia) {
        let reg = /^[1-5](\.\d{1})?$/
        if (yijia === '') {
          res = false
          this.$toast('请输入溢价')
          return false
        } else if (!reg.test(yijia) || yijia > 5 || yijia <= 1) {
          res = false
          this.$toast('溢价在1.1-5之间')
          return false
        }
      }
      if (num === '') {
        res = false
        this.$toast('请输入数量')
        return false
      } else if (Number(num) > this.maxNum || Number(num) < this.minNum) {
        res = false
        this.$toast(`数量在${this.minNum}-${this.maxNum}之间`)
        return false
      }

      if (tradepass === '') {
        res = false
        this.$toast('请输入交易密码')
        return false
      }

      return res
    },

    async  confirm () {
      const res = this.validate()
      if (!res) return false
      this.$toast.loading({
        mask: true,
        duration: 0,
        message: '提交中...'
      })
      const __token__ = await this.$store.dispatch('getCommonToken')
      const { money, yijia, num, tradepass } = this.info

      this.$api.getMarketDoBuy({ money, yijia, num, tradepass, is_syn: !!this.isUpdatePrice, __token__ })
        .then(data => {
          if (data.code === 1) {
            this.$toast(data.msg)
            this.$emit('changeData')
            this.isShowMd = false
          } else {
            this.$toast(data.msg)
          }
        })
    },
  },
  created () {

  },
  mounted () { }
}
</script>

<style lang='scss'>
// .van-overlay {
//   z-index: 2012 !important;
// }
// .market_md {
//   z-index: 2013 !important;
//   .header {
//     display: flex;
//     align-items: center;
//   }
//   .title {
//     flex: 1;
//     text-align: center;
//     font-size: 1.44rem;
//   }
//   .close {
//     width: 1.6rem;
//     height: 1.6rem;
//     font-size: 1.6rem;
//   }

//   .content {
//     margin-top: 2.4rem;
//   }
//   .sell_item {
//     display: flex;
//     align-items: center;
//     font-size: 1.44rem;
//     line-height: 4rem;

//     .label {
//       width: 5rem;
//       margin-right: 2.8rem;
//       color: #bc0d46;
//       span {
//         margin-left: 1.5rem;
//       }
//     }
//     .value {
//       flex: 1;
//     }
//   }
//   .van-field {
//     margin-top: 1.6rem;
//     border-radius: 1.36rem;
//     border: 0.08rem solid #da2e63;
//   }
//   .van-cell {
//     padding: 0.72rem 1.28rem;
//   }
//   .van-cell__title {
//     margin-left: 0;
//   }
//   .van-field__label {
//     width: 5.6rem;
//     border-right: 1px solid #da2e63;
//   }
//   .van-field__control::-webkit-input-placeholder {
//     color: #fff;
//   }
//   .van-field__control {
//     color: #fff;
//   }
//   .btn {
//     margin-top: 2.4rem;
//     margin-bottom: 10px;
//   }

//   .right_icon {
//     display: flex;
//     align-items: center;
//   }
//   .van-icon-warning-o {
//     margin-left: 0.4rem;
//     font-size: 1.6rem;
//     color: #da2e63;
//   }
//   .van-switch__node {
//     background: #31222d;
//   }
// }
</style>