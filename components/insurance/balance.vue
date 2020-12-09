<template>
  <div class="balance">
    <section>
      <div>
        <span>{{ $t('Content.InsurancePrice') }}</span>
        <p>{{ indexPx || 0 }} {{ unit }}</p>
      </div>
      <div>
        <span>{{ $t('Content.ProtectTheCycle') }}</span>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          {{ dueDate }}
        </p>
      </div>
    </section>

    <div>
      <span>{{ $t('Content.UsableBalance') }}</span>
      <div>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-BNB"></use></svg
          >{{ this.BNB }} BNB
        </p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Helmet"></use></svg
          >{{ this.HELMET }} HELMET
        </p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Qusd"></use></svg
          >{{ this.QUSD }} QUSD
        </p>
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
      dueDate: '2020-12-09 00:00',
      QUSD: 0,
      BNB: 0,
      CAKE: 0,
      HELMET: 0,
      indexPx: 0,
      unit: 'BNB',
    };
  },
  computed: {
    // 保费
    // 预期日化收益 = ((指数价格 - 执行价格) + 保费) / (执行价格 * 天数)
    // 保费 = 预期日化收益 * 执行价格 * 天数 - 指数价格-执行价格);
 
    CoinType() {
      if (this.underly && this.collateral && this.curType) {
        return {
          underly: this.underly,
          collateral: this.collateral,
          Type: this.curType,
        };
      }
    },
  },
  watch: {
    currentCoin(val) {
      this.underly = val;
    },
    currentType(val) {
      this.curType = val;
    },
    CoinType: {
      handler: 'CoinTypeWatch',
      immediate: true,
    },
  },
  mounted() {
    this.$bus.$on('REFRESH_BALANCE', () => {
      this.getBalance();
    });
    setTimeout(() => {
      this.getBalance();
      this.getIndexPrice();
    }, 1000);
  },
  methods: {
    async getBalance() {
      const bnbAmount = await getBalance('WBNB');
      const qusdAmount = await getBalance('QUSD');
      const cakeAmount = await getBalance('CAKE');
      const helmetAmount = await getBalance('HELMET');
      this.BNB = fixD(bnbAmount,4);
      this.QUSD = fixD(qusdAmount,4);
      this.CAKE = fixD(cakeAmount,4);
      this.HELMET = fixD(helmetAmount,4) ;
    },
    async CoinTypeWatch(newValue) {
        this.collateral = 'WBNB';
        this.underly = this.underly;
        this.unit = 'BNB';
      const px = await uniswap(this.underly, this.collateral, window.chainID);
      if (newValue.Type == 1) {
        this.indexPx = fixD(px * 2, 4);
      } else {
        this.indexPx = fixD(px / 2, 4);
      }
      this.$store.commit('SET_INDEX_PRICE', this.indexPx);
    },
    async getIndexPrice() {
      const px = await uniswap(this.underly, this.collateral);
      this.indexPx = fixD(px, 4);
      if (this.curType == 1) {
        this.indexPx = fixD(px * 2, 4);
      } else {
        this.indexPx = fixD(px / 2, 4);
      }
      this.$store.commit('SET_INDEX_PRICE', this.indexPx);
      this.$store.commit('SET_DUR_DATE',this.dueDate)
    }
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