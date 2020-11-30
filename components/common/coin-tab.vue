<template>
  <div class="coin-tab">
    <span :class="current === 'All' ? 'active' : ''" @click="selectCoin('All')"
      >All</span
    >
    <span
      :class="current === item ? 'active' : ''"
      v-for="item in coinList"
      :key="item"
      @click="selectCoin(item)"
      >{{ item }}</span
    >
  </div>
</template>
<script>
export default {
  name: "coin-tab",
  props: ["default"],
  data() {
    return {
      current: "",
    };
  },
  computed: {
    coinList() {
      return this.$store.state.coinList;
    },
  },
  watch: {
    default: {
      handler: "defaultWatch",
      immediate: true,
    },
  },
  methods: {
    defaultWatch(newValue) {
      if (newValue) {
        this.current = newValue;
      }
    },
    selectCoin(item) {
      this.current = item;
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (max-width: 750px) {
  .coin-tab {
    span {
      margin-right: 5px;
    }
  }
}
@media screen and (min-width: 750px) {
  .coin-tab {
    span {
      margin-right: 15px;
    }
  }
}
.coin-tab {
  display: flex;
  span {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding: 0px 10px;
    border-radius: 10px;
    text-align: center;
    color: $text-t;
    background: $bg-a;
    cursor: pointer;
    &.active,
    &:hover {
      background: $border;
    }
  }
}
</style>