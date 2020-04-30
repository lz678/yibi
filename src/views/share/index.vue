<!-- share -->
<template>
  <div class="share">
    <van-nav-bar
      fixed
      title="邀请好友"
      left-arrow
      right-text="重新生成"
      @click-left="$router.go(-1)"
      @click-right="handleRefesh"
    />

    <div class="content">
      <div class="swiper_tem">
        <swiper ref="swiper" :options="swiperOption">
          <swiper-slide v-for="(item,index) in share_imgs" :key="index">
            <img :src="item" alt />
            <!-- <div class="qrcode">
              <img :src="qrcodeUrl" alt />
            </div>-->
          </swiper-slide>
        </swiper>
      </div>

      <div class="share_btn_wrap">
        <div
          class="share_btn"
          id="copy_code"
          data-clipboard-target="#share_code"
          data-clipboard-action="copy"
          @click="handleShareCode"
        >
          <div class="share_btn_icon">
            <!-- <img src="../../assets/images/share_code.png" alt /> -->
          </div>
          <div class="share_btn_title">复制邀请码</div>
        </div>
        <div
          class="share_btn"
          id="copy_link"
          data-clipboard-target="#share_link"
          data-clipboard-action="copy"
          @click="handleShareLink"
        >
          <div class="share_btn_icon">
            <!-- <img src="../../assets/images/share_link.png" alt /> -->
          </div>
          <div class="share_btn_title">复制链接</div>
        </div>
        <div class="share_btn" @click="saveImg">
          <div class="share_btn_title">分享海报</div>
        </div>
      </div>
    </div>

    <span class="hidden" id="share_code">{{share_id}}</span>
    <span class="hidden" id="share_link">{{link}}</span>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
import { getStore } from '@/utils/utils'
export default {
  name: 'share',
  components: {},
  data () {
    return {
      swiperOption: {
        initialSlide: 1,
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 1,

        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },

        autoplayDisableOnInteraction: false
      },

      share_imgs: [],

      share_id: '',

      link: '',

      qrcodeUrl: ''
    }
  },
  computed: {},
  methods: {
    getShareInfo () {
      return this.$api.getShareInfo()
        .then(data => {
          console.log(data)
          if (data.code === 1) {
            this.link = data.data.url
            this.share_id = data.data.share_id
            this.share_imgs = data.data.share_imgs
          }
        })
    },

    handleShareCode () {
      this.$nextTick(() => {
        const btn = document.querySelector('#copy_code')
        var copyBtn = new ClipboardJS(btn)
        copyBtn.on("success", (e) => {
          this.$toast('复制成功')
          e.clearSelection();
        });
        copyBtn.on("error", function (e) {
          console.log(e.action)
        });
      })
    },

    handleShareLink () {
      this.$nextTick(() => {
        const btn = document.querySelector('#copy_link')
        var copyBtn = new ClipboardJS(btn)
        copyBtn.on("success", (e) => {
          this.$toast('复制成功')
          e.clearSelection();
        });
        copyBtn.on("error", function (e) {
          console.log(e.action)
        });
      })
    },

    async handleRefesh () {
      await this.getShareInfo()
      this.$toast('刷新成功')
    },

    saveImg () {
      const i = this.$refs.swiper.swiper.activeIndex
      const url = this.share_imgs[i]
      const elink = document.createElement('a')
      elink.download = this.share_id
      elink.style.display = 'none'
      elink.href = url
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    }
  },
  created () {
    this.getShareInfo()
  },
  mounted () { }
}
</script>

<style lang='scss'>
.share {
  padding-top: 4rem;

  .swiper_tem {
    padding-top: 2.4rem;
    // width: 100%;
    // height: 180px;
    // background: #f4f4f4;
    .swiper {
      width: 100%;
      overflow: hidden;
    }

    .swiper-slide {
      width: 80%;
      height: 39.2rem;
      border-radius: 0.533333rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .swiper-slide:not(.swiper-slide-active) {
      transform: scale(0.85);
    }
  }

  .qrcode {
    position: absolute;
    bottom: 3.6rem;
    left: 50%;
    margin-left: -4.8rem;
    width: 9.6rem;
    height: 9.6rem;
    border-radius: 0.8rem;
    overflow: hidden;
  }

  .share_btn_wrap {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4rem;
    background: #34222f;
  }

  .share_btn {
    width: 25%;
    height: 4rem;
    text-align: center;
    font-size: 0.96rem;
  }
  .share_btn:last-child {
    width: 50%;
    line-height: 4rem;
    background: #da2e63;
    font-size: 1.2rem;
  }
  .share_btn_icon {
    margin: 0.64rem auto 0.4rem;
    width: 1.44rem;
    height: 1.44rem;
  }
  .hidden {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
</style>