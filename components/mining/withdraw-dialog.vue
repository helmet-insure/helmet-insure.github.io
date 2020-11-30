<template>
  <PDialog
    :title="$t('Table.Withdraw')"
    @close="closeWithdraw"
    :noCancel="true"
    @confirm="submitWithdraw"
    :rightBtnText="$t('Table.Confirm')"
  >
    <div class="withdrawInput">
      <PInput
        type="number"
        v-model="WithdrawNum"
        fix="20"
        :right="'LP Token'"
        maxValue="10000"
      ></PInput>
    </div>
    <p class="total-token">
      <span>{{ available }} {{ $t('Table.Available') }}</span
      ><a @click="all">{{ $t('Table.ALL') }}</a>
    </p>
    <div class="checkPer">
      <span
        v-for="item in perList"
        :key="item"
        @click="handleClickPer(item)"
        :class="curPer === item ? 'active' : ''"
        >{{ item }}%</span
      >
    </div>
    <div class="check" v-if="!hiddenGlobal">
      <img
        src="~/assets/img/icon/checked1.png"
        alt=""
        v-if="checked"
        @click="withdrawCheck"
      />
      <img
        src="~/assets/img/icon/checked2.png"
        alt=""
        v-else
        @click="withdrawCheck"
      />
      <p>{{ $t('Table.InfiniteApproval') }}</p>
    </div>
  </PDialog>
</template>

<script>
import PDialog from '~/components/common/p-dialog.vue';
import PInput from '~/components/common/p-input.vue';
import {
  fixD,
  addCommom,
  autoRounding,
  toRounding,
  allowance,
} from '~/assets/js/util.js';
import { toWithdraw, WithdrawAvailable } from '~/interface/deposite';
export default {
  props: ['current'],
  components: {
    PDialog,
    PInput,
  },
  data() {
    return {
      checked: false,
      WithdrawNum: '',
      perList: [25, 50, 75, 100],
      curPer: 0,
      available: 0,
      hiddenGlobal: false,
    };
  },
  mounted() {
    this.filterApporve();
    this.abailable();
  },
  methods: {
    filterApporve() {
      let list = this.$store.state.approveList;
      this.hiddenGlobal = list[this.current];
    },
    all() {
      this.WithdrawNum = this.available;
    },
    async abailable() {
      let type = this.current.replace('-', '_');
      let res = await WithdrawAvailable(type);
      this.available = addCommom(res, 20);
    },
    handleClickPer(item) {
      this.curPer = item;
      if (this.available) {
        this.WithdrawNum = (this.available * item) / 100;
      }
    },
    withdrawCheck() {
      this.checked = !this.checked;
    },
    closeWithdraw() {
      this.$emit('close');
    },
    submitWithdraw() {
      let flag = this.hiddenGlobal || this.checked;
      let type = this.current.replace('-', '_');
      toWithdraw(type, { amount: this.WithdrawNum }, flag, (status) => {});
    },
  },
};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .withdrawInput {
    margin-top: 44px;
  }
  .total-token {
    margin-top: 4px;
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
  .checkPer {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 40px;
      border-radius: 3px;
      border: 1px solid #434343;
      font-size: 16px;
      color: $text-t;
      cursor: pointer;
    }
    .active {
      border: 2px solid #be3a3b;
    }
  }

  .check {
    margin-top: 26px;
    margin-bottom: 32px;
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
@media screen and (max-width: 750px) {
  .withdrawInput {
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
  .checkPer {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 40px;
      border-radius: 3px;
      border: 1px solid #434343;
      font-size: 16px;
      color: $text-t;
      cursor: pointer;
    }
    .active {
      border: 2px solid #be3a3b;
    }
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