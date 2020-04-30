<!-- open_my_mall -->
<template>
  <div class="open_my_mall">
    <div class="main" v-if="isValid">
      <div class="tip">请填写以下信息，并提交100域石保证金即可开店</div>

      <van-field v-model="info.name" placeholder="店铺名字" />
      <van-field v-model="area" readonly placeholder="选择地区" @click="isShowArea=true" />
      <van-field v-model="info.address" type="textarea" :rows="2" placeholder="请输入具体地址门牌号" />
      <van-field v-model="info.mobile" type="tel" placeholder="联系电话" />
      <van-field v-model="info.class_name" placeholder="行业类别" />
      <van-field v-model="info.desc" placeholder="店铺简介" />

      <div class="first_pic">
        <van-uploader
          v-model="first_pic"
          :max-count="1"
          :after-read="handleUploadFirst"
          @delete="handleDelFirst"
        />
        <div class="first_pic_tip">上传营业执照</div>
      </div>
      <div class="first_pic">
        <van-uploader
          v-model="shop_pic"
          :max-count="1"
          :after-read="handleUploadShop"
          @delete="handleDelShop"
        />
        <div class="first_pic_tip">门头照片或网店截图</div>
      </div>
      <div class="btn" :class="{'confirm':hasValue}" @click="handleConfirm">支付100域石保证金</div>
    </div>

    <van-popup class="area_wrap" v-model="isShowArea" position="bottom">
      <van-area :area-list="areaList" @confirm="handleSelArea" />
    </van-popup>
  </div>
</template>

<script>
import areaList from '@/assets/js/area'
export default {
  name: 'open_my_mall',
  components: {},
  data () {
    return {
      isShowArea: false,
      areaList,

      isValid: true,

      first_pic: [],
      shop_pic: [],

      info: {
        name: '',
        province: '',
        city: '',
        county: '',
        address: '',
        mobile: '',
        class_name: '',
        desc: '',
        certificate_image: '',
        shop_image: ''

      }
    }
  },
  computed: {
    hasValue () {
      return this.info.name && this.info.mobile && this.info.class_name && this.info.desc && this.info.province && this.info.city && this.info.county && this.info.address && this.info.certificate_image && this.info.shop_image
    },
    area () {
      if (this.info.province && this.info.city && this.info.county) {
        return this.info.province + '  ' + this.info.city + '  ' + this.info.county
      } else {
        return ''
      }

    }
  },
  methods: {
    async handleUploadFirst (file, index) {
      const res = await this.$store.dispatch('uploadFile', [file])
      this.info.certificate_image = res[0]
    },
    handleDelFirst (file) {
      this.info.certificate_image = ''
    },

    async handleUploadShop (file, index) {
      const res = await this.$store.dispatch('uploadFile', [file])
      this.info.shop_image = res[0]
    },
    handleDelShop (file) {
      this.info.shop_image = ''
    },

    handleSelArea (info) {
      console.log(info, 'infoinfos')
      this.info.province = info[0].name
      this.info.city = info[1].name
      this.info.county = info[2].name
      this.isShowArea = false
    },

    validate () {
      const telReg = /^1\d{10}$/

      const { name, mobile, class_name, desc, province, city, county, address, certificate_image, shop_image } = this.info

      let res = true

      if (name === '') {
        this.$toast('请输入店铺名字')
        res = false
        return false
      }

      if (mobile === '') {
        this.$toast('请输入联系电话')
        res = false
        return false
      } else if (!telReg.test(mobile)) {
        this.$toast('请输入正确的联系电话')
        res = false
        return false
      }

      if (class_name === '') {
        this.$toast('请输入行业类别')
        res = false
        return false
      }

      if (desc === '') {
        this.$toast('请输入店铺简介')
        res = false
        return false
      }
      if (certificate_image === '') {
        this.$toast('请上传营业执照')
        res = false
        return false
      }
      if (shop_image === '') {
        this.$toast('请上传门头照片或网店截图')
        res = false
        return false
      }

      return res
    },

    async handleConfirm () {
      const res = this.validate()
      if (!res) return false
      const __token__ = await this.$store.dispatch('getCommonToken')
      this.$api.openMyMall({ __token__, ...this.info })
        .then(data => {
          console.log('开通商城返回结果 ==>', data)
          this.$toast(data.msg)
          this.$emit('changeData', 'open')
        })

    }
  },
  created () { },
  mounted () { }
}
</script>

<style lang='scss'>
.open_my_mall {
  .first_pic {
    display: flex;
    align-items: center;
    padding: 1.2rem;
    font-size: 1.28rem;
  }
  .first_pic_tip {
    font-size: 1.12rem;
    margin-left: 1.4rem;
  }
  .van-uploader__upload {
    background: transparent;
  }

  .tip {
    margin-top: 1.6rem;
    margin-bottom: 0.8rem;
    text-align: center;
  }

  .van-field {
    margin-top: 0.8rem;
    padding-left: 2rem;
    padding-right: 3.2rem;
  }

  .van-field__control {
    padding: 0.24rem 0;
    font-size: 1.28rem;
    color: #fff;
    border-bottom: 0.08rem solid #afafaf;
  }

  .btn {
    margin: 1.92rem auto;
    width: 19.04rem;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.2rem;
    letter-spacing: 1px;
  }

  .area_wrap {
    padding: 0;
    width: 100%;
    background: #fff;
    border-radius: 0;
    z-index: 100000 !important;
  }
}
</style>