<template>
  <div class="balance">
    <section>
      <div>
        <span>{{ $t("Content.InsurancePrice") }}</span>
        <p>{{ strikePrice }} {{ unit }}</p>
      </div>
      <div>
        <span>{{ $t("Content.ProtectTheCycle") }}</span>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          {{ dueDate }}
        </p>
      </div>
    </section>

    <div>
      <span>{{ $t("Content.UsableBalance") }}</span>
      <div>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Helmet"></use></svg
          >{{ BalanceArray[underly] }} {{ underly }}
        </p>
        <!-- <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-BNB"></use></svg
          >{{ BalanceArray["BNB"] }} BNB
        </p> -->
        <!-- <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Qusd"></use></svg
          >{{ this.QUSD }} QUSD
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/svg/iconfont.js';
import { getBalance } from '~/interface/order.js';
import { uniswap } from '~/assets/utils/address-pool.js';
import precision from '~/assets/js/precision.js';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
export default {
  props: ['currentCoin', 'currentType'],
  data() {
    return {
      underly: 'HELMET', //标的物
      curType: 1,
      collateral: 'WBNB', //抵押物
      BalanceArray: {}, //当前结算币种
      QUSD: 0,
      BNB: 0,
      CAKE: 0,
      HELMET: 0,
      CKT: 0,
      FORTUBE: 0,
      indexPx: 300,
      unit: 'HELMET',
      precision,
      strikePrice: 600,
    };
  },
  computed: {
    dueDate() {
      return this.$store.state.dueDate
    },
    undAndCol() {
      if (this.underly && this.curType) {
        return {
          underly: this.underly,
          curType: this.curType,
        };
      }
    },
    IndexPxArray() {
      return this.$store.state.allIndexPrice
    }
  },
  watch: {
    currentCoin(val) {
      this.underly = val;
    },
    currentType(val) {
      this.curType = val;
    },
    undAndCol: {
      handler: 'undAndColWatch',
      immediate: true,
    },
  },
  mounted() {
    this.$bus.$on('REFRESH_BALANCE', () => {
      this.getBalance();
    });
    setTimeout(() => {
      this.getBalance();
    }, 1000);
  },
  methods: {
    async getBalance() {
      const helmetAmount = await getBalance('HELMET');
      const cakeAmount = await getBalance('CAKE');
      const ctkAmount = await getBalance('CTK');
      const fortubeAmount = await getBalance('FORTUBE');
      const bnbAmount = await getBalance('WBNB');
      const qusdAmount = await getBalance('QUSD');
      let BalanceArray = {
        BNB: fixD(bnbAmount, 4),
        QUSD: fixD(qusdAmount, 4),
        CAKE: fixD(cakeAmount, 4),
        HELMET: fixD(helmetAmount, 4),
        CTK: fixD(ctkAmount, 4),
        FORTUBE: fixD(fortubeAmount, 4),
      }
      this.BalanceArray = BalanceArray
    },
    undAndColWatch(newValue) {
      let list = this.IndexPxArray
      let coin = newValue.underly
      let type = newValue.curType
      let px;
      let exPx;
      if (!list.length) {
        return
      }
      if (type == 1) {
        px = list[0][coin]
        exPx = list[0][coin] * 2
        this.unit = coin
      } else {
        px = list[1][coin]
        exPx = list[1][coin] * 0.5
        this.unit = 'WBNB'
      }
      this.indexPx = px
      this.strikePrice = exPx
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .balance {
    margin-bottom: 30px;
    display: flex;
    section {
      display: flex;
      > div {
        width: 200px;
        span {
          font-size: 14px;
          color: #919aa6;
        }
        p {
          display: flex;
          align-items: center;
          margin-top: 8px;
          line-height: 24px;
          font-size: 14px;
          font-weight: bold;
          color: #121212;
          .icon {
            margin-right: 4px;
          }
        }
      }
    }
    > div {
      span {
        font-size: 14px;
        color: #919aa6;
      }
      p {
        display: flex;
        align-items: center;
        margin-top: 8px;
        line-height: 24px;
        font-size: 14px;
        font-weight: bold;
        color: #121212;
        .icon {
          margin-right: 4px;
        }
      }
      div {
        display: flex;
        p {
          margin-right: 50px;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .balance {
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    section {
      display: flex;
      > div {
        flex: 1;
        span {
          font-size: 14px;
          color: #919aa6;
        }
        p {
          display: flex;
          align-items: center;
          margin-top: 8px;
          line-height: 24px;
          font-size: 14px;
          font-weight: bold;
          color: #121212;
          .icon {
            margin-right: 4px;
          }
        }
      }
    }
    > div {
      margin-top: 20px;
      span {
        font-size: 14px;
        color: #919aa6;
      }
      p {
        flex: 1;
        display: flex;
        align-items: center;
        margin-top: 8px;
        line-height: 24px;
        font-size: 14px;
        font-weight: bold;
        color: #121212;
        .icon {
          margin-right: 4px;
        }
      }
      div {
        display: flex;
      }
    }
  }
}
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #787878;
  overflow: hidden;
}
</style>