<template>
  <div class="mining-option">
    <Breadcrumb :current="$route.params.id.toUpperCase()"></Breadcrumb>
    <TokenWrap :current="$route.params.id.toUpperCase()"></TokenWrap>
    <Deposite
      :current="$route.params.id.toUpperCase()"
      @close="closeDeposite"
      v-if="showDeposite"
    ></Deposite>
    <Withdraw
      :current="$route.params.id.toUpperCase()"
      @close="closeWithdraw"
      v-if="showWithdraw"
    ></Withdraw>
  </div>
</template>

<script>
import Breadcrumb from '~/components/mining/breadcrumb.vue';
import TokenWrap from '~/components/mining/token-wrap.vue';
import Deposite from '~/components/mining/deposite-dialog.vue';
import Withdraw from '~/components/mining/withdraw-dialog.vue';
export default {
  layout: 'default',
  components: { Breadcrumb, TokenWrap, Deposite, Withdraw },
  data() {
    return {
      showDeposite: false,
      showWithdraw: false,
    };
  },
  mounted() {
    this.$bus.$on('OPEN_DEPOSITE', (data) => {
      this.showDeposite = true;
    });
    this.$bus.$on('CLOSE_DEPOSITE', (data) => {
      this.showDeposite = false;
    });
    this.$bus.$on('OPEN_WITHDRAW', (data) => {
      this.showWithdraw = true;
    });
    this.$bus.$on('CLOSE_WITHDRAW', (data) => {
      this.showWithdraw = false;
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
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
}
</style>