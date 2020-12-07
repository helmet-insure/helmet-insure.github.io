<template>
  <div class="mining-list">
    <div
      class="mining-list-item"
      v-for="(item, index) in miningList"
      :key="index"
    >
      <h3>{{ item.title }}</h3>
      <p>距离挖矿结束还剩：<span>10:14:34:12</span></p>
      <div>
        <div class="left">
          <p>翻倍险<span>100%</span><i></i></p>
          <div>
            <div>
              <span>Minted</span>
              <p>HELMET</p>
              <strong>{{ item.callMined }}</strong>
              <button class="o_button" @click="toClaim(item, index)">
                Claim Rewards
              </button>
            </div>
            <section class="cut_line"></section>
            <div>
              <span>Currently Staked</span>
              <p>BNB-QUSD Short Token</p>
              <strong>0</strong>
              <button class="o_button">Claim&Unstake</button>
              <button class="b_button" @click="toDeposite(item, index)">
                Stake
              </button>
            </div>
          </div>
        </div>
        <div class="right">
          <p>腰斩险<span>-50%</span><i></i></p>
          <div>
            <div>
              <span>Minted</span>
              <p>HELMET</p>
              <strong>{{ item.putMined }}</strong>
              <button class="o_button" @click="toClaim(item, index)">
                Claim Rewards
              </button>
            </div>
            <section class="cut_line"></section>
            <div>
              <span>Currently Staked</span>
              <p>BNB-QUSD Short Token</p>
              <strong>0</strong>
              <button class="o_button">Claim&Unstake</button>
              <button class="b_button" @click="toDeposite(item, index)">
                Stake
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
} from '~/interface/deposite';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import { getAddress, getContract } from '~/assets/utils/address-pool.js';
import moment from 'moment';
import Protect from './protect';
export default {
  name: 'mining-list',
  components: { Protect },
  data() {
    return {
      miningList: [
        {
          title: 'QUSD-BNB Short Token POOL',
          name: 'BNB-QUSD',
          callMined: 0,
          putMined: 0,
          lpt: 'noData',
          protected: 'noData',
          lptoken: 'noData',
          paya: 'noData',
          lastTime: 'noData',
        },
        {
          title: 'CAKE-BNB Short Token POOL',
          name: 'CAKE-BNB',
          callMined: 0,
          putMined: 0,
          lpt: 'noData',
          protected: 'noData',
          lptoken: 'noData',
          paya: 'noData',
          lastTime: 'noData',
        },
        {
          title: 'FOR-BNB Short Token POOL',
          name: 'FOR-BNB',
          callMined: 0,
          putMined: 0,
          lpt: 'noData',
          protected: 'noData',
          lptoken: 'noData',
          paya: 'noData',
          lastTime: 'noData',
        },
      ],
      moment: moment,
      claimloading: false, //结算loading
      unclaimloading: false, //推出loading
      depositeLoading: false, //结质押loading
      withdrawLoading: false, //赎回loading
      current: '', //当前结算LPT币种
      exitCoin: '', //当前退出LPT币种
      curStake: '', //当前质押LPT币种
      curUnStake: '', //当前赎回LPT币种
      claimIndex: '', //当前结算key
      exitIndex: '', //当前退出key
      StakeIndex: '', //当前质押key
      unStakeIndex: '', //当前赎回key
    };
  },
  watch: {
    miningList: {
      handler: 'miningListWatch',
      immediate: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.getAllData();
      this.getAllowance();
    }, 1000);
    this.$bus.$on('DEPOSITE_LOADING', (data) => {
      let current = this.curStake.replace('-', '_');
      if (data.type == current && data.status) {
        this.depositeLoading = true;
      } else {
        this.depositeLoading = false;
        this.StakeIndex = '';
      }
    });
    this.$bus.$on('WITHDRAW_LOADING', (data) => {
      let current = this.curUnStake.replace('-', '_');
      if (data.type == current && data.status) {
        this.withdrawLoading = true;
      } else {
        this.withdrawLoading = false;
        this.unStakeIndex = '';
      }
    });
    this.$bus.$on('CLAIM_LOADING', (data) => {
      this.claimloading = false;
    });
    this.$bus.$on('EXIT_LOADING', (data) => {
      this.unclaimloading = false;
    });
    this.$bus.$on('REFRESH_MINING', (data) => {
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
    async getAllData() {
      for (let i = 0; i < 3; i++) {
        const charID = window.chainID;
        let type = this.miningList[i].name.replace('-', '_');
        let typeLPT = type + '_LPT';
        let PoolAdress = getContract(type, charID);
        let LptAdress = getContract(typeLPT, charID);
        if (PoolAdress && LptAdress) {
          // 获取时间
          let time = await getLastTime(type);
          this.miningList[i].lastTime = time;
          // 获取待领取paya
          let paya = await CangetPAYA(type);
          this.miningList[i].paya = addCommom(paya, 8);
          // 获取Lp-Tokens
          let lpTokens = await getLPTOKEN(type);
          this.miningList[i].lptoken = addCommom(lpTokens, 8);
          //获取当前池子的总量
          let DOUBLEPOOL = await totalSupply(type);
          //获取当前LPT的总量
          let ETH_COIN = await totalSupply(typeLPT);
          this.miningList[i].lpt = addCommom(ETH_COIN, 2);
          // 计算当前保护的WETH
          let WETHCOIN = await balanceOf('WETH', LptAdress);
          this.miningList[i].protected = addCommom(
            (WETHCOIN * DOUBLEPOOL) / ETH_COIN,
            2
          );
        } else {
          this.miningList[i].paya = 0;
          this.miningList[i].lptoken = 0;
          this.miningList[i].lpt = 0;
          this.miningList[i].protected = 0;
          this.miningList[i].lastTime = 0;
        }
      }
    },
    // 结算Paya
    async toClaim(item, index) {
      this.claimloading = true;
      this.claimIndex = index;
      this.current = item.name;
      let type = item.name.replace('-', '_');
      let res = await getPAYA(type);
    },
    // 抵押
    toDeposite(item, index) {
      this.curStake = item.name;
      this.StakeIndex = index;
      this.$bus.$emit('OPEN_DEPOSITE', { current: item.name });
    },
    // 赎回
    toWithdraw(item, index) {
      this.curUnStake = item.name;
      this.unStakeIndex = index;
      this.$bus.$emit('OPEN_WITHDRAW', { current: item.name });
    },
    // 退出
    async toExit(item, index) {
      this.unclaimloading = true;
      this.exitIndex = index;
      this.exitCoin = item.name;
      let type = item.name.replace('-', '_');
      let res = await exitStake(type);
    },
    // 获取授权状态
    async getAllowance() {
      let approveList = {};
      for (let i = 0; i < 3; i++) {
        let type = this.miningList[i].name.replace('-', '_');
        let res = await approveStatus(type);
        let value = res.length > 30 ? true : false;
        const key = this.miningList[i].name;
        approveList[key] = value;
      }
      this.$store.commit('SET_APPROVE_LIST', approveList);
    },
  },
};
</script>

<style lang='scss' soped>
@import '~/assets/css/base.scss';
.loading {
  pointer-events: none;
  img {
    width: 24px;
    height: 24px;
    margin-right: 4px;
  }
}
.dataloading {
  width: 24px !important;
  height: 24px !important;
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
              background-image: url('../../assets/img/helmet/call@2x.png');
            }
          }
        }
        .right {
          background: rgba(255, 100, 0, 0.04);
          border-top: 2px solid #ff6400;
          > p {
            color: #ff6400;
            i {
              background-image: url('../../assets/img/helmet/put@2x.png');
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
              background-image: url('../../assets/img/helmet/call@2x.png');
            }
          }
        }
        .right {
          background: rgba(255, 100, 0, 0.04);
          border-top: 2px solid #ff6400;
          > p {
            color: #ff6400;
            i {
              background-image: url('../../assets/img/helmet/put@2x.png');
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