<template>
  <div class="transaction_user_info">
    <van-popup v-model="isShowMd">
      <div class="header">
        <div class="title">对方信息</div>
        <div class="tip">注：请注意确认对方信息是否正确！</div>
      </div>
      <div class="content">
        <p>
          应支付：
          <span class="col_red">{{info.total_money}}元</span>
        </p>
        <p>对方姓名：{{info.realname}}</p>
        <p>对方手机号：{{info.mobile}}</p>
        <p>对方微信号：{{info.mobile}}</p>
        <p v-if="info.zfb">
          对方支付宝：
          <span id="code_text">{{info.zfb}}</span>
        </p>
        <p v-if="!info.isSall">微信收款显示：未添加</p>
        <p v-if="!info.isSall">银行卡信息：未添加</p>
      </div>

      <div class="btn_wrap">
        <div
          class="btn copy"
          id="copyAliPay"
          data-clipboard-target="#code_text"
          data-clipboard-action="copy"
          v-if="info.zfb"
        >复制支付宝账号</div>
        <div class="btn" @click="isShowMd= false">关闭</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
export default {
  name: 'transaction_user_info',
  props: {
    isShow: Boolean,
    info: Object
  },

  data () {
    return {}
  },

  computed: {
    isShowMd: {
      get () {
        return this.isShow
      },
      set (val) {
        this.$emit('update:isShow', val)
      }
    }
  },
  watch: {
    isShowMd (n) {
      if (n && this.info.zfb) {
        this.$nextTick(() => {
          const btn = document.querySelector('#copyAliPay')
          console.log(btn, ClipboardJS, 'dfddsfsdf')
          var copyBtn = new ClipboardJS(btn)
          copyBtn.on("success", (e) => {
            // 复制成功
            // console.log('复制成功==>', e)
            this.$toast('复制成功')
            this.isShowOpt = false
            e.clearSelection();
          });
          copyBtn.on("error", function (e) {
            //复制失败；
            console.log(e.action)
          });
        })
      }
    }
  },
  methods: {

  },

  created () { },

  mounted () {

  },
}

</script>
<style lang='scss'>
.transaction_user_info {
  .van-popup--center {
    padding: 1.6rem 3.2rem;
    width: 82%;
    border-radius: 10px;
    text-align: center;
    z-index: 20330 !important;
  }

  .title {
    font-size: 1.28rem;
    font-weight: bold;
  }
  .tip {
    margin-top: 1.44rem;
    font-size: 0.96rem;
    color: #999;
  }

  .content {
    margin-top: 2.4rem;
    text-align: left;
    font-size: 14px;
  }
  .btn_wrap {
    margin-top: 3.2rem;
  }

  .btn {
    margin: 1.2rem auto;
    width: 100%;
    height: 2.72rem;
    line-height: 2.72rem;
    border: 1px solid #aaaaaa;
    border-radius: 2.72rem;
    font-size: 1.12rem;
    color: #fff;
  }

  .btn.copy {
    border: 1px solid #da2e63;
    background: #da2e63;
    color: #fff;
  }
}
</style>