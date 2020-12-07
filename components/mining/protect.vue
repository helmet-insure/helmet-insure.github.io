<template>
  <div :class="`mining-protect`">
    <img src="~/assets/img/icon/mining_safe.png" alt="" />
    <div class="text">
      <p><slot></slot></p>
    </div>
    <span class="text_btn" @click="toBorrowed">{{ $t('Table.Borrowed') }}</span>
  </div>
</template>

<script>
export default {
  methods: {
    toBorrowed() {
      this.$router.push({ path: '/product/weth' });
    },
  },
};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .mining-protect {
    margin: 20px 50px 0;
    height: 50px;
    background: #191919;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    img {
      width: 44px;
      height: 34px;
      margin-right: 16px;
    }
    .text {
      flex: 1;
    }
    .text_btn {
      font-size: 14px;
      color: $text-l;
      cursor: pointer;
      &:hover {
        color: #c34b4c;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .mining-protect {
    margin: 32px auto 0;
    width: 100%;
    height: 50px;
    background: #191919;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    img {
      width: 44px;
      height: 34px;
      margin-right: 4px;
    }
    .text {
      flex: 1;
    }
    .text_btn {
      font-size: 14px;
      color: $text-l;
      &:hover {
        color: #c34b4c;
      }
    }
  }
}
</style>