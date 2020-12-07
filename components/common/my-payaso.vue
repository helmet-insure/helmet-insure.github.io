<template>
  <div class="my-payaso" v-if="showPayaso">
    <Header></Header>
    <div class="payaso-title">{{ $t('Assets.My') }} PAYA</div>
    <div class="payaso-settle">
      <div class="assets">
        <p>
          <span>Paya{{ $t('Dialog.Amount') }}</span
          ><span>{{ addCommom(myPaya, 2) }}</span>
        </p>
        <div class="assets-claim">
          <!-- <p><span>钱包余额</span><span>1,000</span></p> -->
          <p>
            <span>{{ $t('Assets.BorrowingReward') }}</span
            ><span>{{ addCommom(payaSettle, 2) }}</span>
          </p>
          <a @click="toClaim(1)">{{ $t('Table.Claim') }}</a>
        </div>
      </div>
    </div>
    <div class="payaso-assets">
      <p>
        <span>{{ $t('Assets.Circulation') }}</span
        ><span>{{ addCommom(precision.minus(totalPaya, mined), 2) }}</span>
      </p>
      <p>
        <span>{{ $t('Assets.ValidBorrowing') }}</span
        ><span>{{ addCommom(frequency, 2) }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import Header from '~/components/common/header.vue';
import { getPAYA } from '~/interface/deposite.js';
import { claim } from '~/interface/order.js';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import precision from '~/assets/js/precision.js';
export default {
  data() {
    return {
      precision: precision,
      addCommom: addCommom,
    };
  },
  components: {
    Header,
  },
  computed: {
    showPayaso() {
      return this.$store.state.showDialog.showPayaso;
    },
    frequency() {
      return this.$store.state.assets.validBorrowing;
    },
    mined() {
      return this.$store.state.assets.mined;
    },
    totalPaya() {
      return this.$store.state.assets.totalPaya;
    },
    myPaya() {
      return this.$store.state.assets.myPaya;
    },
    payaSettle() {
      return this.$store.state.assets.payaSettle;
    },
    assets() {
      return this.$store.state.assets;
    },
    myUNI_DOUBLE() {
      return this.$store.state.myUNI;
    },
    myPAYA_DOUBLE() {
      return this.$store.state.myPAYA;
    },
  },

  mounted() {
    // totalSupply();
    this.getAssets();
    this.$bus.$on('REFRESH_ASSETS', (data) => {
      this.getAssets();
    });
  },
  watch: {
    assets: {
      handler: 'assetsWatch',
      immediate: true,
    },
  },
  methods: {
    assetsWatch(newValue) {
      if (!newValue) {
        this.getAssets();
      }
    },
    async getAssets() {
      setTimeout(() => {
        // this.$store.dispatch('getValidBorrowing');
        // this.$store.dispatch('getTotalPaya');
        // this.$store.dispatch('getTotalMined');
        // this.$store.dispatch('getMyPayaso');
        // this.$store.dispatch('getPayaSettle');
        // this.$store.dispatch("getmyUNI");
        // this.$store.dispatch("getmyPAYA");
      }, 1000);
    },
    async toClaim(key) {
      if (key == 1) {
        let res = await claim();
      }
      if (key == 2) {
        let res = await getPAYA();
      }
      this.$store.dispatch('setPayasoDialog', false);
    },
  },
};
</script>

<style lang='scss' soped>
@import '~/assets/css/base.scss';
.my-payaso {
  width: 100%;
  overflow: hidden;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #111111;
  .payaso-title {
    height: 60px;
    font-size: 16px;
    color: $text-t;
    line-height: 60px;
    margin: 15px 16px 0;
    box-shadow: 0px 1px 0px 0px #1d1d1d;
  }
  .payaso-settle {
    margin: 0 16px;
    padding: 12px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    box-shadow: 0px 1px 0px 0px #1d1d1d;
    .assets {
      width: 100%;
      div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      p {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        span:nth-of-type(1) {
          font-size: 12px;
          color: $text-g;
          margin-bottom: 7px;
        }
      }
    }
    a {
      margin-top: 8px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 500;
      background: #873232;
      border-radius: 5px;
      color: $text-m;
    }
  }
  .payaso-assets {
    padding: 4px 16px 0;
    p {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      span:nth-of-type(1) {
        font-size: 12px;
        color: $text-g;
      }
      span:nth-of-type(2) {
        font-size: 12px;
        color: $text-t;
      }
    }
  }
}
</style>