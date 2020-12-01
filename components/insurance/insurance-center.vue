<template>
  <div class="insurance_center">
    <BuyType text1="购买保险" text2="我要承保"></BuyType>
    <CoinType></CoinType>
    <Echart></Echart>
    <InsuranceType></InsuranceType>
    <Balance></Balance>
    <InsuranceList></InsuranceList>
  </div>
</template>

<script>
import BuyType from './buy-type.vue';
import CoinType from './coin-type.vue';
import Echart from './echart.vue';
import InsuranceType from './insurance-type.vue';
import Balance from './balance.vue';
import InsuranceList from './insurance-list.vue';
export default {
  components: {
    BuyType,
    CoinType,
    Echart,
    InsuranceType,
    Balance,
    InsuranceList,
  },
};
</script>

<style lang='scss' scoped>
.insurance_center {
  margin-bottom: 10px;
  background: #fff;
  padding: 40px 60px;
}
</style>