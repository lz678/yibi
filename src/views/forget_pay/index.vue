<!-- forget_pay_pw -->
<template>
  <div class="forget_pay_pw">
    <van-nav-bar title="重置兑换密码" left-arrow @click-left="$router.go(-1)" />

    <div class="page_main">
      <!-- <van-cell-group> -->
      <!-- <van-field v-model="info.yx_password" type="password" label="旧密码:" placeholder="请输入旧密码" /> -->
      <van-field v-model="info.new_password" type="password" label="新设密码:" placeholder="请输入新设密码" />
      <van-field
        v-model="info.confirm_password"
        type="password"
        label="确认密码:"
        placeholder="请再次输入新密码"
      />
      <van-field v-model="info.idcard" label="身份证号码:" placeholder="请输入身份证号码" />
      <!-- <van-field v-model="info.code" label="验证码:">
          <div slot="button" class>
            <div class="code_btn" v-if="!showReminderTime" @click="getSmsCode">获取验证码</div>
            <div class="code_btn" v-else>重新发送({{reminderTime}}s)</div>
          </div>
      </van-field>-->
      <!-- </van-cell-group> -->
    </div>
    <div class="btn" :class="{'confirm':hasValue}" @click="handleConfirm">提 交</div>
  </div>
</template>

<script>
import { getStore, setStore } from "@/utils/utils";
export default {
  name: "forget_pay_pw",
  components: {},
  data() {
    return {
      isDisabled: true,
      timer: null,
      showReminderTime: false,
      reminderTime: 60,

      info: {
        // yx_password: "",
        new_password: "",
        confirm_password: "",
        idcard: ""
      }
    };
  },
  computed: {
    hasValue() {
      return (
        // this.info.yx_password &&
        this.info.confirm_password &&
        this.info.new_password &&
        this.info.idcard
      );
    }
  },
  methods: {
    // 获取定时器
    // getTimer () {
    //   var nowDate = new Date().getTime()
    //   var verifyTime = Number(getStore('verifyTime'))

    //   if (nowDate - verifyTime > 60000) {
    //     this.showReminderTime = false
    //   } else {
    //     var time = parseInt((60000 - (nowDate - verifyTime)) / 1000)
    //     this.reminderTime = time
    //     this.setTimer()
    //   }
    // },

    // 倒计时
    // setTimer () {
    //   this.showReminderTime = true
    //   var nowDate = new Date().getTime()
    //   setStore('verifyTime', nowDate)
    //   this.timer = setInterval(() => {
    //     if (this.reminderTime > 0) {
    //       this.reminderTime--
    //     } else {
    //       clearInterval(this.timer)
    //       this.showReminderTime = false
    //       this.reminderTime = 60
    //     }
    //   }, 1000)
    // },

    // 获取验证码
    // getSmsCode () {
    //   this.$api.getTransCode()
    //     .then(data => {
    //       if (data.code === 1) {
    //         this.$toast('验证码已发送')
    //         this.setTimer()
    //       } else {
    //         this.$toast(data.msg)
    //       }
    //     })
    // },
    validate() {
      let res = true;
      //   let codeReg = /^\d{4}$/
      let codeReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|x|X)$/;
      const { new_password, confirm_password, yx_password, idcard } = this.info;
      // if (yx_password === "") {
      //   this.$toast("旧密码不能为空");
      //   res = false;
      //   return false;
      // } else if (yx_password.length < 6 || yx_password.length > 30) {
      //   this.$toast("密码长度为6-30");
      //   res = false;
      //   return false;
      // }

      if (new_password === "") {
        this.$toast("新设密码不能为空");
        res = false;
        return false;
      } else if (new_password.length < 6 || new_password.length > 30) {
        this.$toast("密码长度为6-30");
        res = false;
        return false;
      }

      if (confirm_password === "") {
        this.$toast("确认密码不能为空");
        res = false;
        return false;
      } else if (confirm_password.length < 6 || confirm_password.length > 30) {
        this.$toast("确认密码为6-30");
        res = false;
        return false;
      } else if (confirm_password !== new_password) {
        this.$toast("两次密码输入不一致");
        res = false;
        return false;
      }

      if (idcard === "") {
        res = false;
        this.$toast("身份证不能为空");
        return false;
      } else if (!codeReg.test(idcard)) {
        res = false;
        this.$toast("请输入正确的身份证号");
        return false;
      }

      return res;
    },
    handleConfirm() {
      const res = this.validate();
      if (!res) return false;
      this.$api.changeTransPassword({ ...this.info }).then(data => {
        console.log(data);
        if (data.code === 1) {
          this.$toast("设置成功");
          this.$router.go(-1);
        } else {
          this.$toast(data.msg);
        }
      });
    }
  },
  created() {
    // this.getTimer();
  },
  mounted() {}
};
</script>

<style lang='scss'>
.forget_pay_pw {
  //   padding-top: 5.2rem;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  .van-field__control {
    // width: 100%;
    font-size: 1.2rem;
    // color: #fff;
  }
  .page_main {
    width: 100%;

    margin-top: 0.375rem;
    // height: 100%;
    // background: #fff;
  }

  //   .van-field__button {
  //     margin-left: 0.8rem;
  //     font-size: 1.04rem;
  //     line-height: 1.12rem;
  //     border-left: 1px solid #ccc;
  //     color: #3a3c43;
  //   }
  .btn {
    margin: 18rem auto 0;
    width: 60%;
    height: 3rem;
    text-align: center;
    line-height: 3rem;
    border-radius: 0;
    color: white;
    background-color: #4773ff;
    // border: 1px solid red;
    font-size: 1.12rem;
  }
}
</style>