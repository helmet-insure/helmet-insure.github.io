<template>
  <div class="token-wrap">
    <div class="wrap-title">
      <span>{{ current }} Mining Pool</span>
      <p>
        Deposite {{ current }} LP Token to mint PAYA
        <!-- <a>Read more about PAYA mining</a> -->
      </p>
    </div>
    <Protect :styleClass="'mining-token'" :current="current"
      >{{ dataList.protected }} ETH be protected</Protect
    >
    <div class="wrap-text">
      <p>
        <span>{{ current }} LP tokens Total Value Locked</span
        ><span>{{ dataList.lpt }}</span>
      </p>
      <!-- <p>
        <span>{{ current }} Long tokens Total Value Locked</span
        ><span>23,100,000</span>
      </p> -->
      <!-- <p>
        <Tooltip
          name="APY"
          width="300px"
          hint="This is the cost of the insurance claim that the policyholder receives for each bond pledged after the execution of the release operation. "
        ></Tooltip
        ><span>230.16%</span>
      </p> -->
      <p><span>APY</span><span>「NG」</span></p>
    </div>
    <div class="wrap-list">
      <div class="wrap-list-item">
        <span>Minted</span>
        <p>
          <span>PAYA Minted</span><span>{{ addCommom(myPaya, 4) }}</span>
        </p>
        <a @click="toDeposite" :class="loading ? 'loading' : ''">
          <img src="~/assets/img/loading.gif" v-if="depositeLoading" /> Deposite
          {{ current }} LP tokens</a
        >
        <a @click="toClaim" :class="loading ? 'claim loading' : 'claim'"
          ><img src="~/assets/img/loading.gif" v-if="loading" />Claim</a
        >
      </div>
      <div class="wrap-list-item">
        <span>Currently Staked</span>
        <p>
          <span>{{ current }} LP tokens</span><span>{{ tokens }}</span>
        </p>
        <a @click="toWithdraw" :class="loading ? 'loading' : ''"
          ><img src="~/assets/img/loading.gif" v-if="withdrawLoading" />Withdraw
          {{ current }} LP tokens</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getLPTOKEN, getMined } from '~/interface/deposite';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import Protect from './protect.vue';
