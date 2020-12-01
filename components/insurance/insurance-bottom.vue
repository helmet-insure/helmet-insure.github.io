<template>
  <div class="insurance_bottom">
    <BuyType text1="购买保险" text2="我要承保"></BuyType>
  </div>
</template>

<script>
import BuyType from './buy-type.vue';

export default {
  components: {
    BuyType,
  },
};
</script>

<style lang='scss' scoped>
.insurance_bottom {
  margin-bottom: 10px;
  background: #fff;
  padding: 40px 60px;
}
</style>  