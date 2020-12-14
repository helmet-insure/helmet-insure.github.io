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
      <!-- <p>
        折合：<span>{{ strikePrice * volume }} {{ unit }}</span>
      </p> -->
      <p>
        预期最大收益：<span>{{ earnings }} BNB</span>
      </p>
      <!-- <p>
        保费：<span>{{ Rent }} BNB</span>
      </p> -->
      <!-- <p>预期最大收益：<span>11111 BNB</span></p> -->
    </div>
    <span>
      如果在行权日之前，价格没有达到
      <i></i>
      ，您将获得无风险收益。
    </span>
  </div>
</template>

<script>
import { onIssueSell, onIssueSellOnETH } from '~/interface/order.js';
import precision from '~/assets/js/precision.js';
export default {
  props: ['currentCoin', 'currentType'],
  data() {
    return {
      dpr: 1, //DPR
      volume: '', //数量
      precision,
      Rent: 0,
      CoinType: 'HELMET',
      TradeType: 1,
      indexPx: 0.00333333,
      strikePrice: 0.00666666,
      unit: 'BNB',
      currency: 'WBNB',
      earnings: 0,
    };
  },
  computed: {
    undAndCol() {
      if (this.CoinType && this.TradeType) {
        return {
          underly: this.CoinType,
          curType: this.TradeType,
        };
      }
    },
    // 时间
    _expiry() {
      return this.$store.state.dueDate;
    },
    // 保费参数
    RentGrounp() {
      return {
        dpr: this.dpr,
        indexPx: this.indexPx,
        strikePrice: this.strikePrice,
        _expiry: new Date(this._expiry) * 1,
        num: this.volume,
      };
    },
    IndexPxArray() {
      return this.$store.state.allIndexPrice
    }
  },
  watch: {
    currentCoin(val) {
      this.CoinType = val;
    },
    currentType(val) {
      this.TradeType = val;
    },
    undAndCol: {
      handler: 'undAndColWatch',
      immediate: true,
    },
    RentGrounp: {
      handler: {
        handler: 'watchRent',
        immediate: true,
      },
    },
  },
  methods: {
    submitSupply() {
      // 私有化  不要
      // 标的物
      // 执行价格 行权价
      // 到期日
      // 结算token
      // 单价
      let data;
      if (this.TradeType == 2) {
        data = {
          private: false, // 
          annual: this.dpr,
          category: this.CoinType, // 
          currency: this.currency, // 
          expire: this._expiry, // 
          premium: this.Rent,
          price: this.strikePrice,
          volume: this.volume, // 
          settleToken: 'HELMET',
          _yield: 0,
        }
        onIssueSellOnETH(data, (status) => { })
      } else {
        data = {
          private: false, // 
          annual: this.dpr,
          category: this.currency, // 
          currency: this.CoinType, // 
          expire: this._expiry, // 
          premium: this.Rent,
          price: this.strikePrice,
          volume: this.volume, // 
          settleToken: 'HELMET',
          _yield: 0,
        }
        onIssueSell(data, (status) => { });
      }
    },
    watchRent(newValue) {
      let { dpr, indexPx, num, strikePrice, _expiry } = newValue
      if (newValue.dpr && newValue.num && newValue.indexPx && newValue.strikePrice && newValue._expiry) {
        let DPR = dpr / 100;
        let time1 = new Date(_expiry).getTime();
        let time2 = new Date().getTime();
        let day = parseInt((time1 - time2) / (1000 * 60 * 60 * 24)) + 1;
        let premium;
        let earnings;
        if (this.TradeType == 1) {
          premium = precision.minus(
            precision.times(DPR, num, day),
            Math.min(precision.minus(strikePrice, indexPx), 0)
          );
          earnings = - (Math.max(indexPx - strikePrice, 0) - premium)
        } else {
          premium = precision.minus(
            precision.times(DPR, (this.IndexPxArray[0]['HELMET'] * num), day),
            Math.min(precision.minus(indexPx, strikePrice), 0)
          );
          earnings = - (Math.max(strikePrice - indexPx, 0) - premium)
        }
        this.Rent = premium;
        this.earnings = earnings
        return premium;
      }
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
        px = list[1][coin]
        exPx = list[1][coin] * 2
        this.unit = coin
      } else {
        px = list[1][coin]
        exPx = list[1][coin] * 0.5
        this.unit = 'BNB'
      }
      this.indexPx = px
      this.strikePrice = exPx
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