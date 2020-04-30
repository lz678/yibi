<!-- my_mall_pub -->
<template>
  <div class="my_mall_pub">
    <van-nav-bar
      fixed
      title="我的商城"
      left-arrow
      @click-left="$router.go(-1)"
      right-text="提交"
      @click-right="handleConfirm"
    />

    <div class="main">
      <div class="first_pic">
        <van-uploader
          v-model="first_pic"
          :max-count="1"
          :after-read="handleUploadFirst"
          @delete="handleDelFirst"
        />
        <div class="first_pic_tip">上传首图（建议正方形）</div>
      </div>

      <div>
        <van-field v-model="info.goods_name" placeholder="请输入标题" />
        <van-field v-model="info.qty" type="number" placeholder="请输入库存数量" />
        <van-field v-model="info.sale_price" placeholder="请输入售价（域石价格）" />
        <div class="sale_tip">用户确定后收货或者发货7天后自动结算</div>
        <van-field v-model="info.market_price" placeholder="请输入价值（RMB价值仅作展示）" />
        <van-field v-model="info.shopping_price" placeholder="请输入运费" />
        <van-field
          v-model="info.contens"
          type="textarea"
          :rows="4"
          placeholder="请输入具体规格，如具体几斤，具体型号，可以填写电话号码，方便用户了解详情"
        />
      </div>

      <div class="desc_pic">
        <van-uploader
          class="desc_pic_upload"
          v-model="desc_pic"
          :max-count="6"
          :after-read="handleUpload"
          @delete="handleDelUpload"
        >添加图片介绍</van-uploader>
      </div>
    </div>
  </div>
</template>

<script>
import { getStore } from '@/utils/utils'
import { resolve, reject } from 'q'
export default {
  name: 'my_mall_pub',
  components: {},
  data () {
    return {
      info: {},
      fileList: [],
      isAdd: false,


      first_pic: [],
      desc_pic: [],


      info: {
        image: '',
        goods_name: '',
        qty: '',
        sale_price: '',
        market_price: '',
        shopping_price: '',
        contens: '',
        images: []
      }
    }
  },
  computed: {},
  methods: {
    async handleUploadFirst (file, index) {
      console.log(file, index, 'ccccdsf')
      const res = await this.$store.dispatch('uploadFile', [file])
      console.log(res, 'sdsds')
      console.log(this.first_pic)
      this.info.image = res[0]
    },
    handleDelFirst (file) {
      this.info.image = ''
    },

    async handleUpload (file, index) {
      const res = await this.$store.dispatch('uploadFile', [file])
      this.info.images.push(res[0])
    },
    handleDelUpload (file, index) {
      const i = index.index
      this.info.images.splice(i, 1)
    },


    validate () {
      const telReg = /^1\d{10}$/
      const priceReg = /^\d*(\.\d{1,2})?$/

      const { image, images, goods_name, qty, sale_price, market_price, shopping_price, contens } = this.info

      const first_pic = this.first_pic
      const desc_pic = this.desc_pic

      let res = true

      if (images === '') {
        this.$toast('请上传首图')
        res = false
        return false
      }

      if (goods_name === '') {
        this.$toast('请输入标题')
        res = false
        return false
      }

      if (qty === '') {
        this.$toast('请输入库存数量')
        res = false
        return false
      } else if (!/^\d+$/.test(qty)) {
        this.$toast('请输入正确的库存数量')
        res = false
        return false
      }

      if (sale_price === '') {
        this.$toast('请输入售价')
        res = false
        return false
      } else if (!priceReg.test(sale_price)) {
        this.$toast('请输入正确的售价')
        res = false
        return false
      }

      if (market_price === '') {
        this.$toast('请输入价值')
        res = false
        return false
      } else if (!priceReg.test(market_price)) {
        this.$toast('请输入正确的价值')
        res = false
        return false
      }

      if (shopping_price === '') {
        this.$toast('请输入运费')
        res = false
        return false
      } else if (!priceReg.test(shopping_price)) {
        this.$toast('请输入正确的运费')
        res = false
        return false
      }

      if (contens === '') {
        this.$toast('请输入文字介绍及购买须知')
        res = false
        return false
      }

      if (!images.length) {
        this.$toast('请上传图片介绍')
        res = false
        return false
      }

      return res
    },

    // 提交
    handleConfirm () {
      const res = this.validate()
      if (!res) return false

      this.$dialog.confirm({
        message: '确认提交吗？'
      })
        .then(async () => {
          this.$toast.loading({
            mask: true,
            duration: 0,
            message: '提交中...'
          })
          console.log(this.first_pic, this.desc_pic, 'hjhjhjgfjgjgjgj')
          const __token__ = await this.$store.dispatch('getCommonToken')
          let { id = '', goods_name, image, qty, sale_price, market_price, shopping_price, contens, images } = this.info
          images = images.join(',')
          const params = { __token__, id, goods_name, image, qty, sale_price, market_price, shopping_price, contens, images }
          console.log(params, 'paramsparams')
          this.$api.postPubPro(params)
            .then(data => {
              this.$toast(data.data)
              if (data.code === 1) {

              }
            })
        })
        .catch(err => { })
    },


    getBase64Image (img, width, height) {
      //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
      var canvas = document.createElement("canvas");
      canvas.width = width ? width : img.width;
      canvas.height = height ? height : img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var dataURL = canvas.toDataURL();
      return dataURL;
    },

    getBase64 (img) {
      new Promise((resolve, reject) => {
        var image = new Image();
        image.crossOrigin = "";
        image.src = img;
        // var deferred = $.Deferred();
        if (img) {
          image.onload = () => {
            const img = this.getBase64Image(image)
            resolve(img)
          };
        }
      })

    },



  },
  created () {
    const info = getStore('myMallPro')
    console.log(info, 'ddd')
    if (info) {
      // 编辑
      this.info = info
      const image = this.getBase64(info.image)
      console.log(image, 'image')
      this.first_pic.push({
        content: info.image,
        file: null
      })

      console.log(this.first_pic, ' this.first_pic')
      let images = info.images.split(',')
      let desc_pic = []
      images.map(it => {
        desc_pic.push({
          content: this.getBase64(it),
          file: null
        })
      })
      this.info.images = images
      this.desc_pic = desc_pic
      this.isAdd = false
    } else {
      // 新增
      this.isAdd = true
    }
  },
  mounted () { }
}
</script>

