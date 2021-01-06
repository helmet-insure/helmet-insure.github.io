<template>
  <div class="layout-container">
    <PHeader></PHeader>
    <div class="main-container">
      <nuxt />
    </div>
    <PFooter :padding="200"></PFooter>
    <MyPayaso></MyPayaso>
    <PMask></PMask>
    <!-- <RiskWarning
      v-if="showRiskWarning"
      @close="closeRiskWarning"
      @confirm="closeRiskWarning"
    ></RiskWarning> -->
    <!-- 下载钱包指引界面 -->
    <WallectDownLoad></WallectDownLoad>
    <!-- 钱包交互状态提示弹框 -->
    <StatusDialog
      v-if="showStatusDialog"
      :data="statusData"
      @close="closeStatusDialog"
    ></StatusDialog>
  </div>
</template>
<script>
import PHeader from "~/components/common/header.vue";
import PFooter from "~/components/common/footer.vue";
import { web3 } from "~/assets/utils/web3-obj.js";
import {
  getOptionCreatedLog,
  getSellLog,
  getBuyLog,
} from "~/interface/order.js";
import { getID } from "~/assets/utils/address-pool.js";
import { mateMaskInfo } from "~/assets/utils/matemask.js";
import RiskWarning from "~/components/common/risk-warning.vue";
import StatusDialog from "~/components/common/status-dialog.vue";
import MyPayaso from "~/components/common/my-payaso.vue";
import PMask from "~/components/common/p-mask.vue";
import WallectDownLoad from "~/components/common/wallet-download.vue";
import { uniswap } from "~/assets/utils/address-pool.js";
import { getBalance } from "~/interface/order.js";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
import { toWei, fromWei } from "~/assets/utils/web3-fun.js";

