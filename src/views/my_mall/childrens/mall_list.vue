<!-- my_mall_list -->
<template>
  <div class="my_mall_list">
    <div class="btn confirm" @click="hanldeAdd">发布新产品</div>

    <van-pull-refresh class="list" v-model="isLoadRefresh" @refresh="refreshList">
      <van-list
        v-model="isLoading"
        :finished="isFinished"
        @load="pullList"
        :offset="100"
        finished-text="人家也是有底线的"
      >
        <div class="item" v-for="item in list" :key="item.id">
          <div class="item_info">
            <div class="item_avatar">
              <div class="avatar">
                <img :src="item.image" alt />
              </div>
              <div class="opr_state">{{item.status_text}}</div>
            </div>

            <div class="pro_info">
              <div class="pro_title">{{item.goods_name}}</div>

              <div class="pro_price">
                <span>售价：{{item.sale_price}}域石</span>
                <span>库存：{{item.qty}}</span>
              </div>

              <div class="item_info item_opt">
                <!-- @click="handleShelf(item)" -->
                <div class="opr_shelf" v-if="item.status===2" @click="handleEdit(item)">上架</div>
                <div class="opr_shelf" v-if="item.status===1" @click="handleDown(item.id)">下架</div>
                <div class="opr_del" @click="handleDel(item.id)">删除</div>
                <div class="opr_edit" @click="handleEdit(item)">编辑</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { setStore, removeStore } from '@/utils/utils'
export default {
  name: 'my_mall_list',
  components: {},
  data () {
    return {
      page: 0,
      isLoadRefresh: false,
      isLoading: false,
      isFinished: false,

      list: [],
    }
  },
  filters: {
    filterState (state) {
      if (state === 0) return '审核中'
      if (state === 1) return '上架中'
      if (state === 2) return '已下架'
    }
  },
  computed: {

  },
  methods: {
    refreshList () {
      this.page = 1
      console.log('下拉刷新')
      this.isLoadRefresh = false
      this.getMallList()
    },
    pullList () {
      console.log('上拉加载')
      this.page++
      this.getMallList()
    },

    getMallList () {
      console.log('获取列表')
      const page = this.page
      if (page === 0) return false
      if (page === 1) this.list = []
      this.$api.getMyProList({ p: this.page })
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

    // 新增
    hanldeAdd () {
      removeStore('myMallPro')
      this.$router.push('/my_mall_pub')
    },

    // 编辑
    handleEdit (info) {
      setStore('myMallPro', info)
      this.$router.push('/my_mall_pub')
    },


    // 上架
    handleShelf (item) {
      this.$dialog.confirm({
        message: '确认上架吗？'
      })
        .then(() => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })

          let { id = '', goods_name, image, qty, sale_price, market_price, shopping_price, contens, images } = item
          const params = { id, goods_name, image, qty, sale_price, market_price, shopping_price, contens, images }
          this.$api.postPubPro(params)
            .then(data => {
              this.$toast(data.data)
              if (data.code === 1) {
                this.getMallList()
              }
            })
          // this.$api.putMyMallShelf({ id })
          //   .then(data => {
          //     this.$toast(data.msg)
          //     if (data.code === 1) {
          //       this.getMallList()
          //     }
          //   })
        })
        .catch(err => { })
    },

    // 下架
    handleDown (id) {
      this.$dialog.confirm({
        message: '确认下架吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')
          this.$api.putMyMallDown({ __token__, id })
            .then(data => {
              this.$toast(data.msg)
              if (data.code === 1) {
                this.getMallList()
              }
            })
        })
        .catch(err => { })
    },

    // 删除
    handleDel (id) {
      this.$dialog.confirm({
        message: '确认删除吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          const __token__ = await this.$store.dispatch('getCommonToken')
          this.$api.delMyMallPro({ __token__, id })
            .then(data => {
              this.$toast(data.data)
              if (data.code === 1) {
                this.getMallList()
              }
            })
        })
        .catch(err => { })
    }

  },
  created () { },
  mounted () { }
}
</script>

<style lang='scss'>
.my_mall_list {
  .btn {
    margin-top: 1.6rem;
    margin: 1.6rem auto;
    width: 92%;
    font-size: 1.2rem;
  }

  .list {
  }

  .item {
    margin-bottom: 1.92rem;
    padding: 1.2rem;
    background: #34222f;
  }

  .item_info {
    display: flex;
    justify-content: space-between;
  }
  .item_avatar {
    margin-right: 1.6rem;
  }

  .avatar {
    width: 6.56rem;
    height: 6.24rem;
    // background: #eee;
  }

  .pro_info {
    flex: 1;
  }
  .pro_title {
    line-height: 1.92rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    min-height: 3.84rem;
  }
  .pro_price {
    display: flex;
    justify-content: space-between;
    margin-top: 0.8rem;
  }

  .item_opt {
    justify-content: flex-start;
    margin-top: 0.8rem;
    color: #da2e63;
    div {
      width: 33.3%;
    }
    div:first-child {
      text-align: left;
    }
    div:last-child {
      text-align: right;
    }
    div:nth-child(2) {
      text-align: center;
    }
  }

  .opr_state {
    margin-top: 0.48rem;
    text-align: center;
    color: #30ff1b;
  }
}
</style>