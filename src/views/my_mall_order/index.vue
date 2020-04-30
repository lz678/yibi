<!-- my_mall_order -->
<template>
  <div class="my_mall_order">
    <van-nav-bar fixed title="订单管理" left-arrow @click-left="$router.go(-1)" />
    <div class="main">
      <van-pull-refresh class="list" v-model="isLoadRefresh" @refresh="refreshList">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          @load="pullList"
          :offset="100"
          finished-text="人家也是有底线的"
        >
          <div class="item" v-for="item in list" :key="item.id">
            <div class="item_top">
              <div class="item_id">兑换编号：{{item.order_sn}}</div>
              <div class="item_status" v-if="item.order_status===1">已结算：{{item.pay_seller}}域石</div>
              <div class="item_status" v-if="item.order_status!==1">{{item.order_status_txt}}</div>
            </div>

            <div class="item_title van-ellipsis">{{item.goods?item.goods.name:''}}</div>
            <div class="item_time">购买时间：{{item.createtime}}</div>

            <div class="item_price">
              <div>购买价格：{{item.order_amount}}域石</div>
              <div>买家电话：{{item.ship_area_telphone}}</div>
            </div>

            <div class="item_price">
              <div v-if="item.order_status===1">物流状态：{{item.ship_comany}} {{item.ship_code}}</div>
              <div v-if="item.order_status!==1">物流状态：{{item.order_status_txt}}</div>
            </div>
            <div class="remark">
              用户备注:
              <span>{{item.remark}}</span>
            </div>
            <!--  -->
            <div class="item_top">
              <div
                class="btn confirm"
                v-if="item.is_return===3"
                @click="handleBack(item.id,false)"
              >拒绝退款</div>
              <div
                class="btn confirm"
                v-if="item.is_return===3"
                @click="handleBack(item.id,true)"
              >同意退款</div>

              <div
                class="btn confirm"
                v-if="item.order_status===2"
                @click="handleRefund(item.id)"
              >退款</div>

              <div class="btn confirm" v-if="item.order_status===2" @click="handleShip(item)">发货</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <mall-ship :isShow.sync="isShowShip" :curInfo="curInfo" @changeData="handleChangeShip" />
  </div>
</template>

<script>
import mallShip from './childrens/ship'
export default {
  name: 'my_mall_order',
  components: { mallShip },
  data () {
    return {
      page: 0,
      isLoadRefresh: false,
      isLoading: false,
      isFinished: false,
      list: [],
      isShowShip: false,
      curInfo: {}
    }
  },
  computed: {},
  methods: {
    refreshList () {
      this.page = 1
      console.log('下拉刷新')
      this.isLoadRefresh = false
      this.getMyMallOrder()
    },
    pullList () {
      console.log('上拉加载')
      this.page++
      setTimeout(() => {
        this.getMyMallOrder()
      }, 3000)

    },

    getMyMallOrder () {
      console.log('获取列表')
      const page = this.page
      if (page === 0) return false
      if (page === 1) this.list = []
      this.$api.getMyMallOrder({ p: this.page })
        .then(data => {
          console.log(data)
          this.isLoadRefresh = false
          this.isLoading = false
          if (data.code === 1) {
            if (data.data.rows) {
              this.list.push(...data.data.rows)
            }

            if (data.data.total / 10 <= page) {
              this.isFinished = true
            } else {
              this.isFinished = false
            }
          } else {
            this.isLoadRefresh = false
            this.isLoading = false
            this.isFinished = true
          }
        })
    },

    handleRefund (id) {
      this.$dialog.confirm({
        message: '确认退款吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')
          this.$api.postMyMallRefund({ __token__, id })
            .then(data => {
              this.$toast(data.msg)
              if (data.code === 1) {
                this.getMyMallOrder()
              }
            })
        })
        .catch(err => { })

    },

    handleBack (id, type) {
      this.$dialog.confirm({
        message: `确认要${type ? '同意' : '拒绝'}退款吗？`
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')
          let api = type ? 'myMallApplyAgreeBack' : 'myMallApplyCancelBack'
          this.$api[api]({ __token__, id })
            .then(data => {
              this.$toast(data.msg)
              if (data.code === 1) {
                this.getMyMallOrder()
              }
            })
        })
        .catch(err => { })
    },

    handleShip (info) {
      console.log(info, 'ddddddd')
      this.curInfo = info
      this.isShowShip = true
    },
    handleChangeShip () {
      this.isShowShip = false
      this.getMyMallOrder()
    }
  },
  created () { },
  mounted () { }
}
</script>

<style lang='scss'>
.my_mall_order {
  padding-top: 4rem;

  .item {
    margin: 1.2rem 0;
    padding: 0.8rem 1.2rem;
    background: #34222f;
    line-height: 1.44rem;
  }

  .item_top {
    display: flex;
    justify-content: space-between;
    font-size: 1.12rem;
  }

  .item_status,
  .item_time {
    font-size: 0.96rem;
  }

  .item_title {
    line-height: 1.6rem;
    font-size: 1.2rem;
  }

  .item_price {
    display: flex;
    justify-content: space-between;
    font-size: 0.96rem;
    color: #da2e63;
  }

  .btn {
    margin-top: 10px;
    width: 11.84rem;
    height: 2.88rem;
    line-height: 2.88rem;
    font-size: 1.12rem;
    color: #ccc;
  }

  .my_mall_ship {
    z-index: 10000 !important;
  }
  .remark {
    margin-top: 0.4rem;
    font-size: 12px;
    span {
      color: #da2e63;
    }
  }
}
</style>