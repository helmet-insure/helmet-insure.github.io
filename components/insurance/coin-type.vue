<template>
  <div class="coin_type">
    <button
      v-for="coin in coinList"
      :key="coin"
      @click="handleClickCoin(coin)"
      :class="curCoin == coin ? 'active' : ''"
    >
      {{ coin == "FORTUBE" ? "FOR" : coin }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['currentCoin'],
  data() {
    return {
      curCoin: 'HELMET',
    };
  },
  watch: {
    currentCoin(val) {
      this.curCoin = val;
    },
  },
  computed: {
    coinList() {
      return this.$store.state.coinList;
    },
  },
  methods: {
    handleClickCoin(coin) {
      this.$emit('changeCoin', coin);
      this.$bus.$emit('WATCH_COIN', coin)
      this.curCoin = coin;
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .coin_type {
    margin: 28px 0 29px;
    button {
      min-width: 76px;
      height: 40px;
      padding: 0 9px;
      margin-right: 14px;
      background: #f7f7fa;
      border-radius: 3px;
      color: #121212;
      &:hover {
        color: #ff9600;
      }
    }
    .active {
      background: #ff9600;
      color: #fff !important;
    }
  }
}
@media screen and (max-width: 750px) {
  .coin_type {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    button {
      min-width: 76px;
      height: 40px;
      padding: 0 9px;
      background: #f7f7fa;
      border-radius: 3px;
      color: #121212;
      &:hover {
        color: #ff9600;
      }
    }
    .active {
      background: #ff9600;
      color: #fff !important;
    }
  }
}
</style>