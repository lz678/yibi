<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { setHtmlFontSize, formatDate } from '@/utils/utils'
export default {
  name: 'App',
  created () {

  },
  mounted () {
    formatDate()
    setHtmlFontSize()
  }
}
</script>
