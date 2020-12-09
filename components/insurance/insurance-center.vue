<template>
  <div class="insurance_center">
    <div class="buy-type">
      <button
        @click="handleClickType('buy')"
        :class="type == 'buy' ? 'active' : ''"
      >
        {{ $t('Type.BuyInsurance') }}
      </button>
      <button
        @click="handleClickType('sell')"
        :class="type == 'sell' ? 'active' : ''"
      >
        {{ $t('Type.ToInsurance') }}
      </button>
    </div>
    <CoinType
      @changeCoin="handleClickCoinType"
      :currentCoin="curCoin"
    ></CoinType>
    <Echart></Echart>
    <InsuranceType
      @changeType="handleClickTradeType"
      :currentType="type"
    ></InsuranceType>
    <Balance :currentCoin="curCoin" :currentType="TradeType"></Balance>
    <InsuranceList v-if="type == 'buy'"></InsuranceList>
    <InsuranceForm v-if="type == 'sell'"></InsuranceForm>
  </div>
</template>

<script>
import CoinType from './coin-type.vue';
import Echart from './echart.vue';
import InsuranceType from './insurance-type.vue';
import Balance from './balance.vue';
import InsuranceList from './insurance-list.vue';
import InsuranceForm from './insurance-form.vue';
export default {
  components: {
    CoinType,
    Echart,
    InsuranceType,
    Balance,
    InsuranceList,
    InsuranceForm,
  },
  data() {
    return {
      type: 'buy',
      curCoin: 'BNB',
      TradeType: 1,
    };
  },
  mounted() {},
  methods: {
    // 选择买卖类型
    handleClickType(type) {
      this.type = type;
    },
    // 选择币种类型
    handleClickCoinType(coin) {
      this.curCoin = coin;
    },
    //选择保险品种
    handleClickTradeType(type) {
      this.TradeType = type;
    },
  },
};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
@media screen and(min-width:750px) {
  .insurance_center {
    margin-bottom: 10px;
    background: #fff;
    padding: 40px 60px;
  }
  .buy-type {
    background: #f7f7fa;
    width: 100%;
    display: flex;
    height: 50px;
    border-bottom: 2px solid #ff9600;
    border-radius: 3px 3px 0px 0px;
    overflow: hidden;
    button {
      border: none;
      outline: none;
      flex: 1;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      font-weight: bold;
      color: #121212;
      border-radius: 3px 3px 0px 0px;
    }
    .active {
      background: #ff9600;
      color: #fff;
    }
  }
}
@media screen and(max-width:750px) {
  .insurance_center {
    margin-bottom: 10px;
    background: #fff;
    padding: 20px 16px;
  }
  .buy-type {
    background: #f7f7fa;
    width: 100%;
    display: flex;
    height: 50px;
    border-bottom: 2px solid #ff9600;
    border-radius: 3px 3px 0px 0px;
    overflow: hidden;
    button {
      border: none;
      outline: none;
      flex: 1;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      font-weight: bold;
      color: #121212;
      border-radius: 3px 3px 0px 0px;
    }
    .active {
      background: #ff9600;
      color: #fff;
    }
  }
}
</style>