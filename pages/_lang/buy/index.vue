<template>
  <div class="buy-container">
    <!-- <OrderOption></OrderOption>
        <div class="expiration-reminder">
            You currently hold a Safety Helmet that is about to expire, please activate or return it in a timely manner. The smart contract will return it automatically when it expires!
        </div> -->
    <h1 class="buy-title">矿工帽订单</h1>
    <div class="buy-list-box">
      <BuyList></BuyList>
    </div>
  </div>
</template>
<script>
// import OrderOption from '~/components/buy/order-option.vue';
import BuyList from '~/components/buy/buy-list.vue';

export default {
  layout: 'default',
  name: 'p-buy',
  components: {
    // OrderOption,
    BuyList,
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (max-width: 750px) {
  .buy-container {
    .buy-title {
      height: 60px;
      font-size: 14px;
      font-weight: 500;
      color: #dbdbdb;
      line-height: 60px;
      padding: 0 16px;
      box-shadow: 0px 1px 0px 0px #1d1d1d;
    }
  }
}
@media screen and (min-width: 750px) {
  .buy-title {
    display: none;
  }
  .buy-container {
    padding-top: 40px;
  }
}
</style>