<style lang='scss'>
.my_mall_pub {
  padding-top: 4rem;

  .first_pic {
    display: flex;
    align-items: center;
    padding: 1.2rem;
    font-size: 1.28rem;
  }
  .first_pic_tip {
    margin-left: 1.6rem;
  }
  .van-uploader__upload {
    background: transparent;
  }

  .van-field {
    margin-top: 0.8rem;
    padding-left: 2rem;
    padding-right: 3.2rem;
  }

  .van-field__control {
    padding: 0;
    font-size: 1.12rem;
    color: #fff;
    border-bottom: 0.08rem solid #999;
  }

  textarea.van-field__control {
    border-bottom: none;
  }

  .desc_pic {
    padding: 1.6rem;
    .van-uploader__preview {
      margin-right: 1.4rem;
      margin-bottom: 1.6rem;
    }
    .van-uploader__preview:nth-child(3),
    .van-uploader__preview:last-child {
      margin-right: 0;
    }
    .van-uploader__preview-image {
      width: 8rem;
      height: 8rem;
    }
    .van-uploader__upload {
      margin: 0;
      width: 8rem;
      height: 8rem;
    }
  }
  .sale_tip {
    margin-top: 0.4rem;
    margin-left: 1.6rem;
    margin-bottom: -0.4rem;
    font-size: 0.96rem;
    color: #da2e63;
  }

  .desc_pic_upload {
    .van-uploader__input-wrapper {
      width: 8rem;
      height: 8rem;
      line-height: 8rem;
      text-align: center;
      border: 1px dashed #e5e5e5;
      color: #e5e5e5;
    }
    .van-uploader__file {
      width: 8rem;
      height: 8rem;
    }
  }
}
</style>