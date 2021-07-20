<template>
  <div class="p-input-block">
    <input :type="type" v-model="svalue" :placeholder="placeholder" />
    <button class="right" @click="handleClickToBuy">{{ right }}</button>
  </div>
</template>
<script>
import { fixInput } from '~/assets/js/util.js';

export default {
  name: 'p-input',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    right: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    fix: {
      type: [String, Number],
      default: '',
    },
    maxValue: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      svalue: this.value,
    };
  },
  watch: {
    svalue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal);
      }
    },
    value(newVal) {
      if (Number(newVal) > Number(this.maxValue)) {
        this.svalue = this.maxValue;
      } else {
        if (this.fix) {
          this.svalue = fixInput(newVal, this.fix);
        } else {
          this.svalue = newVal;
        }
      }
    },
  },
  methods: {
    handleClickToBuy() {
      this.$emit('numChange')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .p-input-block {
    display: flex;
    width: 100%;
    min-width: 200px;
    height: 40px;
    align-items: center;
    position: relative;
    input::-webkit-input-placeholder {
      font-size: 14px;
      color: #919aa6;
    }
    > input {
      border: 1px solid #cfcfd2;
      border-right: none;
      width: 100%;
      min-width: 170px;
      height: 100%;
      padding-left: 12px;
      background: none;
      color: #000;
      font-size: 16px;
      &:focus {
        border-color: #ff9600;
      }
    }
    button {
      min-width: 96px;
      padding: 0 34px;
      height: 100%;
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      background: #121212;
      &:hover {
        background: #2c2c2c;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .p-input-block {
    display: flex;
    width: 100%;
    min-width: 200px;
    height: 40px;
    align-items: center;
    position: relative;
    input::-webkit-input-placeholder {
      font-size: 14px;
      color: #919aa6;
    }
    > input {
      border: 1px solid #cfcfd2;
      border-right: none;
      width: 100%;
      min-width: 170px;
      height: 100%;
      padding-left: 12px;
      background: none;
      color: #000;
      font-size: 16px;
      &:focus {
        border-color: #ff9600;
      }
    }
    button {
      min-width: 96px;
      padding: 0 34px;
      height: 100%;
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      background: #121212;
      &:hover {
        background: #2c2c2c;
      }
    }
  }
}
</style>