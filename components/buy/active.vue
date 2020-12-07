<template>
  <PDialog
    :title="$t('Dialog.ActivateHelmet')"
    @close="closeDialog"
    :rightBtnText="rightBtnText"
    :cansubmit="cansubmit"
    @confirm="toActive"
  >
    <div class="active-content">
      <p>
        Activation will swap {{ toRounding(data.vol, 4) }}
        {{ data._collateral }} for
        {{ toRounding(precision.times(data.vol, data._strikePrice), 2) }}
        {{ data._underlying }} . Are you sure you want to activate it?
      </p>
    </div>
  </PDialog>
</template>
<script>
import PDialog from '~/components/common/p-dialog.vue';
import precision from '~/assets/js/precision.js';
import { getBalance, onExercise } from '~/interface/order.js';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';

export default {
  name: 'active',
  components: {
    PDialog,
  },
  props: ['data'],
  data() {
    return {
      precision: precision,
      rightBtnText: '',
      toRounding: toRounding,
      cansubmit: false,
    };
  },
  watch: {
    data: {
      handler: 'dataWatch',
      immediate: true,
    },
  },
  methods: {
    async dataWatch(data) {
      const balance = await getBalance(data._underlying);
      // 余额不足
      if (
        Number(balance) < Number(precision.times(data.vol, data._strikePrice))
      ) {
        this.rightBtnText = this.$t('Dilaog.InsufficientBalance', {
          type: data._underlying,
        });
      } else {
        this.rightBtnText = this.$t('Status.Activate');
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    async dataWatch(data) {
      const balance = await getBalance(data._underlying);
      // 余额不足
      if (
        Number(balance) < Number(precision.times(data.vol, data._strikePrice))
      ) {
        this.rightBtnText = this.$t('Dilaog.InsufficientBalance', {
          type: data._underlying,
        });
        this.cansubmit = false;
      } else {
        this.rightBtnText = this.$t('Status.Activate');
        this.cansubmit = true;
      }
    },
    toActive() {
      const data = {
        token: this.data._underlying,
        _underlying_vol: this.data.vol * this.data._strikePrice,
        vol: toRounding(this.data.vol, 2),
        bidID: this.data.bidID,
        long: this.data.long,
        exPrice: autoRounding(precision.divide(1, this.data._strikePrice)),
        _underlying: this.data._underlying,
        settleToken: this.data.settleToken,
      };
      onExercise(data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (max-width: 750px) {
  .active-content {
    padding: 40px 0 20px;
  }
}
@media screen and (min-width: 750px) {
  .active-content {
    padding: 30px 0 20px;
  }
}
</style>