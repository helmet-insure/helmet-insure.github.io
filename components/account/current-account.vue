<template>
  <div class="current-account">
    <div class="mask" @click="closeDialog"></div>
    <div class="current-account-block">
      <h3 class="title">Account</h3>
      <span class="close" @click="closeDialog"></span>
      <div class="account-box">
        <div class="top">
          <span>Connected with {{ userInfo.data.name }}</span>
          <a @click="changeAccount">Change</a>
        </div>
        <div class="address">
          <span class="circle"></span>
          <span class="address-text">{{ accountText }}</span>
          <img src="~/assets/img/icon/copy.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'current-account',
  data() {
    return {
      accountText: '',
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    userInfo: {
      handler: 'userInfoWatch',
      immediate: true,
    },
  },
  mounted() {
    console.log(1);
  },
  methods: {
    userInfoWatch(newValue) {
      let account = newValue.data.account;
      this.accountText =
        account.substr(0, 1) +
        ' ' +
        account.substr(1, 1) +
        ' ' +
        account.substr(2, 4) +
        '...' +
        account.substr(-5);
    },
    closeDialog() {
      this.$emit('close');
    },
    changeAccount() {
      this.$emit('change');
      this.closeDialog();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
.current-account {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  .mask {
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 101;
  }
  .current-account-block {
    width: 510px;
    padding: 16px 30px;
    position: relative;
    background: #ffffff;
    z-index: 102;
    .title {
      font-size: 20px;
      color: $bg-d;
      text-align: left;
    }
    .close {
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url('../../assets/img/icon/guanbi.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      position: absolute;
      right: 30px;
      top: 20px;
    }
    .account-box {
      border-radius: 3px;
      border: 1px solid rgba($bg-a, 0.1);
      padding: 16px;
      padding-bottom: 20px;
      margin-top: 16px;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
          font-size: 14px;
          color: $text-d;
        }
        > a {
          display: inline-block;
          background: #ff9600;
          padding: 3px 15px;
          cursor: pointer;
          border: none;
          &:hover {
            background: #ffa000;
          }
        }
      }
      .address {
        display: flex;
        align-items: center;
        padding-top: 16px;
        .circle {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #14b465;
          border-radius: 100%;
        }
        .address-text {
          font-size: 20px;
          font-weight: 500;
          color: #101010;
          padding-left: 8px;
        }
        > img {
          width: 20px;
          height: 20px;
          margin-left: 4px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>