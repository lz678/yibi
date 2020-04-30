<!-- server -->
<template>
  <div class="server">
    <van-nav-bar fixed title="服 务 商" left-arrow @click-left="$router.go(-1)" />
    <div class="main">
      <div class="section">
        <div class="s_item">
          <div class="s_title">押金： {{money.amount}}域石</div>
          <div class="s_status">{{money.status ?'达标':'未达标'}}</div>
        </div>
        <!-- <div class="s_item">
          <div class="s_btn" :class="{'active':hasStop}" @click="handleStop(hasStop)">提 取</div>
        </div>-->
      </div>

      <div class="section s_2" v-if="shops.qty">
        <div class="s_item">
          <div class="s_title">{{shops.name}}{{shops.qty>1?'x'+shops.qty:''}}</div>
          <div class="s_status">{{shops.status?'达标':'未达标'}}</div>
        </div>
      </div>

      <div class="btn_wrap" v-if="biz.istrader&&biz.trader_status!==0">已开通</div>

      <div
        class="btn_wrap active"
        v-if="biz.istrader===0"
        @click="handleOpen"
      >剩余名额：{{info.needPeople}}立即开通</div>

      <div class="s_item s_item_wrap" v-if="biz.istrader&&biz.trader_status===0">
        <div class="s_btn active" @click="handleExtension">申请延期</div>
        <div class="s_btn active" @click="handleStop">申请退出</div>
      </div>

      <div class="section" v-if="biz.istrader">
        <div class="s-itme">业绩达标情况</div>
        <div class="s-itme s_status open_time">开通服务商时间：{{info.open_time}}</div>

        <div class="list">
          <div class="s_item l_header">
            <div class="l_item_left">周期</div>
            <div class="l_item_center">达标比例</div>
            <div class="l_item_right">已完成</div>
          </div>

          <div class="s_item l_item" v-for="item in jobs" :key="item.id">
            <div class="l_item_left">{{item.name}}</div>
            <div class="l_item_center">{{item.money}}</div>
            <div class="l_item_right">{{item.buy_moeny}}</div>
          </div>
        </div>

        <div class="s-itme s_status close_time">到期时间：{{info.end_time}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'server',
  components: {},
  data () {
    return {
      biz: {},
      jobs: {},
      money: {},
      shops: {},
      info: {}
    }
  },
  computed: {
    hasStop () {
      const endTime = new Date(this.info.end_time).getTime()
      const isOpen = this.biz.istrader
      const now = new Date().getTime()
      const hasStop = now > endTime
      console.log(isOpen, hasStop)
      if (isOpen && hasStop) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getServiceProviderStatus () {
      this.$api.getServiceProviderStatus()
        .then(data => {
          if (data.code === 1) {
            const { biz, jobs, money, shops, info } = data.data
            this.biz = biz
            this.jobs = jobs
            this.money = money
            this.shops = shops
            this.info = info
          } else {
            this.$toast(data.msg)
          }
        })
    },

    handleOpen () {
      this.$dialog.confirm({
        message: '确认要开通吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')
          this.$api.openServiceProvider({ __token__ })
            .then(data => {
              console.log(data, 'klklkl')
              this.$toast(data.msg)
              if (data.code === 1) {
                this.getServiceProviderStatus()
              }
            })
        })
        .catch(err => { })
    },

    handleExtension () {
      this.$dialog.confirm({
        message: '确认要延期吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')

          this.$api.extensionServiceProvider({ __token__ })
            .then(data => {
              if (data.code === 1) {
                this.getServiceProviderStatus()
              }
              this.$toast(data.msg)
            })
        })
        .catch(err => { })

    },

    handleStop () {
      this.$dialog.confirm({
        message: '确认要提取吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')

          this.$api.stopServiceProvider({ __token__ })
            .then(data => {
              if (data.code === 1) {
                this.getServiceProviderStatus()
              }
              this.$toast(data.msg)
            })
        })
        .catch(err => { })

    }
  },
  created () {
    this.getServiceProviderStatus()
  },
  mounted () { }
}
</script>

<style lang='scss'>
.server {
  padding-top: 4rem;
  .main {
    padding: 2.4rem 1.2rem;
  }
  .section {
    margin-bottom: 0.8rem;
    padding: 1.2rem 1.6rem;
    background: #34222f;
    border-radius: 0.4rem;
  }
  .s_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
  }
  .s_title {
  }
  .s_status {
    color: #e67300;
  }
  .s_btn {
    margin-top: 1.2rem;
    width: 13rem;
    height: 2.8rem;
    line-height: 2.8rem;
    text-align: center;
    background: #818181;
    border-radius: 0.4rem;
  }

  .s_2 {
    padding: 1.6rem;
  }
  .btn_wrap {
    margin-bottom: 4rem;
    height: 3.52rem;
    line-height: 3.52rem;
    text-align: center;
    border-radius: 0.4rem;
    background: #818181;
    font-size: 1.2rem;
  }

  .s_item_wrap {
    margin-bottom: 4rem;
  }
  .open_time {
    margin-top: 0.48rem;
  }
  .list {
    margin-top: 0.64rem;
    padding-top: 0.8rem;
    border-top: 1px solid #979797;
  }
  .l_item {
    margin-top: 1.6rem;
    font-size: 0.96rem;
    color: #acacac;
  }
  .l_item_left {
    width: 16%;
    text-align: left;
  }
  .l_item_center {
    width: 33.3%;
    text-align: center;
  }
  .l_item_right {
    width: 16%;
    text-align: center;
  }
  .close_time {
    margin-top: 1.2rem;
    margin-bottom: 4rem;
    font-size: 0.96rem;
  }
  .active {
    background: #da2e63;
  }
}
</style>