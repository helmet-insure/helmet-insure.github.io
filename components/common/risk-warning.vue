<template>
  <PDialog :title="$t('Dialog.RiskWarning')" @close="closeDialog">
    <div class="risk-wraning">
      <!-- <p>PAYASO V1.0 is currently a beta version, but the assets of ERC-20 used are real assets . V1.0 version contract were audit performed by KNOWNSEC and tested by community , but there' s still a risk of unintended use. Please communicate with community in discord #official channel if you encounter unintended product issues! Supply a safety helmet may take a risk of token price falling！We highly recommend that you use Payaso with a clear understanding of its functionality.</p> -->
      <p>{{ $t("Dialog.RiskWarningContent") }}</p>
      <div class="agreement-box" @click="toggleAgree">
        <span class="checkbox">
          <img v-if="isAgree" src="~/assets/img/icon/checked1.png" />
          <img v-else src="~/assets/img/icon/checked2.png" />
        </span>
        <label>{{ $t("Dialog.RiskWarnCheck") }}</label>
      </div>
    </div>
    <template v-slot:footer>
      <div class="btn-box">
        <button class="o_button" @click="confirmDialog" :disabled="!isAgree">
          Confirm
        </button>
      </div>
    </template>
  </PDialog>
</template>
<script>
import PDialog from '~/components/common/p-dialog.vue';

export default {
  name: 'risk-warning',
  components: {
    PDialog,
  },
  data() {
    return {
      isAgree: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    confirmDialog() {
      window.localStorage.setItem('readRisk', true);
      this.$emit('confirm');
    },
    toggleAgree() {
      this.isAgree = !this.isAgree;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
.risk-wraning {
  color: $text-g;
  font-size: 14px;
  padding-top: 20px;
  > p {
    line-height: 1.8;
  }
  .agreement-box {
    margin-top: 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .checkbox {
      img {
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }
    }
    label {
      color: $text-t;
      font-size: 12px;
    }
  }
}
.btn-box {
  > button {
    cursor: pointer;
    &:hover {
      background: $main-hover;
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      /* background: rgba($main-color, 0.4); */
      &:hover {
        background: $main-color;
      }
    }
  }
}
</style>