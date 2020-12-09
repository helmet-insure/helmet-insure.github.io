<template>
  <div class="wallet-connect" v-if="!userInfo.data.isLogin">
    <a @click="toConnect">Connect to a wallet</a>
  </div>
</template>

<script>
export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    toConnect() {
      this.$store.dispatch("setMaskDialog", true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and(min-width: 750px) {
  .wallet-connect {
    display: none;
  }
}
@media screen and(max-width: 750px) {
  .wallet-connect {
    width: 100%;
    display: flex;
    margin: 20px 0 15px;
    a {
      margin: 0 auto;
      width: 55%;
      min-width: 173px;
      height: 40px;
      background: $main-color;
      border-radius: 100px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
    }
    a:hover {
      background: $main-hover;
    }
  }
}
</style>