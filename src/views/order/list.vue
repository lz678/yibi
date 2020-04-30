<!-- order_list -->
<template>
  <div class="order_list">
    <van-pull-refresh class="list" v-model="isLoadRefresh" @refresh="refreshList">
      <van-list
        v-model="isLoading"
        :finished="isFinished"
        @load="pullList"
        :offset="100"
        finished-text="人家也是有底线的"
      >
        <div class="item" v-for="(item,index) in list" :key="index">
          <!-- 买入 -->
          <div v-if="tab===0" class="tabzero">
            <div class="ordername">币种：{{item.coin_name}}</div>
            <div class="orderone">
              <!-- <div>类型：{{item.side|role}}</div> -->
              <div>数量：{{item.amount}}</div>
              <div>单价：{{item.price}}</div>
            </div>
            <div class="ordertime">
              <!-- <div>总共：{{item.total_price}}元</div> -->
              <!-- <div  class="orderquite" @click="quiteorder(item.id)">取消</div> -->
            </div>
            <div class="timebox">
              <div>订单时间：{{item.order_time}}</div>
              <!-- <div class="orderquite" @click="quiteorder(item.id)">取消</div> -->
              <div v-if="item.status==1" class="orderquite" @click="quiteorder(item.id)">取消</div>
            </div>
          </div>

          <!-- 卖出页面 -->
          <div v-if="tab===1" class="tabone">
            <div class="ordername">币种：{{item.coin_name}}</div>
            <div class="orderone">
              <!-- <div>币种：{{item.coin_name}}</div> -->
              <!-- <div>类型：{{item.side|role}}</div> -->
              <div>数量：{{item.amount}}</div>
              <div>单价：{{item.price}}</div>
            </div>
            <div class="ordertime">
              <!-- <div>总共：{{item.total_price}}元</div> -->
              <!-- <div  class="orderquite" @click="quiteorder(item.id)">取消</div> -->
            </div>
            <div class="timebox">
              <div>订单时间：{{item.order_time}}</div>
              <div v-if="item.status==1" class="orderquite" @click="quiteorder(item.id)">取消</div>
              <!-- <div class="orderquite" @click="quiteorder(item.id)">取消</div> -->
            </div>
          </div>

          <!-- 交易中 -->
          <div v-if="tab===2" class="tabtwo" @click="orderlist(item.id,item.status)">
            <div class="ordername">
              <!-- <div>订单号：{{item.id}}</div> -->
              <div class="orderlist">点击详情</div>
            </div>
            <div class="orderone">
              <div>类型：{{item.side_name}}</div>
              <div>数量：{{item.amount}}</div>
              <div>单价：{{item.price}}</div>
            </div>
            <div class="ordertime">订单时间：{{item.order_time}}</div>
            <div class="total">
              <div class="totalprice">总共：{{item.total_price}}元</div>
              <!-- <div
                v-if="userId==item.buyer_uid"
                class="quite"
                @click.stop="handleCancelOrd(item.id)"
              >取消</div> -->
              <!-- <div class="hold">上传打款凭证</div> -->

              <!-- <div class="upbox" @click.stop="whichorder(item)">
                <van-uploader :after-read="handleUpload">
                  <div>上传打款凭证</div>
                </van-uploader>
              </div> -->
              <!-- <div class="listbox" v-if="item.side==1">
                {{item.status|tradetype}}
              </div>-->

              <!-- <div
                v-if="userId==item.seller_uid"
                class="appeal"
                @click.stop="handleappeal(item.id)"
              >申诉</div> -->
              <!-- <div class="listbox" v-if="userId==item.seller_uid">{{item.status|tradetype}}</div> -->
              <div class="listbox">{{item.status|tradetype}}</div>
              <!-- <div v-if="item.side==1" class="iscome" @click="givemoney(item.id)">
                  确认收款
              </div>-->
              <!-- <div v-if="item.status==3" @click="givecoin(item.id)">放币</div> -->
            </div>
          </div>

          <!-- 已完成 -->
          <div v-if="tab===3" class="tabthree">
            <!-- <div class="ordername">订单号：{{item.id}}</div> -->
            <div class="orderone">
              <div>类型：{{item.side_name}}</div>
              <div>数量：{{item.amount}}</div>
              <div>单价：{{item.price}}</div>
            </div>
            <div class="ordertime">订单时间：{{item.order_time}}</div>
            <div class="total">
              <div>总共：{{item.total_price}}元</div>
              <div>完成</div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- <van-popup class="view_img" v-model="isViewImg">
      <img :src="viewImgUrl" alt />
    </van-popup>-->
    <!-- <my-appeal :orShow.sync="myShow" :orderid.sync="appealid"></my-appeal> -->
    <user-info :isShow.sync="isUserInfo" :info="curUserInfo"></user-info>
    <van-dialog v-model="show" :overlay=false title="确认取消吗？" show-cancel-button :before-close="beforeClose">
       <!-- <van-dialog v-model="show" :get-container="getContainer" title="确认取消吗？" show-cancel-button :before-close="beforeClose"> -->

