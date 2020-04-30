
<template>
  <div class="nav_bar">
    <div
      class="nav_item"
      :class="{'active':isActive(item.route)}"
      v-for="(item,index) in navList"
      :key="index"
      @click="jump(item.route)"
    >
      <div class="icon">
        <img :src="isActive(item.route)?item.iconHl:item.icon" alt />
      </div>

      <div class="nav_title">{{item.title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bav_bar',
  components: {},
  data () {
    return {
      navList: [
        {
          title: '首页',
          icon: require('@/assets/images/shou.png'),
          iconHl: require('@/assets/images/shou1.png'),
          route: '/layout/mall'
        },
        {
          title: '交易',
          icon: require('@/assets/images/jy.png'),
          iconHl: require('@/assets/images/jy1.png'),
          route: '/layout/market'
        },
        {
          title: '订单',
          icon: require('@/assets/images/ding1.png'),
          iconHl: require('@/assets/images/ding.png'),
          route: '/layout/order'
        }, {
          title: '个人',
          icon: require('@/assets/images/ge.png'),
          iconHl: require('@/assets/images/ge1.png'),
          route: '/layout/me'
        }
      ]
    }
  },
  computed: {},
  methods: {
    isActive (route) {
      return this.$route.path === route
    },

    jump (route) {
      this.$router.push(route)
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang="scss" scoped>

.nav_bar {
  position: fixed;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 4rem;
  color: black;
  text-align: center;
  font-size: 0.9rem;
  background: #fff;
  border-top: 1px solid #ededed;
  z-index: 2011;

  .nav_item {
    width: 20%;
    // border: 1px solid red;
    text-align: center;
    color: #929292;
  }

  .active {
    color: #1b1788;
  }

  .icon {
    width: 40%;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }
 .nav_title{
   width: 60%;
   margin: 0 auto;
   text-align: center;
 }
}
</style>