export default {
  name: "default",
  components: {
    PHeader,
    PFooter,
    RiskWarning,
    StatusDialog,
    MyPayaso,
    PMask,
    WallectDownLoad,
  },
  data() {
    return {
      times: 0,
      showRiskWarning: false,
      statusData: {
        type: "",
        title: "",
        conTit: "",
        conText: "",
        btnText: "",
      },
      showStatusDialog: false,
      coinList: ["HELMET", "CAKE", "CTK", "FORTUBE"],
    };
  },
  computed: {
    longMap() {
      return this.$store.state.longMap;
    },
    sellMap() {
      return this.$store.state.sellMap;
    },
    buyMap() {
      return this.$store.state.buyMap;
    },
    longMapAndSellMap() {
      if (this.longMap && this.sellMap) {
        return {
          longMap: this.longMap,
          sellMap: this.sellMap,
        };
      }
      return null;
    },
    aboutInfoSell() {
      return this.$store.state.aboutInfoSell;
    },
  },
  watch: {
    longMapAndSellMap: {
      handler: "longMapAndSellMapWatch",
      immediate: true,
    },
    aboutInfoSell: {
      handler: "aboutInfoSellWatch",
      immediate: true,
    },
  },
  async mounted() {
    // 是否阅读过【风险提示】
    // if (!window.localStorage.getItem('readRisk')) {
    //   this.showRiskWarning = true;
    // }
    window.WEB3 = await web3();
    window.chainID = await getID();

    this.getUserInfo();
    // 获取映射
    this.$store.dispatch("setAllMap");
    this.monitorNetWorkChange();

    // 显示状态弹框
    this.$bus.$on("OPEN_STATUS_DIALOG", (data) => {
      const result = {
        type: data.type,
        title: data.title || this.getStatusTitle(data.type),
        conTit: data.conTit || this.getConTit(data.type),
        conText: data.conText,
        btnText: data.btnText || this.getBtnTit(data.type),
      };
      this.statusData = result;
      this.openStatusDialog();
      window.statusDialog = true;
    });

    // 关闭状态弹框
    this.$bus.$on("CLOSE_STATUS_DIALOG", (data) => {
      this.closeStatusDialog();
      window.statusDialog = false;
    });
    if (window.chainID != 56) {
      this.$bus.$emit("OPEN_STATUS_DIALOG", {
        type: "warning",
        conText: "请连接到Binance Smart Chain网络",
      });
    }
    // 刷新所有数据
    this.$bus.$on("REFRESH_ALL_DATA", (data) => {
      this.refreshAllData();
    });
    this.$bus.$on("REFRESH_BALANCE", () => {
      this.getBalance();
    });
    setTimeout(() => {
      this.getBalance();
      this.getIndexPirce();
    }, 1000);
  },
  methods: {
    getStatusTitle(type) {
      switch (type) {
        case "warning":
          return "Warning";
        case "pending":
          return "Waiting for confirmation";
        case "submit":
          return "Transaction submitted";
        default:
          return "Tips";
      }
    },
    getConTit(type) {
      switch (type) {
        case "warning":
          return "Please connect to the Binance Smart Chain network";
        case "pending":
          return "Please confirm the transaction in the wallet";
        case "submit":
          return "Transaction submitted";
        default:
          return "Tips";
      }
    },
    getBtnTit(type) {
      switch (type) {
        case "warning":
          return "OK";
        case "pending":
          return "Approve";
        case "submit":
          return "Confirm";
        default:
          return "Tips";
      }
    },
    openStatusDialog() {
      this.showStatusDialog = true;
    },
    closeStatusDialog() {
      window.statusDialog = false;
      this.showStatusDialog = false;
    },
    openRiskWarning() {
      this.showRiskWarning = true;
    },
    closeRiskWarning() {
      this.showRiskWarning = false;
    },
    longMapAndSellMapWatch(newValue) {
      if (newValue) {
        this.$store.dispatch("mapAbountInfoSell");
      }
    },
    aboutInfoSellWatch(newValue) {
      if (newValue) {
        this.$store.dispatch("mapAboutInfoBuy");
        this.$store.dispatch("getCountByType");
      }
    },
    monitorNetWorkChange() {
      if (window.ethereum) {
        ethereum.on("networkChanged", (chainID) => {
          window.chainID = chainID;
          this.$bus.$emit("REFRESH_ALL_DATA");
        });
      } else {
        if (this.times < 10) {
          this.times = this.times + 1;
          setTimeout(() => {
            this.monitorNetWorkChange();
          }, 1000);
        }
      }
    },
    async getUserInfo() {
      let res = await mateMaskInfo();
      try {
        if (res.status === -1) {
          return;
        }
        this.$store.dispatch("setUserInfo", res);
      } catch (error) {
        alert(error);
      }
    },
    refreshAllData() {
      this.$store.dispatch("setAllMap");
    },
    // 获取余额
    async getBalance() {
      let BalanceArray = {};
      for (let i = 0; i < this.coinList.length; i++) {
        let balance = await getBalance(this.coinList[i]);
        let key = this.coinList[i];
        BalanceArray[key] = toRounding(balance, 4);
      }
      if (window.CURRENTADDRESS) {
        window.WEB3.eth.getBalance(window.CURRENTADDRESS).then((res) => {
          BalanceArray["BNB"] = toRounding(fromWei(res), 4);
        });
      }
      this.$store.commit("SET_BALANCE", BalanceArray);
    },
    // 保存指数价格
    async getIndexPirce() {
      let list = this.$store.state.coinList;
      // bnb
      let callIndexPirce = {};
      let putIndexPirce = {};
      // helmet
      for (let i = 0; i < list.length; i++) {
        let px = await uniswap("WBNB", list[i]);
        let key = list[i];
        callIndexPirce[key] = px;
      }
      for (let i = 0; i < list.length; i++) {
        let px = await uniswap(list[i], "WBNB");
        const key = list[i];
        putIndexPirce[key] = px;
      }
      let arr = [];
      let arr1 = [];
      let bnbHelmet = callIndexPirce["HELMET"];
      let cakeHelmet = callIndexPirce["CAKE"] / callIndexPirce["HELMET"];
      let ctkHelmet = callIndexPirce["CTK"] / callIndexPirce["HELMET"];
      let forHelmet = callIndexPirce["FORTUBE"] / callIndexPirce["HELMET"];
      let HelmetPirce = {
        HELMET: bnbHelmet,
        CAKE: cakeHelmet,
        CTK: ctkHelmet,
        FORTUBE: forHelmet,
      };
      let Helmetbnb = putIndexPirce["HELMET"];
      let Helmetcake = putIndexPirce["CAKE"] / putIndexPirce["HELMET"];
      let Helmetctk = putIndexPirce["CTK"] / putIndexPirce["HELMET"];
      let Helmetfor = putIndexPirce["FORTUBE"] / putIndexPirce["HELMET"];
      let CoinPirce = {
        HELMET: Helmetbnb,
        CAKE: Helmetcake,
        CTK: Helmetctk,
        FORTUBE: Helmetfor,
      };
      arr1.push(HelmetPirce);
      arr1.push(CoinPirce);
      this.$store.commit("SET_ALL_HELMET_PRICE", arr1);
      arr.push(callIndexPirce);
      arr.push(putIndexPirce);
      this.$store.commit("SET_ALL_INDEX_PRICE", arr);
      this.$bus.$emit("DRAW_ECHART");
    },
  },
};
</script>
<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  > p {
    color: #ffc819;
    text-align: center;
    margin-top: 8px;
  }
}
@media screen and (min-width: 750px) {
  .layout-container {
    > p {
      text-align: center;
      line-height: 30px;
    }
    .main-container {
      width: 1200px;
      margin: 20px auto 0;
      flex: 1;
    }
  }
}
@media screen and (max-width: 750px) {
  .layout-container {
    .main-container {
      width: 100%;
      overflow: hidden;
    }
  }
}
</style>