</van-dialog>
  </div>
</template>

<script>
import { getStore } from "@/utils/utils";
import userInfo from "./modules/user_info";
import myAppeal from "./modules/appeal";
export default {
  name: "order_list",
  components: { userInfo, myAppeal },
  props: {
    tab: Number
  },
  data() {
    return {
      apiList: [
        "tranMatchList",
        "tranTradeingList",
        "tranFinishList",
        "tranCancelList"
      ],
      // userid:"",
      iid:'',
      show:false,
      appealid: "",
      myShow: false,
      order_id: null,
      fileurl: "",
      photo: [],
      flag: "",
      side: "",
      type: "",
      page: 0,
      isLoadRefresh: false,
      isLoading: false,
      isFinished: false,
      list: [],
      userId: getStore("userInfo").id,
      curId: "",
      isUserInfo: false,
      curUserInfo: {},
      nothing: false,
      fileList: [],
      isViewImg: false,
      viewImgUrl: ""
    };
  },
  filters: {
    tradetype(a) {
      if (a == 0) {
        return "已经取消";
      } else if (a == 2) {
        return "交易中";
      } else if (a == 3) {
        return "已支付待确认";
      }
    },
    role(side,sellid,buyid,otherid,userid) {
      if (side == 1) {
        if ((buyid == otherid) == userid) {
          return "卖出";
        } else {
          return '买入';
        }
      }
      if (side== 2) {
        if ((sellid == otherid) == userid) {
          return '买入';
        } else {
          return "卖出";
        }
      }
    },
    filterCountDown(info) {
      let time = info.tradetime;
      if (info.uploadimg > 0) {
        time = info.uploadimg;
      }
      const overTime = new Date((time + 5400) * 1000).getTime();
      const nowTime = new Date().getTime();
      return overTime - nowTime;
    }
  },

  computed: {},

  methods: {
    getContainer() {
      return document.querySelector('.tabone');
    },
    beforeClose(action, done){
      if(action==='confirm'){
         this.$api
        .cancelorder({
          market_id: this.iid
        })
        .then(data => {
          this.$toast(data.msg);
          console.log(data);
          if (data.code == 1) {
            this.$toast(data.msg);
            done()
          }
        });
      }else if(action==='cancel'){
        done()
      }
    },
    //买入卖出取消
    quiteorder(e) {
      this.show=true;
      this.iid=e
       
    },
    //orderlist订单详情
    orderlist(a, b) {
      console.log(getStore("userInfo").id);

      this.$router.push({
        path: "/orderlist",
        query: {
          id: a,
          status: b
        }
      });
      // console.log(a);
    },
    // 排断用户角色  卖家  买家
    // isBuy(id) {

    //   const userId =getStore('userInfo').id

    // },
    handleappeal(e) {
      console.log(1);
      this.appealid = e;
      this.myShow = true;
      //  console.log(this.myshow);
    },
    //确认收款
    givemoney(e) {
      this.$api
        .confirmYesOrder({
          order_id: e
        })
        .then(data => {
          console.log(data);
          if (data.code == 1) {
            console.log(data);
          }
        });
    },
    //放币
    givecoin(e) {
      this.$api
        .givecoin({
          order_id: e
        })
        .then(data => {
          console.log(data);

          if (data.code == 1) {
            console.log(data);
          }
        });
    },

    refreshList() {
      this.page = 1;
      console.log("下拉刷新");
      // this.isLoadRefresh = false;
      this.getTransctionList();
    },
    pullList() {
      console.log("上拉加载");
      this.page++;
      this.getTransctionList();
    },

    // 获取列表数据
    getTransctionList() {
      if (this.tab == 0) {
        this.flag = 1;
        this.side = 2;
        this.type = 0;
      } else if (this.tab == 1) {
        this.flag = 1;
        this.side = 1;
        this.type = 0;
      } else if (this.tab == 2) {
        this.flag = 2;
        this.side = 0;
        this.type = 2;
      } else if (this.tab == 3) {
        this.flag = 2;
        this.side = 0;
        this.type = 1;
      }
      const page = this.page;
      console.log(page, "pagepage");
      // const api = this.apiList[this.tab]
      if (page === 0) return false;
      this.$api
        .tranMatchList({
          flag: this.flag,
          side: this.side,
          type: this.type,
          page: this.page
        })
        .then(data => {
          console.log(data, this.tab);
          this.isLoadRefresh = false;
          this.isLoading = false;
          if (data.code === 1) {
            if (page === 1) {
              this.list = data.data.info;
            } else {
              this.list.push(...data.data.info);
            }

            if (data.data.total / 10 <= page) {
              this.isFinished = true;
            } else {
              this.isFinished = false;
            }
          } else {
            this.isLoadRefresh = false;
            this.isLoading = false;
            this.isFinished = true;
          }
        })
        .catch(err => {
          this.isLoadRefresh = false;
          this.isLoading = false;
          this.isFinished = true;
        });
    },
    // getTransctionList () {
    //   const page = this.page
    //   console.log(page, 'pagepage')
    //   const api = this.apiList[this.tab]
    //   if (page === 0) return false
    //   this.$api[api]({ p: this.page })
    //     .then(data => {
    //       console.log(data)
    //       this.isLoadRefresh = false
    //       this.isLoading = false
    //       if (data.code === 1) {
    //         if (page === 1) {
    //           this.list = data.data.list
    //         } else {
    //           this.list.push(...data.data.list)
    //         }

    //         if (data.data.total / 10 <= page) {
    //           this.isFinished = true
    //         } else {
    //           this.isFinished = false
    //         }
    //       } else {
    //         this.isLoadRefresh = false
    //         this.isLoading = false
    //         this.isFinished = true
    //       }
    //     })
    //     .catch(err => {
    //       this.isLoadRefresh = false
    //       this.isLoading = false
    //       this.isFinished = true
    //     })
    // },

    // 定时器完成
    handleCountFinish(item) {
      // this.list.splice(i, 1)
      const { id } = item;
      this.$api.checkTime({ id }).then(data => {
        console.log("定时器完成", data);
      });
    },

    // 取消订单
    handleCancelOrd(id) {
      // const apis = ['cancelBuy', 'cancelSale', 'cancelBuy']
      // const api = apis[this.tab]
      this.$dialog
        .confirm({
          message: "确认取消订单吗？",
         overlay:false
        })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: "提交中..."
          });
          // const __token__ = await this.$store.dispatch("getCommonToken");
          // console.log(__token__);
          this.$api.cancelBuy({ order_id: id }).then(data => {
            this.$toast(data.msg);
            if (data.code === 1) {
              this.$toast(data.msg);
              this.getTransctionList();
            }
          });
        })
        .catch(err => {});
    },

    // 查看用户信息
    // viewUserInfo(info) {
    //   const { id } = info;
    //   this.$api.getTransactUserInfo({ id }).then(data => {
    //     console.log(data);
    //     if (data.code === 1) {
    //       const isSall = this.isBuy(info.in_user_id);
    //       const params = data.data;
    //       params.total_money = info.total_money;
    //       params.isSall = isSall;
    //       this.curUserInfo = params;
    //       this.isUserInfo = true;
    //     } else {
    //       this.$toast(data.msg);
    //     }
    //   });
    // },

    whichorder(item) {
      console.log(123);

      console.log(item.id);

      this.order_id = item.id;
    },

    handleUpload(file, index) {
      console.log(file, index);
      this.$store.dispatch("uploadFile", [file]).then(data => {
        console.log(data);
        this.fileurl = data[0];
        console.log(this.fileurl);
        this.$api
          .uploadFiles({
            order_id: this.order_id,
            pay_img: this.fileurl
          })
          .then(data => {
            console.log(data);
          });
      });
    
    },

    // 查看图片
    viewImg(id) {
      this.$api.getShowImg({ id }).then(data => {
        console.log(data);
        if (data.code === 1) {
          this.viewImgUrl = data.data.img;
          this.isViewImg = true;
        } else {
          this.$toast(data.msg);
        }
      });
    },

    // 确认完成订单
    comfirmOrder(id) {
      this.$dialog
        .confirm({
          message: "确认完成订单吗？",
          overlay:false
        })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: "提交中..."
          });
          const __token__ = await this.$store.dispatch("getCommonToken");
          this.$api.confirmYesOrder({ id, __token__ }).then(data => {
            this.$toast(data.msg);
            if (data.code === 1) {
              this.getTransctionList();
            }
          });
        })
        .catch(err => {});
    },

    // 投诉
    complaintOrder(id, i) {
      this.$dialog
        .confirm({
          message: "确认投诉对方吗？"
        })
        .then(() => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: "提交中..."
          });
          this.$api.complaintOrder({ id }).then(data => {
            this.$toast(data.msg);
            if (data.code === 1) {
              this.getTransctionList();
            }
          });
        })
        .catch(err => {});
    }
  },

  created() {
    this.userId = getStore("userInfo").id;
    // console.log(this.userId,123);
    
  },
  mounted() {}
  //  watch: {
  //    "this.tab":{
  //      return (getTransctionList()())
  //    }
  //  },
};
</script>

