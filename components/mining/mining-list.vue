<template>
  <div class="mining-list">
    <div
      class="mining-list-item"
      v-for="(item, index) in miningList"
      :key="index"
    >
      <h3>{{ item.title }}</h3>
      <p>
        {{ $t("Table.SurplusTime") }}：<span>{{ item.downTime }}</span>
      </p>
      <div>
        <div class="left">
          <p>{{ $t("Content.DoubleInsurance") }}<span>100%</span><i></i></p>
          <div>
            <div>
              <span>{{ $t("Table.Minted") }}</span>
              <p>HELMET</p>
              <strong>{{
                item.callMined.length > 60 ? 0 : item.callMined
              }}</strong>
              <button
                :class="
                  claimLoading && claimIndex == index && claimType == 'call'
                    ? 'loading o_button'
                    : 'o_button'
                "
                style="background: #ccc !important; pointer-events: none"
                @click="toClaim(item, index, 'call')"
              >
                <i
                  :class="
                    claimLoading && claimIndex == index && claimType == 'call'
                      ? 'loading_pic'
                      : ''
                  "
                ></i>
                {{ $t("Table.ClaimRewards") }}
              </button>
            </div>
            <section class="cut_line"></section>
            <div>
              <span>{{ $t("Table.CurrentlyStaked") }}</span>
              <p>{{ item.call.length > 60 ? 0 : item.call }} Short Token</p>
              <strong>{{
                item.callSpToken.length > 60 ? 0 : item.callSpToken
              }}</strong>
              <button
                :class="
                  exitLoading && exitIndex == index && exitType == 'call'
                    ? 'loading o_button'
                    : 'o_button'
                "
                style="background: #ccc !important; pointer-events: none"
                @click="toExit(item, index, 'call')"
              >
                <i
                  :class="
                    exitLoading && exitIndex == index && exitType == 'call'
                      ? 'loading_pic'
                      : ''
                  "
                ></i>
                {{ $t("Table.Claim") }}&{{ $t("Table.Unstake") }}
              </button>
              <button
                :class="
                  depositeLoading &&
                  depositeIndex == index &&
                  depositeType == 'call'
                    ? 'loading b_button'
                    : 'b_button'
                "
                style="background: #ccc !important; pointer-events: none"
                @click="toDeposite(item, index, 'call')"
              >
                <i
                  :class="
                    depositeLoading &&
                    depositeIndex == index &&
                    depositeType == 'call'
                      ? 'loading_pic'
                      : ''
                  "
                ></i>
                {{ $t("Table.Stake") }}
              </button>
            </div>
          </div>
        </div>
        <div class="right">
          <p>{{ $t("Content.HalfInsurance") }}<span>-50%</span><i></i></p>
          <div>
            <div>
              <span>{{ $t("Table.Minted") }}</span>
              <p>HELMET</p>
              <strong>{{
                item.putMined.length > 60 ? 0 : item.putMined
              }}</strong>
              <button
                class="o_button"
                :class="
                  claimLoading && claimIndex == index && claimType == 'put'
                    ? 'loading o_button'
                    : 'o_button'
                "
                style="background: #ccc !important; pointer-events: none"
                @click="toClaim(item, index, 'put')"
              >
                <i
                  :class="
                    claimLoading && claimIndex == index && claimType == 'put'
                      ? 'loading_pic'
                      : ''
                  "
                ></i>
                {{ $t("Table.ClaimRewards") }}
              </button>
            </div>
            <section class="cut_line"></section>
            <div>
              <span>{{ $t("Table.CurrentlyStaked") }}</span>
              <p>{{ item.put.length > 60 ? 0 : item.put }} Short Token</p>
              <strong>{{
                item.putSpToken.length > 60 ? 0 : item.putSpToken
              }}</strong>
              <button
                :class="
                  exitLoading && exitIndex == index && exitType == 'put'
                    ? 'loading o_button'
                    : 'o_button'
                "
                style="background: #ccc !important; pointer-events: none"
                @click="toExit(item, index, 'put')"
              >
                <i
                  :class="
                    exitLoading && exitIndex == index && exitType == 'put'
                      ? 'loading_pic'
                      : ''
                  "
                ></i>
                {{ $t("Table.Claim") }}&{{ $t("Table.Unstake") }}
              </button>
              <button
                :class="
                  depositeLoading &&
                  depositeIndex == index &&
                  depositeType == 'put'
                    ? 'loading b_button'
                    : 'b_button'
                "
                style="background: #ccc !important; pointer-events: none"
                @click="toDeposite(item, index, 'put')"
              >
                <i
                  :class="
                    depositeLoading &&
                    depositeIndex == index &&
                    depositeType == 'put'
                      ? 'loading_pic'
                      : ''
                  "
                ></i>
                {{ $t("Table.Stake") }}
              </button>
            </div>
          </div>
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
} from "~/interface/deposite";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
import { getAddress, getContract } from "~/assets/utils/address-pool.js";
import moment from "moment";
import Protect from "./protect";
export default {
  name: "mining-list",
  components: { Protect },
  data() {
    return {
      miningList: [
        {
          title: "HELMET-BNB Short Token POOL",
          call: "BNB-HELMET",
          put: "HELMET-BNB",
          callMined: 0,
          putMined: 0,
          callSpToken: 0,
          putSpToken: 0,
          dueDate: "2020-12-31 00:00",
          downTime: "",
        },
        {
          title: "CAKE-BNB Short Token POOL",
          call: "BNB-CAKE",
          put: "CAKE-BNB",
          callMined: 0,
          putMined: 0,
          callSpToken: 0,
          putSpToken: 0,
          dueDate: "2020-12-31 00:00",
          downTime: "",
        },
        {
          title: "CTK-BNB Short Token POOL",
          call: "BNB-CTK",
          put: "CTK-BNB",
          callMined: 0,
          putMined: 0,
          callSpToken: 0,
          putSpToken: 0,
          dueDate: "2020-12-31 00:00",
          downTime: "",
        },
        {
          title: "FOR-BNB Short Token POOL",
          call: "BNB-FOR",
          put: "FOR-BNB",
          callMined: 0,
          putMined: 0,
          callSpToken: 0,
          putSpToken: 0,
          dueDate: "2020-12-31 00:00",
          downTime: "",
        },
      ],
      moment: moment,
      claimLoading: false, //结算loading
      claimIndex: "", //结算ID
      claimType: "", //结算类型
      depositeLoading: false, //结质押loading
      depositeIndex: "", //抵押ID
      depositeType: "", //抵押类型
      exitLoading: false, //退出loading
      exitIndex: "", //退出ID
      exitType: "", //退出类型
      typeList: [
        "HELMET_BNB",
        "BNB_HELMET",
        "CAKE_BNB",
        "BNB_CAKE",
        "CTK_BNB",
        "BNB_CTK",
        "FOR_BNB",
        "BNB_FOR",
      ],
    };
  },
  watch: {
    miningList: {
      handler: "miningListWatch",
      immediate: true,
    },
  },
  mounted() {
    setInterval(() => {
      setTimeout(() => {
        this.getDownTime();
      });
      clearTimeout();
    }, 1000);
    this.getAllowance();
    setTimeout(() => {
      this.getAllData();
    }, 1000);
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
      this.getAllData();
      this.getAllowance();
    });
  },
  methods: {
    miningListWatch(newValue) {
      if (newValue) {
        this.miningList = newValue;
      }
    },
    getDownTime() {
      let now = new Date() * 1;
      let list = this.miningList;
      for (let i = 0; i < 4; i++) {
        let dueDate = list[i].dueDate;
        dueDate = new Date(dueDate);
        let DonwTime = dueDate - now;
        let day = Math.floor(DonwTime / (24 * 3600000));
        let hour = Math.floor((DonwTime - day * 24 * 3600000) / 3600000);
        let minute = Math.floor(
          (DonwTime - day * 24 * 3600000 - hour * 3600000) / 60000
        );
        let second = Math.floor(
          (DonwTime - day * 24 * 3600000 - hour * 3600000 - minute * 60000) /
            1000
        );
        let template = `${day}${this.$t("Content.Day")}${hour}${this.$t(
          "Content.Hour"
        )}${minute}${this.$t("Content.Min")}${second}${this.$t(
          "Content.Second"
        )}`;
        this.miningList[i].downTime = template;
      }
    },
    async getAllData() {
      for (let i = 0; i < 4; i++) {
        const charID = window.chainID;
        // call地址
        let callType = this.miningList[i].call.replace("-", "_");
        let callTypeLPT = callType + "_LPT";
        let callPoolAdress = getContract(callType, charID);
        let callLptAdress = getContract(callTypeLPT, charID);
        // put地址
        let putType = this.miningList[i].put.replace("-", "_");
        let putTypeLPT = putType + "_LPT";
        let putPoolAdress = getContract(putType, charID);
        let putLptAdress = getContract(putTypeLPT, charID);

        // 获取时间
        // let time = await getLastTime(type);
        // this.miningList[i].lastTime = time;
        // 获取待领取paya
        let callMined = await CangetPAYA(callType);
        let putMined = await CangetPAYA(putType);
        this.miningList[i].callMined = addCommom(callMined, 8);
        this.miningList[i].putMined = addCommom(putMined, 8);
        // 获取Lp-Tokens
        let callLpTokens = await getLPTOKEN(callType);
        let putLpTokens = await getLPTOKEN(putType);
        this.miningList[i].callSpToken = addCommom(callLpTokens, 8);
        this.miningList[i].putSpToken = addCommom(putLpTokens, 8);
        //获取当前池子的总量
        // let DOUBLEPOOL = await totalSupply(type);
        //获取当前LPT的总量
        // let ETH_COIN = await totalSupply(typeLPT);
        // this.miningList[i].lpt = addCommom(ETH_COIN, 2);
        // 计算当前保护的WETH
        // let WETHCOIN = await balanceOf('WETH', LptAdress);
        // this.miningList[i].protected = addCommom(
        //   (WETHCOIN * DOUBLEPOOL) / ETH_COIN,
        //   2
        // );
      }
    },
    // 结算Paya
    async toClaim(item, index, tradeType) {
      if (this.claimLoading) {
        return;
      }
      this.claimLoading = true;
      this.claimIndex = index;
      this.claimType = tradeType;
      let type;
      if (tradeType === "call") {
        type = item.call.replace("-", "_");
      } else {
        type = item.put.replace("-", "_");
      }
      let res = await getPAYA(type);
    },
    // 抵押
    toDeposite(item, index, tradeType) {
      if (this.depositeLoading) {
        return;
      }
      this.depositeIndex = index; //抵押ID
      this.depositeType = tradeType; //抵押类型
      let type;
      if (tradeType === "call") {
        type = item.call.replace("-", "_");
      } else {
        type = item.put.replace("-", "_");
      }
      this.$bus.$emit("OPEN_DEPOSITE", { current: type });
    },
    // 退出
    async toExit(item, index, tradeType) {
      if (this.exitLoading) {
        return;
      }
      this.exitLoading = true;
      this.exitIndex = index;
      this.exitType = tradeType;
      let type;
      if (tradeType === "call") {
        type = item.call.replace("-", "_");
      } else {
        type = item.put.replace("-", "_");
      }
      let res = await exitStake(type);
    },
    // 获取授权状态
    async getAllowance() {
      let approveList = {};
      for (let i = 0; i < 8; i++) {
        let type = this.typeList[i];
        let res = await approveStatus(type);
        let value = res.length > 30 ? true : false;
        const key = this.typeList[i];
        approveList[key] = value;
      }
      this.$store.commit("SET_APPROVE_LIST", approveList);
    },
  },
};
</script>

