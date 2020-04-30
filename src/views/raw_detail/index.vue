<!-- stone_detail -->
<template>
  <div class="stone_detail">
    <van-nav-bar fixed title="原石明细" left-arrow @click-left="$router.go(-1)" />
    <van-pull-refresh class="list" v-model="isLoadRefresh" @refresh="refreshList">
      <van-list v-model="isLoading" :finished="isFinished" @load="pullList" :offset="100">
        <div class="stone_item" v-for="item in list" :key="item.id">
          <div class="top">
            <div class="top_left">余额：{{Number(item.after)}}</div>
            <div class="top_right">变动金额 {{Number(item.stone)}}</div>
          </div>
          <div class="bottom">
            <div class="bottom_left">{{item.createtime}}</div>
            <div class="bottom_right">{{item.memo}}</div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'stone_detail',
  components: {},
  data () {
    return {
      isLoadRefresh: false,
      isLoading: false,
      isFinished: false,

      page: 0,
      list: []
    }
  },
  computed: {},
  methods: {
    refreshList () {
      this.page = 1
      console.log('下拉刷新')
      this.isLoadRefresh = false
      this.getGoldDetails()
    },
    pullList () {
      console.log('上拉加载')
      this.page++
      this.getGoldDetails()
    },

    getGoldDetails () {
      const page = this.page
      console.log('获取列表')
      this.$api.getRawDetails({ p: this.page })
        .then(data => {
          console.log(data)
          this.isLoadRefresh = false
          this.isLoading = false
          if (data.code === 1) {
            if (page === 1) {
              this.list = data.data.list
            } else {
              this.list.push(...data.data.list)
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
    }
  },
  created () { },
  mounted () { }
}
</script>

<style lang='scss'>
.stone_detail {
  padding-top: 4rem;

  .list {
    padding: 0 1.6rem;
  }
  .stone_item {
    padding: 1.2rem 0;
    line-height: 1.6rem;
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);
  }
  .top,
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .top {
    font-size: 1.2rem;
  }
  .bottom {
    font-size: 0.96rem;
  }
}
</style>