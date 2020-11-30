<template>
  <div class="coin-collateral">
    <label>{{ $t('Content.Collateral') }}</label>
    <!-- <ul>
            <li :class="item === current ? 'active' : ''" 
                v-for="item in coinList" 
                :key="item"
                @click="selectCoin(item)"
            >{{item}}</li>
        </ul> -->
    <coinTab @change="selectCoin" default="All"></coinTab>
  </div>
</template>
<script>
import coinTab from '~/components/common/coin-tab.vue';

export default {
  name: 'coin-collateral',
  components: {
    coinTab,
  },
  data() {
    return {
      current: 'All',
    };
  },
  computed: {
    coinList() {
      return this.$store.state.coinList;
    },
  },
  methods: {
    selectCoin(item) {
      this.current = item;
      this.$bus.$emit('HAT_LIST_LOADING', true);
      this.$store.dispatch('getHatList', {
        und: this.$route.params.id.toUpperCase(),
        col: item === 'All' ? '' : item,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
}
@media screen and (max-width: 750px) {
  .coin-collateral {
    padding: 0 16px;
  }
}
.coin-collateral {
  display: flex;
  align-items: center;
  margin-top: 20px;
  label {
    font-size: 16px;
    color: $text-m;
    margin-right: 6px;
  }
  ul {
    display: flex;
    align-items: center;
    li {
      height: 32px;
      line-height: 32px;
      padding: 0px 10px;
      border-radius: 10px;
      text-align: center;
      color: $text-t;
      background: $bg-a;
      margin-right: 16px;
      cursor: pointer;
      &:hover,
      &.active {
        background: $border;
      }
    }
  }
}
</style>