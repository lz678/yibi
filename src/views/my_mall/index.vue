<!-- my_mall -->
<template>
  <div class="my_mall">
    <van-nav-bar
      fixed
      title="我的商城"
      left-arrow
      @click-left="$router.go(-1)"
      right-text="订单管理"
      @click-right="$router.push('/my_mall_order')"
    />

    <div class="valid_tip" v-if="isValid">您已提交开店申请，请等待系统审核！预计3个工作日内</div>

    <div v-if="!isValid">
      <component :is="curCom" @changeData="handleData" />
    </div>
  </div>
</template>

<script>
import noMall from './childrens/open_mall'
import mallList from './childrens/mall_list'
export default {
  name: 'my_mall',
  components: {},
  data () {
    return {
      isOpen: false,
      isValid: false,
      curCom: ''
    }
  },
  computed: {},
  methods: {
    checkMyMall () {
      this.$api.checkMyMall()
        .then(data => {
          console.log(data, 'fffffff')
          if (data.code === 1 && data.data === '已开通') {
            console.log(1)
            this.isValid = false
            this.isOpen = true
            this.curCom = mallList
          } else {
            if (data.msg === '待审核') {
              console.log(2)
              this.isValid = true
              this.isOpen = false
            } else {
              console.log(3)
              this.isValid = false
              this.isOpen = false
              this.curCom = noMall
            }
          }
        })
    },

    handleData (info) {
      if (info === 'open') {
        this.isOpen = true
        this.curCom = 'mallList'
      }
    }
  },
  created () {
    this.checkMyMall()
  },
  mounted () { }
}
</script>

<style lang='scss'>
.my_mall {
  padding-top: 4rem;
  .valid_tip {
    margin-top: 1.2rem;
    text-align: center;
    color: red;
  }
}
</style>