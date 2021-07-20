<template>
  <div class="p-dialog-container">
    <div class="mask" @click="closeDialog"></div>
    <div class="p-dialog-content">
      <h3 class="title">{{ title }}</h3>
      <span v-if="!noClose" class="close" @click="closeDialog"></span>
      <div class="content">
        <slot></slot>
      </div>
      <div class="footer">
        <slot name="footer">
          <button class="cancel" @click="closeDialog" v-if="!noCancel">
            {{ leftBtnText }}
          </button>
          <button
            class="b_button"
            @click="confirmDialog"
            :disabled="!cansubmit"
          >
            {{ rightBtnText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'p-dialog',
  props: {
    title: {
      type: String,
      default: 'Tips',
    },
    leftBtnText: {
      type: String,
      default: 'Cancel',
    },
    rightBtnText: {
      type: String,
      default: 'Confirm',
    },
    cansubmit: {
      type: Boolean,
      default: true,
    },
    noClose: {
      type: Boolean,
      default: false,
    },
    noCancel: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    confirmDialog() {
      this.$emit('confirm');
      this.closeDialog();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .p-dialog-content {
    width: 496px;
  }
}
@media screen and (max-width: 750px) {
  .p-dialog-content {
    width: 90%;
    min-height: 208px;
  }
}
.p-dialog-container {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  /* background-color: rgba(0, 0, 0, 0.8); */
  .mask {
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 101;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  .p-dialog-content {
    background: #fff;
    padding: 20px 30px;
    position: relative;
    z-index: 102;
    .title {
      font-size: 16px;
      color: #121212;
    }
    .close {
      display: block;
      width: 20px;
      height: 20px;
      background: url("../../assets/img/icon/guanbi.png") center center
        no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      position: absolute;
      right: 24px;
      top: 24px;
    }
  }
  .content {
    min-height: 50px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 10px;
    button {
      cursor: pointer;
      margin-left: 8px;
      padding: 0px 10px;
      &.cancel {
        background: none;
        border: 1px solid $main-color;
        color: $main-color;
        &:hover {
          border: 1px solid $main-hover;
          color: $main-hover;
        }
      }
      &.confirm {
        background: $main-color;
        color: $text-m;
        &:hover {
          background: $main-hover;
        }
      }
      &:disabled {
        background: $text-d !important;
        cursor: not-allowed;
        &:hover {
          background: $text-d !important;
        }
      }
    }
  }
}
</style>