<!-- layout -->
<template>
  <div class="layout">
    <div class="container">
      <router-view />
    </div>

    <nav-bar />
  </div>
</template>

<script>
import navBar from './children/nav_bar'
export default {
  name: 'layout',
  components: { navBar },
  data () {
    return {
    }
  },
  computed: {},
  methods: {},
  created () { },
  mounted () { }
}
</script>

<style lang='scss'>
.layout {
  height: 100%;
  .container {
    height: calc(100% - 4rem);
    overflow: auto;
  }
}
</style>