<template>
  <PDialog
    :title="$t('Table.Deposite')"
    @close="closeDeposite"
    :noCancel="true"
    @confirm="submitDeposite"
    :rightBtnText="$t('Table.Confirm')"
  >
    <div class="depositeInput">
      <input type="number" v-model="DepositeNum" />
      <span>Token</span>
    </div>
    <p class="total-token">
      <span>{{ current }} SHORT Token：{{ lptBalance }}</span
      ><a @click="addAll">{{ $t("Table.ALL") }}</a>
    </p>
    <!-- <a
      v-if="current"
      class="to-gettoken"
      :href="`https://app.uniswap.org/#/add/ETH/${getAddress(
        current.split('-')[1]
      )}`"
      target="_blank"
      >{{ $t("Table.GetLP") }}</a
    > -->
    <div class="check" v-if="!hiddenGlobal">
      <img
        src="~/assets/img/helmet/checked2.png"
        alt=""
        v-if="checked"
        @click="depositeCheck"
      />
      <img
        src="~/assets/img/helmet/checked1.png"
        alt=""
        v-else
        @click="depositeCheck"
      />
      <p>{{ $t("Table.InfiniteApproval") }}</p>
    </div>
  </PDialog>
</template>

<script>
import PDialog from '~/components/common/p-dialog.vue';
import PInput from '~/components/common/p-input.vue';
import { toDeposite, getMined, getLPTOKEN } from '~/interface/deposite';
import { getBalance } from '~/interface/deposite.js';
import { fixD, addCommom } from '~/assets/js/util.js';
import { getAddress } from '~/assets/utils/address-pool.js';

export default {
  props: ['current', 'TradeType'],
  components: {
    PDialog,
    PInput,
  },
  data() {
    return {
      checked: false,
      DepositeNum: '',
      getAddress: getAddress,
      lptBalance: 0,
      hiddenGlobal: false,
    };
  },
  watch: {
    current: {
      handler: 'currentWatch',
      immediate: true,
    },
  },
  mounted() {
    this.filterApporve();
    this.getBalance();
  },
  methods: {
    filterApporve() {
      let list = this.$store.state.approveList;
      this.hiddenGlobal = list[this.current];
    },
    depositeCheck() {
      this.checked = !this.checked;
    },
    closeDeposite() {
      this.$emit('close');
    },
    submitDeposite() {
      if (this.DepositeNum == '') {
        return;
      }
      let flag = this.hiddenGlobal || this.checked;
      let type = this.current;
      toDeposite(type, { amount: this.DepositeNum }, flag, (status) => { });
      this.$bus.$emit('DEPOSITE_LOADING', { status: true });
    },
    // 获取余额
    getBalance() {
      let coin = this.current.replace('-', '_') + '_LPT';
      getBalance(coin).then((res) => {
        this.lptBalance = addCommom(res, 8);
      });
    },
    currentWatch(newValue) {
      if (newValue) {
        this.getBalance(newValue);
      }
    },
    addAll() {
      this.DepositeNum = this.lptBalance;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .depositeInput {
    margin-top: 44px;
    position: relative;
    display: flex;
    align-items: center;
    input {
      width: 100%;
      height: 40px;
      border: 1px solid #cfcfd2;
      padding: 0 50px 0 12px;
    }
    span {
      position: absolute;
      right: 12px;
      color: #919aa6;
    }
  }
  .total-token {
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    height: 20px;
    line-height: 20px;
    span {
      font-size: 12px;
      color: #121212;
    }
    a {
      font-size: 12px;
      color: #ff9600;
    }
  }
  .to-gettoken {
    margin-top: 4px;
    font-size: 12px;
    color: #ff9600;
  }
  .check {
    margin-top: 26px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      cursor: pointer;
    }
    p {
      height: 18px;
      font-size: 12px;
      color: #121212;
    }
  }
}
@media screen and (max-width: 750px) {
  .depositeInput {
    margin-top: 44px;
  }
  .total-token {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    height: 20px;
    line-height: 20px;
    span {
      font-size: 12px;
      color: $text-g;
    }
    a {
      font-size: 12px;
      color: $text-l;
    }
  }
  .to-gettoken {
    margin-top: 4px;
    font-size: 12px;
    color: $text-l;
  }
  .check {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
      cursor: pointer;
    }
    p {
      font-size: 12px;
      color: $text-t;
    }
  }
}
</style>