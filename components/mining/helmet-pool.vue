<template>
  <div class="helmet_pool">
    <h3>{{ list.name }}</h3>
    <div class="coin">
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-Helmet"></use>
        </svg>
        50%
        <span> HELMET </span>
      </p>
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-BNB"></use>
        </svg>
        50%
        <span> BNB </span>
      </p>
    </div>
    <div class="text">
      <p v-for="(item, index) in textList" :key="index">
        <span>{{ item.text }}</span>
        <span :style="`color:${item.color}`"
          >{{ item.num
          }}<i v-if="item.unit" style="color: #919aa6">{{ item.unit }}</i>
        </span>
      </p>
    </div>
    <div class="pool">
      <div class="deposit">
        <div class="title">
          <span>{{ $t("Table.Deposit") }}</span>
          <p>
            {{ balance.Deposite.length > 60 ? 0 : balance.Deposite }} LPT
            {{ $t("Table.Available") }}
          </p>
        </div>
        <div class="content">
          <label for="deposit">{{ $t("Table.AmountDeposit") }}</label>
          <div class="input">
            <input name="deposit" type="text" v-model="DepositeNum" />
            <span @click="DepositeNum = balance.Deposite">{{
              $t("Table.Max")
            }}</span>
          </div>
        </div>
        <div class="button">
          <button
            @click="toDeposite"
            :class="stakeLoading ? 'disable b_button' : 'b_button'"
          >
            <i :class="stakeLoading ? 'loading_pic' : ''"></i
            >{{ $t("Table.ConfirmDeposit") }}
          </button>
          <p>
            <span
              >{{ $t("Table.MyDeposits") }}/{{
                $t("Table.TotalDeposited")
              }}：</span
            >
            <span> {{ balance.Deposite }} LPT/{{ balance.TotalLPT }} LPT</span>
          </p>
          <p>
            <span>My Pool Share：</span>
            <span> {{ balance.Share }} %</span>
          </p>
        </div>
      </div>
      <div class="withdraw">
        <div class="title">
          <span>{{ $t("Table.Withdraw") }}</span>
          <p>{{ balance.Withdraw }} LPT {{ $t("Table.Available") }}</p>
        </div>
        <div class="content">
          <label for="withdraw">{{ $t("Table.AmountWithdraw") }}</label>
          <div class="input">
            <input name="withdraw" type="text" v-model="WithdrawNum" />
            <span @click="WithdrawNum = balance.Withdraw">{{
              $t("Table.Max")
            }}</span>
          </div>
        </div>
        <div class="button">
          <button
            @click="toExit"
            :class="exitLoading ? 'disable b_button' : 'b_button'"
          >
            <i :class="exitLoading ? 'loading_pic' : ''"></i
            >{{ $t("Table.ConfirmWithdraw") }} &
            {{ $t("Table.ClaimRewards") }}
          </button>
          <p>
            <span>{{ $t("Table.HELMETRewards") }}：</span>
            <span>
              {{ balance.Helmet.length > 60 ? 0 : balance.Helmet }} HELMET</span
            >
          </p>
          <button
            @click="toClaim"
            :class="claimLoading ? 'disable o_button' : 'o_button'"
          >
            <i :class="claimLoading ? 'loading_pic' : ''"></i
            >{{ $t("Table.ClaimAllRewards") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  totalSupply,
  balanceOf,
  getLPTOKEN,
  CangetPAYA,
  getPAYA,
  exitStake,
  getLastTime,
  approveStatus,
  getBalance,
  toDeposite,
  getMined,
  WithdrawAvailable,
} from "~/interface/deposite";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
export default {
  data() {
    return {
      list: {
        name: "HELMET-BNB",
      },
      textList: [
        {
          text: this.$t("Table.RewardsDistribution"),
          num: 0,
          color: "#00B900",
          unit: "（weekly）",
        },
        {
          text: this.$t("Table.PoolAPY"),
          num: 0,
          color: "#00B900",
          unit: "",
        },
        //  {
        //   text: this.$t('Table.TotalDeposited'),
        //   num: 0,
        //   color: '#121212',
        //   unit: ''
        // },
        //  {
        //   text: this.$t('Table.MyDeposits'),
        //   num: 0,
        //   color: '#121212',
        //   unit: ''
        // },
        // {
        //   text: this.$t('Table.MyRewards'),
        //   num: 0,
        //   color: '#00B900',
        //   unit: ''
        // }
      ],
      balance: {
        Deposite: 0,
        Withdraw: 0,
        Helmet: 0,
        TotalLPT: 0,
        Share: 0,
      },
      DepositeNum: "",
      WithdrawNum: "",
      stakeLoading: false,
      claimLoading: false,
      exitLoading: false,
    };
  },
  mounted() {
    this.$bus.$on("DEPOSITE_LOADING", (data) => {
      this.depositeLoading = data.status;
    });
    this.$bus.$on("CLAIM_LOADING", (data) => {
      this.claimLoading = false;
    });
    this.$bus.$on("EXIT_LOADING", (data) => {
      this.exitLoading = false;
    });
    this.$bus.$on("REFRESH_MINING", (data) => {
      this.getBalance();
    });
    setTimeout(() => {
      this.getBalance();
    }, 1000);
  },
  watch: {},
  computed: {},
  methods: {
    async getBalance() {
      let lpttype = "HELMETBNB_LPT";
      let type = "HELMETBNB";
      // 可抵押数量
      let Deposite = await getBalance(lpttype);
      // 可赎回数量
      let Withdraw = await getLPTOKEN(type);
      // 总抵押
      let TotalLPT = await totalSupply(type);
      // 可领取
      let Helmet = await CangetPAYA(type);

      this.balance.Deposite = addCommom(Deposite, 4);
      this.balance.Withdraw = addCommom(Withdraw, 4);
      this.balance.Helmet = addCommom(Helmet, 4);
      this.balance.TotalLPT = addCommom(TotalLPT, 4);
      this.balance.Share = toRounding(Deposite / TotalLPT, 1) * 100;
      // this.textList[2].num = addCommom(TotalLPT, 4)
      // this.textList[3].num = addCommom(Deposite, 4)
      // this.textList[4].num = addCommom(Helmet, 4)
    },
    // 抵押
    toDeposite() {
      if (!this.DepositeNum) {
        return;
      }
      if (this.stakeLoading) {
        return;
      }
      this.stakeLoading = true;
      let type = "HELMETBNB";
      toDeposite(type, { amount: this.DepositeNum }, true, (status) => {});
    },
    // 结算Paya
    async toClaim() {
      if (this.claimLoading) {
        return;
      }
      this.claimLoading = true;
      let type = "HELMETBNB";
      let res = await getPAYA(type);
    },
    // 退出
    async toExit() {
      if (this.exitLoading) {
        return;
      }
      this.exitLoading = true;
      let type = "HELMETBNB";
      let res = await exitStake(type);
    },
  },
};
</script>

<style lang='scss' scoped>
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #787878;
  overflow: hidden;
}
.b_button {
  width: 100%;
  margin-top: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.o_button {
  width: 100%;
  margin-top: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading_pic {
  display: block;
  width: 24px;
  height: 24px;
  background-image: url("../../assets/img/helmet/loading.png");
  background-repeat: no-repeat;
  background-size: cover;
  animation: loading 2s 0s linear infinite;
}
.disable {
  pointer-events: none;
}
@media screen and (min-width: 750px) {
  .helmet_pool {
    height: 536px;
    background: #ffffff;
    padding: 40px;
    > h3 {
      text-align: center;
    }
    .coin {
      margin-top: 12px;
      justify-content: center;
      display: flex;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        color: #121212;
        font-size: 14px;
        margin: 0 10px;
        .icon {
          margin-right: 4px;
        }
        span {
          margin-left: 4px;
          color: #919aa6;
        }
      }
    }
    .text {
      display: flex;
      padding: 0 140px;
      justify-content: flex-end;
      margin-top: 28px;
      p {
        display: flex;
        flex-direction: column;
        margin-left: 100px;
        span {
          &:nth-of-type(1) {
            font-size: 14px;
            color: #919aa6;
          }
          &:nth-of-type(2) {
            margin-top: 12px;
          }
        }
      }
    }
    .pool {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      > div {
        width: 540px;
        height: 293px;
        padding: 30px 40px;
        .title {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
          line-height: 16px;
          p {
            color: #919aa6;
            font-size: 14px;
            line-height: 16px;
          }
        }
        .content {
          margin-top: 20px;
          label {
            font-size: 14px;
            color: #919aa6;
            line-height: 20px;
          }
          input {
            width: 100%;
            height: 40px;
            border: 1px solid #cfcfd2;
            background: transparent;
            padding: 0 100px 0 12px;
            color: #121212;
          }
          .input {
            margin-top: 4px;
            position: relative;
            display: flex;
            align-items: center;
            span {
              position: absolute;
              right: 15px;
              font-size: 14px;
              color: #121212;
              cursor: pointer;
            }
          }
        }
        .button {
          p {
            margin-top: 11px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              font-size: 14px;
              color: #121212;
              &:first-of-type {
                font-size: 14px;
                color: #919aa6;
              }
            }
          }
        }
      }
      .deposit {
        border-top: 2px solid #00b900;
        background: rgba(0, 185, 0, 0.04);
        .title {
          > span {
            color: #00b900;
          }
        }
      }
      .withdraw {
        border-top: 2px solid #ff6400;
        background: rgba(255, 100, 0, 0.04);
        .title {
          > span {
            color: #ff6400;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .helmet_pool {
    background: #ffffff;
    padding: 40px 16px;
    > h3 {
      text-align: center;
    }
    .coin {
      margin-top: 12px;
      justify-content: center;
      display: flex;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        color: #121212;
        font-size: 14px;
        margin: 0 10px;
        .icon {
          margin-right: 4px;
        }
        span {
          margin-left: 4px;
          color: #919aa6;
        }
      }
    }
    .text {
      display: flex;
      padding: 0 140px;
      justify-content: flex-end;
      margin-top: 28px;
      p {
        display: flex;
        flex-direction: column;
        margin-left: 100px;
        span {
          &:nth-of-type(1) {
            font-size: 14px;
            color: #919aa6;
          }
          &:nth-of-type(2) {
            margin-top: 12px;
          }
        }
      }
    }
    .pool {
      display: flex;
      // justify-content: space-between;
      flex-direction: column;
      margin-top: 30px;
      > div {
        height: 293px;
        padding: 30px 16px;
        .title {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
          line-height: 16px;
          p {
            color: #919aa6;
            font-size: 14px;
            line-height: 16px;
          }
        }
        .content {
          margin-top: 20px;
          label {
            font-size: 14px;
            color: #919aa6;
            line-height: 20px;
          }
          input {
            width: 100%;
            height: 40px;
            border: 1px solid #cfcfd2;
            background: transparent;
            padding: 0 100px 0 12px;
            color: #121212;
          }
          .input {
            margin-top: 4px;
            position: relative;
            display: flex;
            align-items: center;
            span {
              position: absolute;
              right: 15px;
              font-size: 14px;
              color: #121212;
              cursor: pointer;
            }
          }
        }
        .button {
          p {
            margin-top: 11px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
              font-size: 14px;
              color: #121212;
              &:first-of-type {
                font-size: 14px;
                color: #919aa6;
              }
            }
          }
        }
      }
      .deposit {
        border-top: 2px solid #00b900;
        background: rgba(0, 185, 0, 0.04);
        .title {
          > span {
            color: #00b900;
          }
        }
      }
      .withdraw {
        border-top: 2px solid #ff6400;
        background: rgba(255, 100, 0, 0.04);
        .title {
          > span {
            color: #ff6400;
          }
        }
      }
    }
  }
}
</style>