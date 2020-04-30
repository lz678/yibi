<template>
  <div>
    <van-popup v-model="show" round class="mypopup">
      <!-- <div style="width:100px;height:100px">
             
      </div>-->

      <van-radio-group v-model="result">
        <van-radio name="打款金额有误">打款金额有误</van-radio>
        <van-radio name="没有打款">没有打款</van-radio>
      </van-radio-group>
      <div class="btn" @click="send">确定</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    orShow: Boolean,
    orderid:null
  },
  

  data() {
    return {
      result: ""
    };
  },

  computed: {
    show: {
      get() {
        return this.orShow;
      },
      set(val) {
        this.$emit("update:orShow", val);
      }
    }
  },
  methods: {
    send() {
      console.log(this.result);
      this.$api
        .complaintOrder({
          order_id: this.orderid,
          describe: this.result
        })
        .then(data => {
           
        if(data.code==1){
          this.$toast(data.msg)
          console.log(data);
          this.$toast(data.msg)
          this.show=false
        }else{
          this.$toast(data.msg)
          this.show=false
        }
          // console.log(data);
        });
    }
  }
};
</script>


<style lang="scss" >
.mypopup {
  width: 80%;
  height: 50vh;
  // .mypopupbox {
  //   width: 80%;
  //   margin: 0 auto;
  // }
  div {
    padding: 12px;
    font-size: 1.2rem;

    // margin-top: 20px;
  }
  .btn {
    width: 70%;
    height: 1.875rem;
    //  padding: 10px;
    border-radius: 0.8rem;
    margin: 0 auto;
    margin-top: 1.875rem;
    text-align: center;
    color: white;
    font-size: 1.5rem;
    line-height: 1.875rem;
    font-weight: 600;
    background-color: #4773ff;
  }
}
</style>