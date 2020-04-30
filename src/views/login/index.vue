<!-- login -->
<template>
  <div class="login" :style="{backgroundImage:'url('+require('../../assets/images/newbj.png')+')'}">
    <!-- <div class="logo">
      <img src="../../assets/images/logo.png" alt />
    </div>-->
    <div class="logo_title">登录</div>

    <div class="login_wrap">
      <van-field class="account" v-model="info.account" type="tel" placeholder="请输入手机号">
        <div slot="left-icon">
          <!-- <div class="login_icon"> -->
            <img src="../../assets/images/deng1.png" alt />
          <!-- </div> -->
        </div>
      </van-field>
  
      <van-field
        class="password"
        v-model="info.password"
        :type="isShowEye?'text':'password'"
        :right-icon="isShowEye?'eye-o':'closed-eye'"
        placeholder="请输入密码"
        @click-right-icon="isShowEye=!isShowEye"
      >
        <div slot="left-icon">
          <!-- <div class="login_icon"> -->
            <img src="../../assets/images/mi.png" alt />
          <!-- </div> -->
        </div>
      </van-field>
    </div>

    <div class="btn" :class="{'confirm':hasValue}" @click="login">登 录</div>

    <div class="forget_pw">忘记密码？</div>
  </div>
</template>

<script>
import { setStore } from "@/utils/utils";
export default {
  name: "login",
  components: {},
  data() {
    return {
      isShowEye: false,

      info: {
        areaCode: "86",
        account: "",
        password: ""
      },
      phoneList: [
        { text: "+86", value: "86" },
        { text: "+87", value: "87" },
        { text: "+88", value: "88" }
      ]
    };
  },
  computed: {
    hasValue() {
      return this.info.account && this.info.password;
    }
  },
  methods: {
    validate() {
      const telReg = /^1\d{10}$/;

      const { account, password } = this.info;

      let res = true;

      if (account === "") {
        this.$toast("请输入手机号");
        res = false;
        return false;
      } else if (!telReg.test(account)) {
        this.$toast("请输入正确的手机号");
        res = false;
        return false;
      }

      if (password === "") {
        this.$toast("请输入密码");
        res = false;
        return false;
      }

      return res;
    },

    login() {
      const res = this.validate();
      if (!res) return false;
      this.$api.login({account:this.info.account,password:this.info.password}).then(data => {
        console.log("登录返回结果 ==>", data);
        this.$toast(data.msg);
        if (data.code === 1) {
          this.$store.commit("changeValue", {
            type: "token",
            value: data.data.userinfo.token
          });
          setStore("userInfo", data.data.userinfo);
          setStore('userid',data.data.userinfo.id)
          setStore("token", { token: data.data.userinfo.token });
          this.$router.push("/layout/me");
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang='scss'>
.btn {
  width: 80%;
  height: 3.6rem;
  border-radius: 1.8rem;
  margin: 3.125rem auto;
  text-align: center;
  line-height: 3.6rem;
  color: #4672ff;
  background-color: #a4baff;
}
.login {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding: 0 1.6rem;
  background-repeat: no-repeat;
  background-size: cover;

  overflow: hidden;
  .logo {
    margin: 0 auto;
    margin-top: 5rem;
    margin-bottom: 2rem;
    width: 8rem;
    height: 8rem;
  }
  .logo_title {
    margin: 6.25rem auto;
    width: 14.88rem;
    height: 2.56rem;
    line-height: 2.56rem;
    text-align: center;
    // color: #fff;
    font-size: 3rem;
    font-weight: 500;
    // background: #da2e63;
    border-radius: 2.56rem;
  }

  .login_wrap {
    width: 100%;
    margin: 0 auto;
    margin-top: 3.2rem;
    // color: #fff;
  }

  .van-cell {
    padding: 1.2rem 0;
    // background: transparent;
    // border-bottom: 1px solid #fff;
    // border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1);
  }

  .van-cell__value {
    color: #fff;
  }

  .phone_fix {
    display: flex;
    align-items: center;
  }

  .van-dropdown-menu {
    height: 20px;
    background: transparent;
  }
  .van-dropdown-menu__title {
    color: #fff;
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border: none;
  }
  .van-dropdown-menu__item {
    padding-left: 0;
  }
  .van-popup {
    padding: 0 20px;
    background: #1d131a;
  }
  .van-dropdown-item__option {
    background: #1d131a;
  }
  .van-dropdown-item__icon {
    color: #fff;
  }

  .account .van-field__left-icon {
    // width: 2rem;
     margin-right: 0.8rem;
  }
  .password .van-field__left-icon {
    margin-right: 0.8rem;
  }

  .van-field__control {
    // width: 100%;
    font-size: 1.2rem;
    // color: #fff;
  }
  .login_icon {
    // width: 1.76rem;
    // height: 1.76rem;
  }

  .van-icon-eye-o,
  .van-icon-closed-eye {
    font-size: 1.76rem;
  }

  .forget_pw {
    margin-top: 2.4rem;
    text-align: right;
    font-size: 0.96rem;
    color: rgba($color: #fff, $alpha: 0.2);
  }
}
</style>