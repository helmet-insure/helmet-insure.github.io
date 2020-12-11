<template>
  <div class="insurance_form">
    <div>
      <div class="dpr">
        <input type="text" v-model="dpr" />
        <span class="left">DPR</span>
        <span class="right">%</span>
      </div>
      <div class="num">
        <input type="text" v-model="volume" />
        <span class="right">全部</span>
      </div>
      <button class="b_b_button" @click="submitSupply">立即创建</button>
    </div>
    <div class="pay">
      <p>
        折合：<span>{{ precision.times(volume * _strikePrice, 4) }} BNB</span>
      </p>
      <p>预期最大收益：<span>11111 BNB</span></p>
      <!-- <p>
        保费：<span>{{ Rent }} BNB</span>
      </p> -->
      <!-- <p>预期最大收益：<span>11111 BNB</span></p> -->
    </div>
    <span>
      如果在行权日之前，价格没有达到 <i>XXX</i> ，您将获得无风险收益。
    </span>
  </div>
</template>

<script>
import { onIssue } from '~/interface/order.js';
import precision from '~/assets/js/precision.js';
export default {
  props: ['currentType'],
  data() {
    return {
      dpr: '', //DPR
      volume: '', //数量
      precision,
      Rent: 0,
      tradeType: 1,
    };
  },
  computed: {
    indexPrice() {
      return this.$store.state.Options.indexPrice;
    },
    _expiry() {
      return this.$store.state.Options._expiry;
    },
    _strikePrice() {
      return this.$store.state.Options._strikePrice;
    },
    _underlying() {
      return this.$store.state.Options._underlying;
    },
    RentGrounp() {
      return {
        dpr: this.dpr,
        indexPrice: this.$store.state.Options.indexPrice,
      };
    },
  },
  watch: {
    currentType(newValue) {
      this.tradeType = newValue
    },
    RentGrounp: {
      handler: {
        handler: 'watchRent',
        deep: true,
        immediate: true,
      },
    },
  },
  methods: {
    submitSupply() {
      let Options = this.$store.state.Options;
      let { indexPrice, _expiry, _strikePrice, _underlying } = Options;
      // 私有化  不要
      // 标的物
      // 执行价格 行权价
      // 到期日
      // 结算token
      // 单价
      let Rent = this.getRent(indexPrice, _strikePrice, _expiry);
      const data = {
        private: false, // 
        annual: this.dpr,
        category: _underlying, // 
        currency: 'WBNB', // 
        expire: _expiry, // 
        premium: Rent,
        price: indexPrice,
        volume: this.volume, // 
        _yield: 0,
      }
      console.log(data)

      // const data = {
      // private: this.private,
      // annual: this.dpr,
      // category: this.col,
      // currency: this.und,
      // expire: this.dueDate,
      // premium: this.rent,
      // price: this.price,
      // volume: this.qty,
      // address: this.address,
      // _yield: 0,
      // };
      onIssue(data, (status) => {
        console.log('onIssue####status#####', status);
        if (status === 'pending') {
          console.log('onIssue####pending');
        } else if (status === 'approve') {
          console.log('onIssue####approve');
        } else if (status === 'success' || status === 'failed') {
          console.log('onIssue####success or failed###', status);
        }
      });
    },
    watchRent(newValue) {
    },
    getRent(indexPrice, _strikePrice, _expiry) {
      // 指数价格 执行价格 时间
      if (this.dpr && indexPrice && _strikePrice && _expiry) {
        let DPR = this.dpr / 100;
        let time1 = new Date(_expiry).getTime();
        let time2 = new Date().getTime();
        let day = parseInt((time1 - time2) / (1000 * 60 * 60 * 24)) + 1;
        let premium;
        if (this.tradeType == 1) {
          premium = precision.minus(
            precision.times(DPR, _strikePrice, day),
            precision.minus(indexPrice, _strikePrice)
          );
        } else {
          premium = precision.minus(
            precision.times(DPR, _strikePrice, day),
            precision.minus(_strikePrice, indexPrice)
          );
        }
        this.Rent = premium;
        console.log(precision.times(DPR, _strikePrice, day), Math.abs(precision.minus(indexPrice, _strikePrice)))
        return premium;
      }
    },
  },
};
</script>

<style lang='scss' scoped>
input:focus {
  border-color: #ff9600 !important;
}
@media screen and (min-width: 750px) {
  .insurance_form {
    > div {
      display: flex;
      .dpr {
        width: 320px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 30px 0 55px;
          color: #919aa6;
          text-align: right;
        }
        .left {
          position: absolute;
          left: 12px;
        }
        .right {
          position: absolute;
          right: 12px;
        }
      }
      .num {
        width: 320px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin: 0 20px 0 10px;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 60px 0 12px;
          color: #919aa6;
        }
        .right {
          color: #ff9600;
          cursor: pointer;
          position: absolute;
          right: 12px;
          &:hover {
            color: #ffa000;
          }
        }
      }
    }
    .pay {
      > p {
        margin: 8px 30px 4px 0;
        font-size: 14px;
        color: #919aa6;
        span {
          color: #121212;
        }
      }
    }

    > span {
      font-size: 14px;
      color: #ff9600;
      font-weight: 500;
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance_form {
    > div {
      display: flex;
      flex-direction: column;
      .dpr {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 30px 0 55px;
          color: #919aa6;
          text-align: right;
          &:focus {
            border: 1px solid #cfcfd2 !important;
          }
        }
        .left {
          position: absolute;
          left: 12px;
        }
        .right {
          position: absolute;
          right: 12px;
        }
      }
      .num {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin: 15px 0;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 60px 0 12px;
          color: #919aa6;
        }
        .right {
          color: #ff9600;
          cursor: pointer;
          position: absolute;
          right: 12px;
          &:hover {
            color: #ffa000;
          }
        }
      }
    }
    > p {
      margin: 8px 0 4px 0;
      font-size: 14px;
      color: #919aa6;
      span {
        color: #121212;
      }
    }
    > span {
      font-size: 14px;
      color: #ff9600;
      font-weight: 500;
    }
  }
}
</style>