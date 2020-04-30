<!-- download -->
<template>
  <div class="download">下载</div>
</template>

<script>
export default {
  name: 'download',
  components: {},
  data () {
    return {
    }
  },
  computed: {},
  methods: {},
  created () {
    this.$api.getAppDownloadAddress()
      .then(data => {
        console.log(data, 'getAppDownloadAddress')
        if (data.code === 1) {
          window.location.href = data.data.web.url
        }
      })
  },
  mounted () { }
}
</script>

<style lang='scss'>
.download {
}
</style>