<style lang='scss'>
.dialogstyle{
  z-index: 9999;
}

.order_list {
  // color: red;
  background-color: #f4f4f4;
  // .list {
  //   padding: 1.6rem;
  // }
  .item {
    padding: 1.2rem;
    width: 88%;
    // height: 100px;
    margin: 14px auto;
    // margin-bottom: 0.6rem;
    border-radius: 0.4rem;
    background: #fff;
    font-size: 0.96rem;
    overflow: hidden;
    .tabzero {
      .ordername {
        font-size: 1.2rem;
        font-weight: 600;
        color: #666666;
        font-family: "Adobe Heiti Std R";
        //  color: #333333;
      }
      .orderone {
        margin: 12px;
        font-weight: 600;
        display: flex;
        color: #666666;
        justify-content: space-around;
        font-size: 1.2rem;
        div:nth-child(2) {
          width: 34%;
        }
      }
      .ordertime {
        color: #666666;
        font-family: "Adobe Heiti Std R";
        font-weight: 600;
        // display: flex;
        // justify-content: space-between;
        font-size: 1rem;
        color: #666666;

        div {
          padding: 6px;
        }
      }
      .timebox {
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
        color: #666666;
        .orderquite {
          text-align: center;
          font-size: 1.2rem;
          width: 5rem;
          // margin-right: 20px;
          color: #333333;
          border-radius: 16px;
          border: 1px solid #4773ff;
        }
      }
    }
    .tabone {
      .ordername {
        font-size: 1.2rem;
        font-weight: 600;
        color: #666666;
        font-family: "Adobe Heiti Std R";
        //  color: #333333;
      }
      .orderone {
        margin: 12px;
        font-weight: 600;
        display: flex;
        color: #666666;
        justify-content: space-around;
        font-size: 1.2rem;
        div:nth-child(2) {
          width: 34%;
        }
      }
      .ordertime {
        color: #666666;
        display: flex;
        justify-content: space-between;
        font-size: 1.2rem;
        color: #666666;

        div {
          padding: 6px;
        }
      }
      .timebox {
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
        color: #666666;
        .orderquite {
          font-family: "Adobe Heiti Std R";
          font-size: 1.2rem;
          text-align: center;
          padding: 4px;
          margin-left: 10px;
          width: 5rem;
          // margin-right: 20px;
          color: #333333;
          border-radius: 16px;
          border: 1px solid #4773ff;
        }
      }
    }
    .tabtwo {
      .ordername {
        // display: flex;
        // justify-content: space-between;
      
        font-size: 1.4rem;
        font-weight: 600;
        color: #666666;
        font-family: "Adobe Heiti Std R";
        .orderlist {
          text-align: right;
          font-size: 1rem;
          font-weight: 600;
          color: #ec3d3d;
        }
        //  color: #333333;
      }
      .orderone {
        margin: 12px;
        font-weight: 600;
        display: flex;
        color: #666666;
        justify-content: space-around;
        font-size: 1.2rem;
        div:nth-child(2) {
          width: 34%;
        }
      }
      .ordertime {
        padding-left: 2rem;
        font-size: 1.2rem;
        color: #666666;
      }
      .total {
        display: flex;
        justify-content: space-around;
        font-size: 1.2rem;
        line-height: 20px;
        // text-align: right;
        margin-top: 10px;
        color: #ec3d3d;
        .totalprice {
          width: 32%;
        }
        .quite {
          width: 20%;
          height: 20px;
          font-size: 1rem;
          text-align: center;
          line-height: 20px;
          color: #333333;
          border: 1px solid #d6d6d6;
          border-radius: 10px;
        }
        .listbox {
          width: 30%;
          text-align: center;
          font-size: 1rem;
          color: #4773ff;
          border: 1px solid #4773ff;
          border-radius: 10px;
        }
        .upbox {
          width: 30%;
          font-size: 1rem;
          text-align: center;
          // padding: 2px;
          color: #4773ff;
          border: 1px solid #4773ff;
          border-radius: 10px;
        }
        .appeal {
          width: 20%;
          height: 20px;
          font-size: 1rem;
          text-align: center;
          line-height: 20px;
          color: #333333;
          border: 1px solid #d6d6d6;
          border-radius: 10px;
        }
        .iscome {
          width: 28%;
          text-align: center;
          color: #4773ff;
          border: 1px solid #4773ff;
          border-radius: 10px;
        }
        // .hold {
        //   width: 30%;
        //   height: 20px;
        //   font-size: 1rem;
        //   text-align: center;
        //   line-height: 20px;
        //   color: #4773ff;
        //   border: 1px solid #4773ff;
        //   border-radius: 10px;
        // }
      }
    }
    .tabthree {
      .ordername {
        font-size: 1.4rem;
        font-weight: 600;
        color: #666666;
        font-family: "Adobe Heiti Std R";
        //  color: #333333;
      }
      .orderone {
        margin: 12px;
        font-weight: 600;
        display: flex;
        color: #666666;
        justify-content: space-around;
        font-size: 1.2rem;
        div:nth-child(2) {
          width: 34%;
        }
      }
      .ordertime {
        padding-left: 2rem;
        font-size: 1.2rem;
        color: #666666;
      }
      .total {
        display: flex;
        justify-content: space-around;
        font-size: 1.2rem;
        font-weight: 600;
        // text-align: right;
        margin-top: 10px;
        color: #ec3d3d;
      }
    }
  }
   
}
</style>