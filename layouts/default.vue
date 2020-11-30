<template>
  <div class="layout-container">
    <PHeader></PHeader>
    <p>{{ $t('Dialog.StartMining') }}</p>
    <div class="main-container">
      <nuxt />
    </div>
    <PFooter></PFooter>
    <MyPayaso></MyPayaso>
    <PMask></PMask>
    <RiskWarning
      v-if="showRiskWarning"
      @close="closeRiskWarning"
      @confirm="closeRiskWarning"
    ></RiskWarning>
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
import PHeader from '~/components/common/header.vue';
import PFooter from '~/components/common/footer.vue';
import { web3 } from '~/assets/utils/web3-obj.js';
import {
  getOptionCreatedLog,
  getSellLog,
  getBuyLog,
} from '~/interface/order.js';
import { getID } from '~/assets/utils/address-pool.js';
import { mateMaskInfo } from '~/assets/utils/matemask.js';
import RiskWarning from '~/components/common/risk-warning.vue';
import StatusDialog from '~/components/common/status-dialog.vue';
import MyPayaso from '~/components/common/my-payaso.vue';
import PMask from '~/components/common/p-mask.vue';
import WallectDownLoad from '~/components/common/wallet-download.vue';

export default {
  name: 'default',
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
        type: '',
        title: '',
        conTit: '',
        conText: '',
        btnText: '',
      },
      showStatusDialog: false,
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
      handler: 'longMapAndSellMapWatch',
      immediate: true,
    },
    aboutInfoSell: {
      handler: 'aboutInfoSellWatch',
      immediate: true,
    },
  },
  async mounted() {
    // 是否阅读过【风险提示】
    if (!window.localStorage.getItem('readRisk')) {
      this.showRiskWarning = true;
    }

    window.WEB3 = await web3();
    window.chainID = await getID();
    this.getUserInfo();

    // 获取映射
    this.$store.dispatch('setAllMap');
    this.monitorNetWorkChange();

    // 显示状态弹框
    this.$bus.$on('OPEN_STATUS_DIALOG', (data) => {
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
    this.$bus.$on('CLOSE_STATUS_DIALOG', (data) => {
      this.closeStatusDialog();
      window.statusDialog = false;
    });

    // 刷新所有数据
    this.$bus.$on('REFRESH_ALL_DATA', (data) => {
      this.refreshAllData();
    });
  },
  methods: {
    getStatusTitle(type) {
      switch (type) {
        case 'pending':
          return 'Waiting for confirmation';
        case 'submit':
          return 'Transaction submitted';
        default:
          return 'Tips';
      }
    },
    getConTit(type) {
      switch (type) {
        case 'pending':
          return 'Please confirm the transaction in the wallet';
        case 'submit':
          return 'Transaction submitted';
        default:
          return 'Tips';
      }
    },
    getBtnTit(type) {
      switch (type) {
        case 'pending':
          return 'Approve';
        case 'submit':
          return 'Confirm';
        default:
          return 'Tips';
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
        this.$store.dispatch('mapAbountInfoSell');
      }
    },
    aboutInfoSellWatch(newValue) {
      if (newValue) {
        this.$store.dispatch('mapAboutInfoBuy');
        this.$store.dispatch('getCountByType');
      }
    },
    monitorNetWorkChange() {
      if (window.ethereum) {
        ethereum.on('networkChanged', (chainID) => {
          window.chainID = chainID;
          this.$bus.$emit('REFRESH_ALL_DATA');
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
        this.$store.dispatch('setUserInfo', res);
      } catch (error) {
        alert(error);
      }
    },
    refreshAllData() {
      this.$store.dispatch('setAllMap');
    },
  },
};
</script>
<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
  position: relative;
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
    padding-bottom: 210px;
    .main-container {
      width: 1200px;
      margin: 0 auto;
    }
  }
}
@media screen and (max-width: 750px) {
  .layout-container {
    padding-bottom: 240px;
    .main-container {
      width: 100%;
    }
  }
}
</style>