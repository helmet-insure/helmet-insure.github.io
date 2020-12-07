<template>
  <div class="balance">
    <section>
      <div>
        <span>出险价格</span>
        <p>200.0100 BNB</p>
      </div>
      <div>
        <span>保护周期</span>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          200.0100 BNB
        </p>
      </div>
    </section>

    <div>
      <span>可用余额</span>
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
export default {
  props: ['currentCoin'],
  data() {
    return {
      curCoin: 'BNB',
      QUSD: 0,
      BNB: 0,
      CAKE: 0,
      HELMET: 0,
    };
  },
  watch: {
    currentCoin(val) {
      this.curCoin = val;
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
      const bnbAmount = await getBalance('WBNB');
      const qusdAmount = await getBalance('QUSD');
      const cakeAmount = await getBalance('CAKE');
      const helmetAmount = await getBalance('HELMET');
      this.BNB = bnbAmount;
      this.QUSD = qusdAmount;
      this.CAKE = cakeAmount;
      this.HELMET = helmetAmount;
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
        margin-right: 100px;
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
      margin-right: 100px;
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