<template>
  <ul class="coin-radio-list">
    <li v-for="item in coinList" :key="item" @click="selectCoin(item)">
      <img v-if="item !== current" src="~/assets/img/icon/radio2.png" />
      <img v-else src="~/assets/img/icon/radio1.png" />
      <label>{{ item }}</label>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'coin-radio',
  data() {
    return {
      current: 'USDT',
    };
  },
  computed: {
    coinList() {
      return this.$store.state.coinList;
    },
  },
  methods: {
    selectCoin(coin) {
      this.current = coin;
      this.$emit('change', coin);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .coin-radio-list {
    li {
      display: flex;
      align-items: center;
      > img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .coin-radio-list {
    li {
      display: flex;
      align-items: center;
      > img {
        width: 16px;
        height: 16px;
      }
      label {
        font-size: 14px;
      }
    }
  }
}
.coin-radio-list {
  display: flex;
  align-items: center;
  margin-top: 20px;
  li {
    display: flex;
    align-items: center;
    margin-right: 50px;
    > img {
      margin-right: 10px;
    }
  }
}
</style>