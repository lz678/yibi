<!-- auth -->
<template>
  <div class="auth_wrap">
    <div class="auth">
      <van-nav-bar fixed title="实名认证" left-arrow @click-left="$router.go(-1)">
        <div slot="right">({{info.status|istrue}})</div>
      </van-nav-bar>
      <!-- <div>实名认证{{info.status}}</div> -->
      <div class="main">
        <van-field
          v-model="info.realname"
          maxlength="18"
          label="姓名"
          :readonly="info.status==1"
          placeholder="请输入姓名（必须与支付宝实名一致）"
        ></van-field>
        <van-field v-model="info.idcard" :readonly="info.status==1" maxlength="18" label="身份证号" placeholder="请输入身份证号"></van-field>

        <van-field v-model="info.zfb_number" :readonly="info.status==1" maxlength="25" label="支付宝号" placeholder="请输入支付宝账号"></van-field>

        <!-- <div class="btn" :class="{'confirm':hasValue}" @click="handleAuth">下一步</div> -->
        <div class="btn" :class="{'confirm':hasValue&&info.status!=1}" @click="handleAuth">确定</div>
        <div class="tip">
          <div>注意：</div>实名信息一旦提交无法修改，请慎重填写！认证必须使用填写的身份证本人的支付宝进行人脸认证，一个用户只有两次认证机会！
        </div>
      </div>
    </div>

    <div class="load" v-if="isLoad">
      <van-overlay :show="true"></van-overlay>
      <van-loading color="#DA2E63" size="45px"></van-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: "auth",
  data() {
    return {
      // host: 'http://www.faagy.cn',
      token: "",

      info: {
        realname: "",
        idcard: "",
        zfb_number: "",
        status:''
      },

      isLoad: false
    };
  },
  computed: {
    hasValue() {
      return this.info.realname && this.info.idcard && this.info.zfb_number;
    },
    
  },
   filters:{
      istrue(item){
        if(item==0){
          return "待审核"
        }else if(item==1){
          return "审核通过"
        }else if(item==2){
          return "未通过"
        }
      }
    },
  
  methods: {
      getauth(){
      this.$api.getauth().then((data)=>{
        console.log(data);
        if(data.code==1){
          this.info=data.data.info
        }
      })
    },
    // 获取查询参数
    getQueryParams(name) {
      var ca = location.href.split("?")[1];
      if (!ca) return false;
      var list = ca.split("&");

      var arr = [];
      list.map(function(it) {
        arr.push(it.split("="));
      });

      console.log(arr, "arr");
      var map = new Map(arr);
      return map.get(name);
    },

    // 验证认证信息
    validate() {
      var res = true;
      var name = /^1\d{10}$/;
      var id = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|x|X)$/;
      var zfb = /^.{6,20}$/;

      if (this.info.realname === "") {
        res = false;
        this.$toast("请输入姓名");
        return false;
      }

      var year = this.info.idcard.slice(6, 10);
      var nowYear = new Date().getFullYear() + 2;
      var age = nowYear - Number(year);
      if (this.info.idcard === "") {
        res = false;
        this.$toast("请输入身份证号");
        return false;
      } else if (!id.test(this.info.idcard)) {
        res = false;
        this.$toast("请输入真确的身份证号");
        return false;
      } else if (age < 16) {
        res = false;
        this.$toast("年龄必须大于18岁");
        return false;
      }

      if (this.info.zfb_number === "") {
        res = false;
        this.$toast("请输入支付宝号");
        return false;
      }

      return res;
    },

    // 认证
    handleAuth() {
      const res = this.validate();
      if (!res) return false;
      this.isLoad = true;
      this.$api
        .postAuth({
          // token: this.token,
          ...this.info
        })
        .then(data => {
          console.log(data);
          this.isLoad = false;
          if (data.code === 1) {
            this.$toast(data.msg);
            this.$router.go(-1)
            // window.location.href = data.data.url;
          } else {
            this.$toast(data.msg);
          }
        });
    }
  },
  created() {
    this.getauth()
    this.token = this.getQueryParams("token") || "";
  }
};
</script>

<style lang='scss'>
.auth_wrap {
  .auth {
    box-sizing: border-box;
    padding-top: 50px;
    height: 100%;
    // background: #1d131a;
  }

  .auth .van-cell {
    padding: 13px 20px;
    // background: #34222f;
  }

  .auth .van-field {
    margin: 15px 0;
  }

  .auth .van-cell__title {
    margin-left: 0;
    width: 75px;
    // color: #fff;
  }

  .auth .van-field__control {
    // color: #fff;
  }
  .van-cell:not(:last-child)::after {
    border: none;
  }

  .auth .dot_wrap {
    display: flex;
    align-items: center;
  }

  .auth .dot {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: #da2e63;
  }

  .tip {
    margin: 0 auto;
    margin-top: 30px;
    width: 92%;
    color: #da2e63;
    font-size: 12px;
  }
  .tip div {
    margin-bottom: 6px;
    font-size: 14px;
  }
  .btn {
    display: none;
    text-align: center;
    line-height: 1.875rem;
    color: #fff;
    width: 30%;
    height: 2rem;
    border-radius: .9375rem;
    margin: 0 auto;
    margin-top: 50px;
    background-color: #4470FF;
    // border: 1px solid red;
  }
  .confirm{
    display: block;
  }

  .load {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  .van-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
}
</style>