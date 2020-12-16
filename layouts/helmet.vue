<template>
  <div class="helmet">
    <nuxt />
  </div>
</template>

<script>
import { mateMaskInfo } from '~/assets/utils/matemask.js';

export default {
  name: 'helmet',
  mounted() {
    this.showWallet();
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    showWallet() {
      try {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(async (account) => {
            window.localStorage.setItem('currentType', 'MetaMask');
            // setTimeout(() => {
            //     window.location.reload()
            // }, 500)
            let userInfo = await mateMaskInfo(account[0], 'MetaMask');
            this.$store.dispatch('setUserInfo', userInfo);
            this.$bus.$emit('REFRESH_ALL_DATA');
            this.$bus.$emit('REFRESH_MINING');
            this.closeDialog();
          });
      } catch (error) {
        console.log('MateMask 扩展插件未安装或未启用##', error);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .helmet {
    min-width: 1280px;
    width: 100%;
    min-height: 100vh;
    background: #121212;
  }
}
@media screen and (max-width: 750px) {
  .helmet {
    width: 100%;
    min-height: 100vh;
    background: #121212;
  }
}
</style>
