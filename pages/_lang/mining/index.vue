<template>
  <div class="mining_container">
    <!-- <Banner></Banner> -->
    <!-- <p class="mining-list-title">Select Your Mining Pool</p> -->
    <HelmetPool></HelmetPool>
    <MiningList></MiningList>
    <!-- <Protect :styleClass="'mining-home'"></Protect> -->
    <Deposite
      :current="current"
      :TradeType="TradeType"
      @close="closeDeposite"
      v-if="showDeposite"
    ></Deposite>
  </div>
</template>

<script>
import Banner from '~/components/mining/banner.vue';
import HelmetPool from '~/components/mining/helmet-pool.vue';
import MiningList from '~/components/mining/mining-list.vue';
import Protect from '~/components/mining/protect.vue';
import Deposite from '~/components/mining/deposite-dialog.vue';
import Withdraw from '~/components/mining/withdraw-dialog.vue';
export default {
  layout: 'default',
  components: {
    Banner,
    HelmetPool,
    MiningList,
    Protect,
    Deposite,
    Withdraw,
  },
  data() {
    return {
      showDeposite: false,
      showWithdraw: false,
      current: '',
      TradeType: '',
    };
  },
  mounted() {
    this.$bus.$on('OPEN_DEPOSITE', (data) => {
      this.current = data.current;
      this.TradeType = data.TradeType;
      this.showDeposite = true;
    });
    this.$bus.$on('CLOSE_DEPOSITE', (data) => {
      this.showDeposite = false;
    });
  },
  methods: {
    closeDeposite() {
      this.showDeposite = false;
    },
    openDeposite() {
      this.showDeposite = true;
    },
    closeWithdraw() {
      this.showWithdraw = false;
    },
    openWithdraw() {
      this.showWithdraw = true;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
.mining_container {
  background: #f7f7fa;
}
@media screen and (min-width: 750px) {
  .mining-list-title {
    height: 60px;
    line-height: 60px;
  }
}
@media screen and (max-width: 750px) {
  .mining-list-title {
    font-size: 16px;
    color: $text-t;
    height: 60px;
    line-height: 60px;
    padding-left: 16px;
  }
}
</style>