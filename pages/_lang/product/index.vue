<template>
  <div class="home-container">
    <Title></Title>
    <Banner></Banner>
    <InsuranceCenter></InsuranceCenter>
    <InsuranceBottom></InsuranceBottom>
  </div>
</template>
<script>
import Banner from '~/components/insurance/banner.vue';
import InsuranceCenter from '~/components/insurance/insurance-center.vue';
import InsuranceBottom from '~/components/insurance/insurance-bottom.vue';
import Title from '~/components/insurance/title.vue';
export default {
  layout: 'default',
  name: 'home',
  components: {
    Banner,
    InsuranceCenter,
    InsuranceBottom,
    Title,
  },
};
</script>
<style lang="scss">
</style>