import { getPAYA } from '~/interface/deposite.js';
import Tooltip from '~/components/common/tooltip.vue';
import { totalSupply, balanceOf, getBalance } from '~/interface/deposite';
import { getAddress, getContract } from '~/assets/utils/address-pool.js';
export default {
  props: ['current'],
  components: { Protect, Tooltip },
  data() {
    return {
      dataList: { lpt: 0, protected: 0 },
      fixD: fixD,
      addCommom: addCommom,
      tokens: 0, // LPT余额
      loading: false,
      depositeLoading: false,
      withdrawLoading: false,
    };
  },
  mounted() {
    this.$bus.$on('CLOSE_LOADING', () => {
      this.loading = false;
    });
    if (this.current) {
      window.localStorage.setItem('current', this.current);
    }
    setTimeout(() => {
      this.getLP_TOKEN();
      this.showMyPaya();
      this.getAllData();
    }, 1000);
    this.$bus.$on('REFRESH_DATA', () => {
      this.showMyPaya();
    });
    this.$bus.$on('DEPOSITE_LOADING', (data) => {
      let current = this.current.split('-').join('_');
      if (data.type === current && data.status) {
        this.depositeLoading = true;
      } else {
        this.depositeLoading = false;
      }
    });
    this.$bus.$on('WITHDRAW_LOADING', (data) => {
      let current = this.current.split('-').join('_');
      if (data.type === current && data.status) {
        this.withdrawLoading = true;
      } else {
        this.withdrawLoading = false;
      }
    });
  },
  watch: {
    current: {
      handler: 'currentWatch',
      immediate: true,
    },
    dataList: {
      handler: 'dataListWatch',
      immediate: true,
    },
  },
  computed: {
    payaSettle() {
      return this.$store.state.assets.payaSettle;
    },
    myPaya() {
      return this.$store.state.myPAYA;
    },
  },
  methods: {
    showMyPaya() {
      let coin = this.current.replace('-', '_');
      this.$store.dispatch('getmyPAYA', coin);
    },
    async getLP_TOKEN() {
      let type = this.current.replace('-', '_');
      let res = await getLPTOKEN(type);
      this.tokens = addCommom(res, 8);
    },
    // 获取余额
    getBalance() {
      let coin = this.current.replace('-', '_') + '_LPT';
      getBalance(coin).then((res) => {
        this.lptBalance = fixD(res, 4);
      });
    },
    currentWatch(newValue) {
      if (newValue) {
        this.getBalance(newValue);
      }
    },
    dataListWatch(newValue) {
      if (newValue) {
        this.dataList = newValue;
      }
    },
    async toClaim() {
      this.loading = true;
      let type = this.current.replace('-', '_');
      let res = await getPAYA(type);
    },
    async getAllData() {
      let current = window.localStorage.getItem('current') || this.current;
      let type = current.replace('-', '_');
      let typeLPT = type + '_LPT';
      let DOUBLEPOOL = await totalSupply(type);
      let ETH_COIN = await totalSupply(typeLPT);
      this.dataList.lpt = addCommom(ETH_COIN, 2);
      // ETH_DAI_LPT 包含的WETH
      const charID = window.chainID;
      let Adress = getContract(typeLPT, charID);
      let WETHCOIN = await balanceOf('WETH', Adress);
      this.dataList.protected = addCommom(
        (WETHCOIN * DOUBLEPOOL) / ETH_COIN,
        2
      );
    },
    toDeposite() {
      this.$bus.$emit('OPEN_DEPOSITE', (data) => {
        this.showDeposite = true;
      });
    },
    toWithdraw() {
      this.$bus.$emit('OPEN_WITHDRAW', (data) => {
        this.showWithdraw = true;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .claim {
    margin-top: 10px !important;
    width: 273px;
    align-items: center;
    display: flex;
    justify-content: center;
    img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
  .loading {
    pointer-events: none;
  }
  .token-wrap {
    width: 1200px;
    background: $bg-f;
    border-radius: 3px;
    padding: 40px 220px 0;
    height: 763px;
    .wrap-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        font-size: 30px;
        color: $bg-w;
        margin-top: 18px;
      }
      p {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: $text-g;
        a {
          color: #be3a3b;
        }
      }
    }
    .wrap-text {
      display: flex;
      margin-top: 30px;
      p {
        flex: 1;
        display: flex;
        flex-direction: column;
        span {
          font-size: 18px;
          font-weight: bold;
          color: $text-t;
        }
        &:nth-of-type(1) {
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
            font-weight: normal;
            margin-bottom: 12px;
          }
        }
        &:nth-of-type(2) {
          text-align: right;
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
            font-weight: normal;
            margin-bottom: 12px;
          }
        }
        &:nth-of-type(3) {
          text-align: center;
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
            font-weight: normal;
            margin-bottom: 12px;
          }
        }
        &:nth-of-type(3) {
          align-items: flex-end;
          .tooltip {
            font-size: 14px;
            color: $text-g;
            margin-bottom: 12px;
          }
        }
      }
    }
    .wrap-list {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      .wrap-list-item {
        padding: 50px 0 60px;
        width: 360px;
        height: 296px;
        background: #232323;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          font-size: 16px;
          font-weight: 500;
          color: $text-t;
        }
        p {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
          }
          span:nth-of-type(2) {
            margin-top: 4px;
            font-size: 16px;
            font-weight: bold;
            color: $text-t;
          }
        }
        a {
          margin-top: 40px;
          width: 273px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          background: $main-color;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          &:hover {
            background: $main-hover;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .token-wrap {
    width: 100%;
    border-radius: 3px;
    .wrap-title {
      height: 165px;
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        color: $bg-w;
        margin: 47px 0 12px;
        font-size: 24px;
        font-weight: 500;
      }
      p {
        text-align: center;
        width: 300px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: $text-g;
        a {
          color: #be3a3b;
        }
      }
    }
    .wrap-text {
      padding: 0 16px;
      margin-top: 30px;
      p {
        display: flex;
        flex-direction: column;
        margin-top: 24px;
        span {
          font-size: 18px;
          font-weight: bold;
          color: $text-t;
        }
        &:nth-of-type(1) {
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
            font-weight: normal;
            margin-bottom: 12px;
          }
        }
        &:nth-of-type(2) {
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
            font-weight: normal;
            margin-bottom: 12px;
          }
        }
        &:nth-of-type(3) {
          .tooltip {
            font-size: 14px;
            color: $text-g;
            margin-bottom: 12px;
          }
        }
      }
    }
    .wrap-list {
      padding: 0 16px;
      margin-top: 40px;
      .wrap-list-item {
        padding: 30px 16px 30px 16px;
        margin-bottom: 10px;
        width: 100%;
        background: #232323;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          font-size: 16px;
          font-weight: 500;
          color: $text-t;
        }
        p {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          span:nth-of-type(1) {
            font-size: 14px;
            color: $text-g;
          }
          span:nth-of-type(2) {
            margin-top: 4px;
            font-size: 16px;
            font-weight: bold;
            color: $text-t;
          }
        }
        a {
          width: 100%;
          margin-top: 40px;
          background: $main-color;
          border-radius: 5px;
          text-align: center;
          height: 36px;
          line-height: 36px;
          &:hover {
            background: $main-hover;
          }
        }
      }
    }
  }
}
</style>