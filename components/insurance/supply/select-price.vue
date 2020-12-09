<template>
  <div class="select-price-block">
    <div class="price-loading" v-if="priceLoading"></div>
    <select class="select-price select" v-model="execPrice" v-else>
      <option v-for="(item, index) in priceList" :key="index">
        {{ item }}
      </option>
    </select>

    <p class="index-price">{{ $t('Dialog.UniswapIndex') }}: {{ indexPx }}</p>
  </div>
</template>
<script>
import { uniswap } from '~/assets/utils/address-pool.js';
import { toPrecision } from '~/assets/js/util.js';

export default {
  name: 'select-price',
  props: ['indexPx'],
  data() {
    return {
      priceList: [],
      execPrice: '',
      priceLoading: false,
    };
  },
  watch: {
    indexPx: {
      handler: 'indexPxWatch',
      immediate: true,
    },
    execPrice(newValue) {
      this.$emit('change', newValue);
    },
  },
  mounted() {
    this.$bus.$on('PRICE_START_CHANGE', () => {
      this.priceLoading = true;
    });
    this.$bus.$on('PRICE_CHANGE_SUCCESS', () => {
      this.priceLoading = false;
    });
  },
  methods: {
    async indexPxWatch(newValue) {
      if (!this.indexPx) {
        this.priceList = [];
        this.execPrice = '';
        return;
      }
      let arr = [];
      let count = 0;
      let rate = 1;
      let price;
      while (count < 10) {
        price = toPrecision((this.indexPx / 100) * (100 + rate));
        rate++;
        if (!arr.includes(price)) {
          arr.push(price);
          count++;
        }
        if (rate > 100) {
          count = 10;
        }
      }
      this.priceList = arr;
      this.execPrice = arr[0];
      this.priceLoading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';

@media screen and (max-width: 750px) {
  .index-price {
    display: none;
  }
  .price-loading {
    height: 40px;
    border-radius: 3px;
    border: 1px solid $border;
    background: $bg-d;
    color: $text-t;
    padding-left: 16px;
    appearance: none;
    background: url('../../../assets/img/loading.gif') 100% center no-repeat;
    background-size: 20px 20px;
    font-size: 16px;
    cursor: pointer;
    cursor: wait;
  }
}
@media screen and (min-width: 750px) {
  .select-price-block {
    .select-price {
      width: 200px;
    }
    .index-price {
      color: $text-d;
      text-align: right;
      font-size: 12px;
      padding-top: 5px;
    }
  }
  .price-loading {
    height: 40px;
    border-radius: 3px;
    border: 1px solid $border;
    background: $bg-d;
    color: $text-t;
    padding-left: 16px;
    appearance: none;
    background: url('../../../assets/img/loading.gif') 174px center no-repeat;
    background-size: 20px 20px;
    font-size: 16px;
    cursor: pointer;
    cursor: wait;
  }
}
</style>