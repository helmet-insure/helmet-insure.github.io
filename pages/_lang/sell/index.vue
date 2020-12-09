<template>
  <div class="sell-container">
    <Settlement></Settlement>
    <PTabs
      :current="currentOrderTab"
      :data="orderTabs"
      @change="orderTabChanged"
    ></PTabs>
    <!-- <div class="order-option-container">
            <OrderOption></OrderOption>
        </div> -->
    <div class="list-container">
      <AdvertList v-if="currentOrderTab === 'Advertising'"></AdvertList>
      <OrderList v-if="currentOrderTab === 'Orders'"></OrderList>
    </div>
  </div>
</template>
<script>
import Settlement from '~/components/settlement/index.vue';
// import OrderOption from '~/components/buy/order-option.vue';
import PTabs from '~/components/common/p-tabs.vue';
import AdvertList from '~/components/sell/advert-list.vue';
import OrderList from '~/components/sell/order-list.vue';

export default {
  layout: 'default',
  name: 'p-sell',
  components: {
    // OrderOption,
    Settlement,
    PTabs,
    AdvertList,
    OrderList,
  },
  data() {
    return {
      currentOrderTab: 'Advertising',
    };
  },
  computed: {
    orderTabs() {
      return ['Orders', 'Advertising'];
    },
  },
  methods: {
    orderTabChanged(item) {
      this.currentOrderTab = item;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .sell-container {
    .order-option-container {
      padding-top: 20px;
    }
    .list-container {
      padding-top: 20px;
    }
  }
}
@media screen and (max-width: 750px) {
  .sell-container {
    .order-option-container {
      padding-top: 20px;
    }
  }
}
</style>