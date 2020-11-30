<!-- 租赁弹框 -->
<template>
  <PDialog :title="$t('Dialog.BorrowHelmet')" @close="closeRent">
    <div class="rent-container">
      <div class="amount-box">
        <label>{{ $t('Dialog.Amount') }}</label>
        <PInput
          type="number"
          :maxValue="surplus"
          v-model="amount"
          right="Helmet"
          fix="2"
          placeholder="Please enter the quantity"
        ></PInput>
        <div class="info">
          <!-- 矿工帽剩余量 -->
          <span class="surplus">
            {{ $t('Dialog.YouCanBorrow') }}:
            {{ toRounding(precision.times(data.remain, data._strikePrice), 2) }}
          </span>
          <!-- 可用余额 -->
          <span class="balance">
            {{ $t('Dialog.Balance') }}: {{ balance }}
          </span>
        </div>
      </div>
      <!-- 租赁费用 -->
      <div class="rent-price">
        <label>{{ $t('Table.Rents') }}</label>
        <span
          >{{
            data.settleToken === 'USDT' || data.settleToken === 'USDC'
              ? toRounding(
                  precision.times(
                    precision.divide(
                      precision.divide(data.price, 1000000000000),
                      data._strikePrice
                    ),
                    amount
                  ),
                  4
                )
              : toRounding(
                  precision.times(
                    precision.divide(data.price, data._strikePrice),
                    amount
                  ),
                  4
                )
          }}
          {{ data.settleToken }}</span
        >
      </div>
      <!-- 保险到期时间 -->
      <div class="expiry">
        <Tooltip
          :name="$t('Dialog.IMPORTANTDueDate')"
          width="200px"
          :hint="$t('Tips.HoverTip1')"
        ></Tooltip>
        <span>{{ moment(parseInt(data._expiry)).format('MMM Do HH:mm') }}</span>
      </div>
    </div>
    <template v-slot:footer>
      <div class="btn-box">
        <p class="tips">
          {{ $t('Tips.Tip1') }}
        </p>
        <button @click="rentSubmit" :disabled="!cansubmit">
          {{ $t('Dialog.Confirmation') }}
        </button>
      </div>
    </template>
  </PDialog>
</template>

<script>
import PDialog from '~/components/common/p-dialog.vue';
import PInput from '~/components/common/p-input.vue';
import Tooltip from '~/components/common/tooltip.vue';
import precision from '~/assets/js/precision.js';
import { getBalance, buyInsurance } from '~/interface/order.js';
import moment from 'moment';
import { fixD, addCommom, toRounding, autoRounding } from '~/assets/js/util.js';

export default {
  name: 'rent',
  components: {
    PDialog,
    PInput,
    Tooltip,
  },
  props: ['data'],
  data() {
    return {
      amount: '',
      precision: precision,
      balance: '',
      moment: moment,
      addCommom: addCommom,
      toRounding: toRounding,
    };
  },
  computed: {
    // 矿工帽剩余量
    surplus() {
      return toRounding(
        precision.times(this.data.remain, this.data._strikePrice),
        2
      );
    },
    cansubmit() {
      if (this.amount > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    data: {
      handler: 'dataWatch',
      immediate: true,
    },
  },
  methods: {
    closeRent() {
      this.$bus.$emit('CLOSE_RENT', true);
    },
    dataWatch(data) {
      getBalance(data.settleToken).then((res) => {
        this.balance = fixD(res, 3);
      });
    },
    rentSubmit() {
      const data = {
        settleToken: this.data.settleToken,
        _strikePrice: this.data._strikePrice,
        price: this.data.price,
        askID: this.data.askID,
        volume: this.amount,

        _underlying: this.data._underlying,
        exPrice: autoRounding(precision.divide(1, this.data._strikePrice)),
      };
      buyInsurance(data, (status) => {
        // if (status === "pending") {
        //   // this.props.sendAction("Status", "padding");
        // } else if (status === "approve") {
        //   // this.props.sendAction("Status", "approve");
        // } else if (status === "success" || status === "failed") {
        //   // this.props.sendAction("Status", "off");
        // }
      });
      this.closeRent();
    },
  },
};
</script>
<style lang="scss">
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .rent-container {
    .p-input-block {
      input {
        font-size: 16px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .rent-container {
    .p-input-block {
      input {
        font-size: 14px;
      }
    }
  }
}
.rent-container {
  .expiry {
    .tooltip {
      .name {
        color: $main-light;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .rent-container {
    font-size: 14px;
  }
}
@media screen and (max-width: 750px) {
  .rent-container {
    font-size: 12px;

    .expiry {
      .tooltip {
        .name {
          max-width: 90px;
          text-align: left;
        }
      }
      > span {
        text-align: right;
      }
    }
  }
  .btn-box {
    flex-direction: column;
    button {
      align-self: flex-end;
      margin-top: 15px;
      margin-left: 0;
    }
  }
}
.rent-container {
  padding-top: 20px;
  color: $text-d;
  .amount-box {
    label {
      display: block;
      padding-bottom: 6px;
    }
    input {
      font-size: 14px !important;
    }
    .info {
      display: flex;
      justify-content: space-between;
      padding-top: 6px;
    }
  }

  .rent-price,
  .expiry {
    display: flex;
    justify-content: space-between;
    > span {
      color: $text-t;
    }
  }
  .rent-price {
    margin-top: 20px;
  }
  .expiry {
    margin-top: 20px;
  }
}
.btn-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  .tips {
    color: $main-light;
    font-size: 12px;
    padding-right: 20px;
  }
  button {
    background: $main-color;
    color: $text-t;
    cursor: pointer;
    // min-width: 80px;
    &:hover {
      background: $main-hover;
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      &:hover {
        background: $main-color;
      }
    }
  }
}
</style>