<style lang='scss' soped>
@import "~/assets/css/base.scss";
.loading_pic {
  display: block;
  width: 24px;
  height: 24px;
  background-image: url("../../assets/img/helmet/loading.png");
  background-repeat: no-repeat;
  background-size: cover;
  animation: loading 2s 0s linear infinite;
}
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-container {
  background: #f7f7fa;
}
@media screen and (min-width: 750px) {
  .cut_line {
    width: 1px;
    border-left: 1px dashed #cfcfd2;
    display: block;
    height: 100%;
  }
  .mining-list {
    margin-top: 20px;
    margin-bottom: 30px;
    width: 1200px;
    display: flex;
    flex-direction: column;
    .mining-list-item {
      background: #fff;
      width: 100%;
      display: flex;
      flex-direction: column;
      height: 444px;
      margin-bottom: 10px;
      padding: 40px;
      > h3 {
        text-align: center;
        font-weight: 600;
      }
      > p {
        text-align: center;
        margin: 15px 0 30px;
        font-size: 14px;
        color: #919aa6;
        span {
          color: #121212;
        }
      }
      > div {
        display: flex;
        height: 100%;
        justify-content: space-between;
        .left {
          background: rgba(0, 185, 0, 0.04);
          border-top: 2px solid #00b900;
          > p {
            color: #00b900;
            i {
              background-image: url("../../assets/img/helmet/call@2x.png");
            }
          }
        }
        .right {
          background: rgba(255, 100, 0, 0.04);
          border-top: 2px solid #ff6400;
          > p {
            color: #ff6400;
            i {
              background-image: url("../../assets/img/helmet/put@2x.png");
            }
          }
        }
        > div {
          width: 540px;
          display: flex;
          flex-direction: column;
          > p {
            display: flex;
            justify-content: center;
            height: 30px;
            text-align: center;
            margin-top: 18px;
            font-size: 14px;
            align-items: center;
            span {
              font-size: 16px;
              font-weight: bold;
              line-height: 22px;
              margin: 0 4px 0 4px;
            }
            i {
              display: inline-block;
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-size: cover;
              transform: translateY(2px);
            }
          }
          > div {
            flex: 1;
            padding: 20px 0 30px;
            display: flex;
            justify-content: space-between;
            > div {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              span {
                font-size: 18px;
                font-weight: 500;
              }
              p {
                color: #919aa6;
                font-size: 12px;
                margin: 20px 0 8px;
              }
              button {
                min-width: 134px;
                margin-top: 20px;
              }
              .b_button {
                min-width: 134px;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .cut_line {
    width: 1px;
    border-left: 1px dashed #cfcfd2;
    display: block;
    height: 190px;
  }
  .mining-list {
    margin-top: 20px;
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    .mining-list-item {
      background: #fff;
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      padding: 30px 16px;
      > h3 {
        text-align: center;
        font-weight: 600;
      }
      > p {
        text-align: center;
        margin: 15px 0 30px;
        font-size: 14px;
        color: #919aa6;
        span {
          color: #121212;
        }
      }
      > div {
        height: 100%;
        .left {
          background: rgba(0, 185, 0, 0.04);
          border-top: 2px solid #00b900;
          > p {
            color: #00b900;
            i {
              background-image: url("../../assets/img/helmet/call@2x.png");
            }
          }
        }
        .right {
          background: rgba(255, 100, 0, 0.04);
          border-top: 2px solid #ff6400;
          > p {
            color: #ff6400;
            i {
              background-image: url("../../assets/img/helmet/put@2x.png");
            }
          }
        }
        > div {
          display: flex;
          flex-direction: column;
          > p {
            display: flex;
            justify-content: center;
            height: 30px;
            text-align: center;
            margin-top: 18px;
            font-size: 14px;
            span {
              font-size: 16px;
              font-weight: bold;
              line-height: 22px;
              margin: 0 4px 0 4px;
            }
            i {
              display: inline-block;
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-size: cover;
              transform: translateY(2px);
            }
          }
          > div {
            flex: 1;
            display: flex;
            padding: 20px 0 30px;
            > div {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              span {
                font-size: 18px;
                font-weight: 500;
              }
              p {
                color: #919aa6;
                font-size: 12px;
                margin: 20px 0 8px;
              }
              button {
                min-width: 100px;
                margin-top: 20px;
              }
              .b_button {
                width: 134px;
              }
            }
          }
        }
      }
    }
  }
}
</style>