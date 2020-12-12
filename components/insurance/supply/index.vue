<template>
  <PDialog
    @close="closeSupply"
    :title="$t('Content.Supply')"
    :cansubmit="cansubmit"
    :rightBtnText="rightBtnText"
    @confirm="submitSupply"
  >
    <div class="supply-box">
      <!-- <span class="close"></span> -->
      <!-- <h3 class="title">Supply</h3> -->
      <div class="select-type">
        <label>{{ $t("Dialog.Type") }}</label>
        <TypeSelect @change="colChanged"></TypeSelect>
      </div>

      <CoinRadio @change="undChanged"></CoinRadio>

      <PrivateRadio @change="praChanged"></PrivateRadio>
      <div class="contract-address" v-if="col == 'OTHERS'">
        <label>{{ $t("Dialog.ContractAdress") }}</label>
        <input v-model="address" class="address_input" />
      </div>
      <div class="control-block">
        <div class="control-item">
          <label>{{ $t("Dialog.DueDate") }}</label>
          <DueDate @change="dueDateChanged"></DueDate>
        </div>
        <div class="control-item">
          <div class="index-price-box">
            <label>{{ $t("Dialog.ExecutivePrice") }}</label>
            <p class="index-price">
              {{ $t("Dialog.UniswapIndex") }}: {{ indexPx }}
            </p>
          </div>
          <PInput
            v-if="col == 'OTHERS'"
            type="number"
            v-model="price"
            fix="2"
            maxValue="10000"
          ></PInput>
          <SelectPrice
            v-else
            @change="priceChanged"
            :indexPx="indexPx"
          ></SelectPrice>
        </div>
      </div>
      <div class="control-block">
        <div class="control-item">
          <label>{{ $t("Dialog.Quantity") }}</label>
          <PInput
            type="number"
            v-model="qty"
            fix="2"
            maxValue="10000"
            right="Helmet"
          ></PInput>
        </div>
        <div class="control-item">
          <label>{{ $t("Dialog.ExpectedDPR") }}</label>
          <PInput
            type="number"
            v-model="dpr"
            fix="2"
            maxValue="10000"
            right="%"
          ></PInput>
          <p class="rent">{{ $t("Dialog.Rent") }} ≈ {{ rent }}</p>
        </div>
      </div>
      <!-- 抵押 -->
      <div class="collateral">
        <label>{{ $t("Dialog.Collateral") }}</label>
        <span>{{ collateral }} {{ und }}</span>
      </div>
      <!-- 余额 -->
      <div class="balance">
        <label>{{ $t("Dialog.Balance") }}</label>
        <span>{{ balance }} {{ und }}</span>
      </div>
      <div class="tips">
        {{
          $t("Dialog.Time", {
            time: moment(dueDate).format("YYYY-MMM Do HH:mm"),
            collateral: collateral,
            und: und,
            qty: qty,
            col: col,
          })
        }}
      </div>
    </div>
  </PDialog>
</template>
<script>
import PDialog from '~/components/common/p-dialog.vue';
import TypeSelect from '~/components/common/type-select.vue';
import CoinRadio from './coin-radio.vue';
import PrivateRadio from './private-radio.vue';
import DueDate from './due-date.vue';
import SelectPrice from './select-price.vue';
import PInput from '~/components/common/p-input.vue';
import { uniswap } from '~/assets/utils/address-pool.js';
import precision from '~/assets/js/precision.js';
import { getBalance, onIssueSell } from '~/interface/order.js';
import moment from 'moment';
import { fixD, fixInput } from '~/assets/js/util.js';

