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
        <i>{{ unit == "FORTUBE" ? "FOR" : unit }}</i>
        <span class="right" @click="toAll">{{ $t("Table.ALL") }}</span>
      </div>
      <button class="b_b_button" @click="submitSupply">
        {{ $t("Content.Supply") }}
      </button>
    </div>
    <div class="pay">
      <!-- <p>
        折合：<span>{{ strikePrice * volume }} {{ unit }}</span>
      </p> -->
      <p>
        {{ $t("Content.Earning") }}：
        <span>
          {{ Rent }}
          HELMET
        </span>
      </p>
      <!-- <p>
        保费：<span>{{ Rent }} BNB</span>
      </p> -->
      <!-- <p>预期最大收益：<span>11111 BNB</span></p> -->
    </div>
    <!-- <span>
      如果在行权日之前，价格没有达到
      <i></i>
      ，您将获得无风险收益。
    </span> -->
  </div>
</template>

<script>
import { onIssueSell, onIssueSellOnETH } from "~/interface/order.js";
import precision from "~/assets/js/precision.js";
import {
  fixD,
  addCommom,
  autoRounding,
  toRounding,
  fixInput,
} from "~/assets/js/util.js";
export default {
  props: ["currentCoin", "currentType"],
  data() {
    return {
      dpr: 0.14, //DPR
      volume: "", //数量
      precision,
      Rent: 0,
      indexPx: 0.0033,
      strikePrice: 0.0067,
      unit: "BNB",
      currency: "WBNB",
      earnings: 0,
      fixD,
      addCommom,
      autoRounding,
      toRounding,
    };
  },
  computed: {
    undAndCol() {
      if (this.currentCoin && this.currentType) {
        return {
          underly: this.currentCoin,
          curType: this.currentType,
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
      return this.$store.state.allIndexPrice;
    },
    HelmetPrice() {
      return this.$store.state.allHelmetPrice;
    },
    BalanceArray() {
      return this.$store.state.BalanceArray;
    },
  },
  watch: {
    dpr(newValue, val) {
      this.dpr = fixInput(newValue, 1);
      if (newValue > 10) {
        this.dpr = 10;
      }
    },
    volume(newValue, val) {
      this.volume = fixInput(newValue, 4);
    },
    currentCoin(val) {
      this.currentCoin = val;
    },
    currentType(val) {
      this.currentType = val;
    },
    undAndCol: {
      handler: "undAndColWatch",
      immediate: true,
    },
    RentGrounp: {
      handler: {
        handler: "watchRent",
        immediate: true,
      },
    },
  },
  methods: {
    toAll() {
      if (this.BalanceArray) {
        this.volume = this.BalanceArray[this.currentCoin];
      }
    },
    submitSupply() {
      // 私有化  不要
      // 标的物
      // 执行价格 行权价
      // 到期日
      // 结算token
      // 单价
      let data;
      if (this.currentType == 2) {
        data = {
          private: false, //
          annual: this.dpr,
          category: this.currentCoin, //
          currency: this.currency, //
          expire: this._expiry, //
          premium: this.Rent,
          price: this.strikePrice,
          volume: this.volume, //
          settleToken: "HELMET",
          _yield: 0,
        };
        onIssueSellOnETH(data, (status) => {});
      } else {
        data = {
          private: false, //
          annual: this.dpr,
          category: this.currency, //
          currency: this.currentCoin, //
          expire: this._expiry, //
          premium: this.Rent,
          price: this.strikePrice,
          volume: this.volume, //
          settleToken: "HELMET",
          _yield: 0,
        };
        onIssueSell(data, (status) => {});
      }
    },
    watchRent(newValue) {
      if (!newValue.dpr || !newValue.num) {
        this.Rent = 0;
        return;
      }
      let { dpr, indexPx, num, strikePrice, _expiry } = newValue;
      if (
        newValue.dpr &&
        newValue.num &&
        newValue.indexPx &&
        newValue.strikePrice &&
        newValue._expiry
      ) {
        let DPR = dpr / 100;
        let time1 = new Date(_expiry).getTime();
        let time2 = new Date().getTime();
        let day = parseInt((time1 - time2) / (1000 * 60 * 60 * 24)) + 1;
        let premium;
        let earnings;
        let number;
        if (this.currentType == 1) {
          if (this.currentCoin == "HELMET") {
            number = precision.times(DPR, num, day);
          } else {
            number = precision.times(
              DPR,
              this.HelmetPrice[1][this.currentCoin] * num,
              day
            );
          }
          premium = precision.minus(
            number,
            Math.min(precision.minus(strikePrice, indexPx), 0)
          );

          earnings = -(Math.max(indexPx - strikePrice, 0) - premium);
        } else {
          number = precision.times(
            DPR,
            this.IndexPxArray[0]["HELMET"] * num,
            day
          );
          premium = precision.minus(
            number,
            Math.min(precision.minus(indexPx, strikePrice), 0)
          );

          earnings = -(Math.max(strikePrice - indexPx, 0) - premium);
        }
        this.Rent = toRounding(premium, 8);
        this.earnings = toRounding(earnings, 8);
        return toRounding(premium, 8);
      } else {
        return 0;
      }
    },
    undAndColWatch(newValue) {
      let list = this.IndexPxArray;
      let coin = newValue.underly;
      let type = newValue.curType;
      let px;
      let exPx;
      if (!list.length) {
        return;
      }
      if (type == 1) {
        px = list[1][coin];
        exPx = list[1][coin] * 2;
        this.unit = coin;
      } else {
        px = list[1][coin];
        exPx = list[1][coin] * 0.5;
        this.unit = "BNB";
      }
      this.indexPx = px;
      this.strikePrice = exPx;
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
          color: #121212;
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
          color: #121212;
        }
        i {
          position: absolute;
          right: 50px;
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
        i {
          position: absolute;
          right: 50px;
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