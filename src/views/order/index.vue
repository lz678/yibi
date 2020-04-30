<!-- me_order -->
<template>
  <div class="me_order">
    <!-- <div class="nav">
      <div class="navitem" v-for="(item,index) in namelist" :key="index">
        {{item.name}}
      </div>
    </div>
    <div style="background-color:#F4F4F4;width:100%;height:6px"></div>-->
    <van-nav-bar fixed title="我的订单" left-arrow @click-left="$router.go(-1)" />

    <van-tabs v-model="curTab" sticky :offset-top="45" :ellipsis="false" @click="change">
      <van-tab title="买入">
        <order-list ref="list" :tab="0" />
      </van-tab>
      <van-tab title="卖出">
        <order-list ref="list" :tab="1" />
      </van-tab>
      <van-tab title="交易中">
        <order-list ref="list" :tab="2" />
      </van-tab>
      <van-tab title="已完成">
        <order-list ref="list" :tab="3" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import orderList from "./list";
export default {
  name: "me_order",
  components: { orderList },
  data() {
    return {
      curTab: 0,

      namelist: [
        {
          name: "买入"
        },
        {
          name: "卖出"
        },
        {
          name: "交易中"
        },
        {
          name: "已完成"
        }
      ]
    };
  },
  computed: {},
  methods: {
    change(a, b) {
      console.log(a, b);

      // console.log(123321);
      // this.$refs.list.getTransctionList();
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang='scss'>
.me_order {
  padding-top: 4rem;
  .nav {
    width: 100%;
    height: 3.125rem;
    border: 1px solid red;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .navitem {
      width: 15%;
      height: 3.125rem;
      line-height: 3rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #666666;
      font-family: "Adobe Heiti Std R";
      text-align: center;

      border: 1px solid red;
    }
  }
}
</style>