export default {
  name: 'supply',
  components: {
    PDialog,
    TypeSelect,
    CoinRadio,
    DueDate,
    SelectPrice,
    PInput,
    PrivateRadio,
  },
  props: ['showDialog'],
  data() {
    return {
      col: 'WETH',
      dueDate: '', // 过期时间
      price: '', // 执行价格
      qty: '1',
      dpr: '1',
      und: 'USDT',
      indexPx: '', // 指数价格
      balance: '', // 余额
      private: false,
      moment: moment,
      address: '',
    };
  },
  computed: {
    // 保费
    // 预期日化收益 = ((指数价格 - 执行价格) + 保费) / (执行价格 * 天数)
    // 保费 = 预期日化收益 * 执行价格 * 天数 - 指数价格-执行价格);
    rent() {
      if (this.indexPx && this.dueDate && this.price && this.dpr) {
        let dpr = this.dpr / 100;
        let time1 = new Date(this.dueDate).getTime();
        let time2 = new Date().getTime();
        let day = parseInt((time1 - time2) / (1000 * 60 * 60 * 24)) + 1;
        let premium = precision.minus(
          precision.times(dpr, this.price, day),
          precision.minus(this.indexPx, this.price)
        );
        return premium;
      }
      return '--';
    },
    // 标的物价值
    collateral() {
      return precision.times(this.qty, this.price);
    },
    undAndCol() {
      if (this.col && this.und) {
        return {
          col: this.col,
          und: this.und,
        };
      }
    },
    cansubmit() {
      if (
        Number(this.balance) &&
        Number(this.balance) > Number(this.collateral)
      ) {
        return true;
      } else {
        return false;
      }
    },
    rightBtnText() {
      if (
        Number(this.balance) &&
        Number(this.balance) > Number(this.collateral)
      ) {
        return 'Publish';
      } else {
        return 'Balance Shortfall';
      }
    },
  },
  watch: {
    undAndCol: {
      handler: 'undAndcolWatch',
      immediate: true,
    },
  },
  methods: {
    colChanged(type) {
      this.col = type;
    },
    dueDateChanged(date) {
      this.dueDate = date;
    },
    priceChanged(price) {
      this.price = price;
    },
    closeSupply() {
      this.$emit('close');
    },
    undChanged(coin) {
      this.und = coin;
      this.getBalance();
    },
    praChanged(flag) {
      if (flag == 'YES') {
        this.private = true;
      } else {
        this.private = false;
      }
    },
    async undAndcolWatch(newValue) {
      if (newValue.col && newValue.und) {
        this.$bus.$emit('PRICE_START_CHANGE', true);
        const px = await uniswap(newValue.col, newValue.und, window.chainID);
        this.indexPx = px;
        this.$bus.$emit('PRICE_CHANGE_SUCCESS', true);
        if (!this.balance) {
          this.getBalance();
        }
      }
    },
    // 获取余额
    getBalance() {
      getBalance(this.und).then((res) => {
        this.balance = fixD(res, 3);
      });
    },
    submitSupply() {
      const data = {
        private: this.private,
        annual: this.dpr,
        category: this.col,
        currency: this.und,
        expire: this.dueDate,
        premium: this.rent,
        price: this.price,
        volume: this.qty,
        address: this.address,
        _yield: 0,
      };
      onIssueSell(data, (status) => {
        // console.log('onIssueSell####status#####', status);
        // if (status === 'pending') {
        //   console.log('onIssueSell####pending');
        // } else if (status === 'approve') {
        //   console.log('onIssueSell####approve');
        // } else if (status === 'success' || status === 'failed') {
        //   console.log('onIssueSell####success or failed###', status);
        // }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
.address_input {
  &::-webkit-input-placeholder {
    font-size: inherit;
    color: $text-d;
  }
  min-width: 200px;
  height: 40px;
  border: 1px solid $border;
  border-radius: 3px;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  background: none;
  color: $text-m;
  font-size: 16px;
}
.supply-box {
  .contract-address {
    label {
      display: block;
      margin-bottom: 5px;
    }
  }
  .select-type {
    display: flex;
    align-items: center;
    margin-top: 30px;
    > label {
      margin-right: 10px;
    }
  }
  .control-block {
    margin-top: 20px;
    display: flex;
    .control-item {
      label {
        display: block;
        padding-bottom: 5px;
      }
      .rent {
        color: $text-d;
        text-align: right;
        font-size: 12px;
        padding-top: 5px;
      }
    }
  }
  .collateral,
  .balance {
    display: flex;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    label {
      color: $text-g;
    }
  }
  .collateral {
    margin-top: 20px;
  }
  .tips {
    color: $text-w;
    font-size: 12px;
    margin-top: 20px;
    margin-bottom: 10px;
    line-height: 1.5;
  }
}
@media screen and(min-width: 750px) {
  .control-block {
    justify-content: space-between;
    .control-item {
      width: 200px;
    }
  }
  .index-price {
    display: none;
  }
}
@media screen and (max-width: 750px) {
  .control-block {
    flex-direction: column;
    .control-item {
      width: 100%;
      margin-top: 10px;
    }
  }
  .supply-box .control-block {
    margin-top: 0;
  }
  .control-block:nth-of-type(2) {
    margin-top: 10px;
  }
  .index-price-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .index-price {
      font-size: 12px;
      color: #7d7d7d;
    }
  }
}
</style>