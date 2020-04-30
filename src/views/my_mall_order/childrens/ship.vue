<!-- my_mall_ship -->
<template>
  <van-popup class="my_mall_ship" v-model="isShowMd">
    <div class="header">发 货</div>
    <div class="content">
      <div class="buy_info">
        <div class="people">收货人：{{curInfo.ship_area_name}}</div>
        <div class="items">
          <div class="address">
            地址：
            <span id="share_address">{{curInfo.ship_area+curInfo.ship_area_address}}</span>
          </div>
          <div
            class="copy"
            data-clipboard-target="#share_address"
            data-clipboard-action="copy"
            id="copy_address"
            @click="handleCopyAddress"
          >复制</div>
        </div>
        <div class="items">
          <div class="tel">
            电话：
            <span id="share_tel">{{curInfo.ship_area_telphone}}</span>
          </div>
          <div
            class="copy"
            data-clipboard-target="#share_tel"
            data-clipboard-action="copy"
            id="copy_tel"
            @click="handleCopyTel"
          >复制</div>
        </div>
      </div>
      <van-field v-model="info.ship_name" clearable placeholder="请输入物流公司" />
      <van-field v-model="info.ship_code" clearable placeholder="请输入运单号" />

      <div class="btn_wrap">
        <div class="btn" @click="isShowMd =false">取 消</div>
        <div class="btn" :class="{'confirm':isConfirm}" @click="confirm">发 布</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import ClipboardJS from 'clipboard'
export default {
  name: 'my_mall_ship',
  components: {},
  props: {
    isShow: Boolean,
    curInfo: Object
  },
  data () {
    return {
      info: {
        ship_name: '',
        ship_code: '',
      }
    }
  },
  computed: {
    isShowMd: {
      get () {
        return this.isShow
      },
      set (val) {
        this.info.ship_name = ''
        this.info.ship_code = ''
        this.$emit('update:isShow', val)
      }
    },
    isConfirm () {
      return this.info.ship_name && this.info.ship_code
    }
  },
  methods: {
    handleCopyAddress () {
      this.$nextTick(() => {
        const btn = document.querySelector('#copy_address')
        var copyBtn = new ClipboardJS(btn)
        copyBtn.on("success", (e) => {
          this.$toast('复制成功')
          e.clearSelection();
        });
        copyBtn.on("error", function (e) {
          console.log(e.action)
        });
      })
    },
    handleCopyTel () {
      this.$nextTick(() => {
        const btn = document.querySelector('#copy_tel')
        var copyBtn = new ClipboardJS(btn)
        copyBtn.on("success", (e) => {
          this.$toast('复制成功')
          e.clearSelection();
        });
        copyBtn.on("error", function (e) {
          console.log(e.action)
        });
      })
    },
    validate () {

      const { ship_name, ship_code } = this.info

      let res = true

      if (ship_name === '') {
        this.$toast('请输入物流公司')
        res = false
        return false
      }


      if (ship_code === '') {
        this.$toast('请输入运单号')
        res = false
        return false
      } else if (!/^\d+$/.test(ship_code)) {
        this.$toast('请输入正确的运单号')
        res = false
        return false
      }


      return res
    },
    confirm () {
      const res = this.validate()
      if (!res) return false

      this.$dialog.confirm({
        message: '确认发货吗？',
        className: 'my_ship'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')
          const id = this.curInfo.id
          this.$api.postMyMallShip({ id, __token__, ...this.info })
            .then(data => {
              this.$toast(data.msg)
              if (data.code === 1) {
                this.$emit('changeData')
              }
              console.log(data)
            })
        })
        .catch(err => { })
    }
  },
  created () { },
  mounted () {
  }
}
</script>

<style lang='scss'>
.app .my_mall_ship {
  padding: 0.8rem;
  width: 23.36rem;
  background: #da2e63;
  border-radius: 0.4rem;
  .header {
    text-align: center;
    font-size: 1.28rem;
  }
  .van-field {
    background: transparent;
  }
  .van-field__control {
    color: #fff;
  }
  .btn_wrap {
    display: flex;
    justify-content: space-between;
  }
  .btn {
    background: transparent;
  }
  .confirm {
    color: #fff;
  }
  .buy_info {
    margin: 0 1.2rem;
    margin-bottom: 0.8rem;
  }
  .people {
    margin-top: 0.4rem;
    margin-bottom: 10px;
  }
  .items {
    display: flex;
    justify-content: space-between;
    font-size: 0.96rem;
    margin-bottom: 0.8rem;
  }
  .address {
    flex: 1;
    line-height: 1.44rem;
  }
  .copy {
    margin-left: 1.6rem;
    font-size: 1.12rem;
  }
}

.app .my_ship {
  z-index: 10001 !important;
}
</style>