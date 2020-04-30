<template>
  <div class="bbox">
    <van-nav-bar title="公告" left-arrow @click-left="onClickLeft" />
    <div v-for="(item,index) in list" :key="index" class="box">
      <div class="title">{{item.title}}</div>
      <div>{{item.content}}</div>
      <div class="time">{{item.add_time}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      list: ""
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getnotice() {
      this.$api
        .getNotice({
          page: this.page
        })
        .then(data => {
          console.log(data);
          this.list = data.data.info;
        });
    }
  },
  created() {
    this.getnotice();
  }
};
</script>
<style lang="scss" scoped>
.bbox {
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
  .box {
    width: 84%;
    background-color: #fff;
    padding: 10px;
    margin:0 auto;
    margin-top: 20px;
    .title{
        font-size: 1.2rem;
        text-align: center;
    }
    .time{
        text-align: right;
    }
    div{
        padding: 6px;
        // color: #7C7C7C;
    }
  }
}
</style>