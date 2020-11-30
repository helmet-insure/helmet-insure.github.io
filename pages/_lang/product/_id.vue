<template>
  <div class="product-container">
    <Banner></Banner>
    <Breadcrumb :current="`${$route.params.id.toUpperCase()}`"></Breadcrumb>
    <HatOption></HatOption>
    <HatList></HatList>
    <Rent :data="curentItem" v-if="showRent" @close="openRent"></Rent>
  </div>
</template>
<script>
import Banner from '~/components/insurance/banner.vue';
import Breadcrumb from '~/components/insurance/breadcrumb.vue';
import HatOption from '~/components/insurance/hat-option.vue';
import HatList from '~/components/insurance/hat-list.vue';
import Rent from '~/components/insurance/rent.vue';

export default {
  layout: 'default',
  name: 'product',
  components: {
    Banner,
    Breadcrumb,
    HatOption,
    HatList,
    Rent,
  },
  data() {
    return {
      showRent: false,
      curentItem: {},
    };
  },
  methods: {
    openRent() {
      this.showRent = true;
    },
    closeRent() {
      this.showRent = false;
    },
  },
  mounted() {
    this.$bus.$on('OPEN_RENT', (data) => {
      this.showRent = true;
      this.curentItem = data;
    });
    this.$bus.$on('CLOSE_RENT', (data) => {
      this.showRent = false;
    });
  },
};
</script>
<style lang="scss" scoped>
.product-container {
}
</style>