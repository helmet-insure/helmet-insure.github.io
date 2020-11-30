<template>
  <div class="p-input-block">
    <input :type="type" v-model="svalue" :placeholder="placeholder" />
    <span class="right">{{ right }}</span>
  </div>
</template>
<script>
import { fixInput } from "~/assets/js/util.js";

export default {
  name: "p-input",
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    right: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    fix: {
      type: [String, Number],
      default: ''
    },
    maxValue: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      svalue: this.value,
    };
  },
  watch: {
    svalue(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit("input", newVal);
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
  // methods: {
  //     valueWatch(newValue) {
  //         console.log('valueWatch####', newValue);
  //         this.svalue = newValue;
  //     }
  // }
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .p-input-block {
    width: 100%;
    min-width: 200px;
    height: 40px;
    border: 1px solid $border;
    border-radius: 3px;
    /* display: flex; */
    align-items: center;
    position: relative;
    .right {
      margin-left: 5px;
      position: absolute;
      right: 16px;
      top: 8px;
    }
    input::-webkit-input-placeholder {
      font-size: inherit;
      color: $text-d;
    }
    > input {
      width: 100%;
      height: 100%;
      padding-left: 16px;
      padding-right: 80px;
      background: none;
      color: $text-m;
      font-size: 16px;
    }
  }
}
@media screen and (max-width: 750px) {
  .p-input-block {
    width: 100%;
    height: 40px;
    border: 1px solid $border;
    border-radius: 3px;
    /* display: flex; */
    align-items: center;
    position: relative;
    .right {
      margin-left: 5px;
      position: absolute;
      right: 16px;
      top: 8px;
    }
    > input {
      width: 100%;
      height: 100%;
      padding-left: 16px;
      padding-right: 80px;
      background: none;
      color: $text-m;
      font-size: 16px;
    }
  }
}
</style>