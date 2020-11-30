<template>
  <div class="home-container">
    <Banner></Banner>
    <Insurance></Insurance>
  </div>
</template>
<script>
import Insurance from '~/components/insurance/index.vue';
import Banner from '~/components/insurance/banner.vue';

export default {
  layout: 'default',
  name: 'home',
  components: {
    Banner,
    Insurance,
  },
};
</script>
<style lang="scss">
.home-container {
  /* padding-bottom: 90px; */
}
</style>
