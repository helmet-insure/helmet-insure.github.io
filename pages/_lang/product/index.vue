<template>
  <div class="home-container">
    <Banner></Banner>
    <InsuranceCenter></InsuranceCenter>
    <InsuranceBottom></InsuranceBottom>
  </div>
</template>
<script>
import Banner from '~/components/insurance/banner.vue';
import InsuranceCenter from '~/components/insurance/insurance-center.vue';
import InsuranceBottom from '~/components/insurance/insurance-bottom.vue';
export default {
  layout: 'default',
  name: 'home',
  components: {
    Banner,
    InsuranceCenter,
    InsuranceBottom,
  },
};
</script>
<style lang="scss">
</style>
