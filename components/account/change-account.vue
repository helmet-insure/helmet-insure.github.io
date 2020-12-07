<template>
  <div class="change-account">
    <div class="mask" @click="closeDialog"></div>
    <div class="change-account-block">
      <span class="back" @click="backDialog"></span>
      <span class="close" @click="closeDialog"></span>
      <div class="current-account">
        <i class="circle"></i>
        <span class="address-text">{{ accountText }}</span>
        <img
          :src="
            require(`~/assets/img/wallet-icon/${userInfo.data.name}@2x.png`)
          "
        />
      </div>
      <ul class="wallet-list">
        <li
          v-if="userInfo.data.name === 'Math'"
          @click="changeWallet('MetaMask')"
        >
          <span>MetaMask</span>
          <img src="~/assets/img/wallet-icon/MetaMask@2x.png" />
        </li>
        <li v-else @click="changeWallet('Math')">
          <span>Math Wallet</span>
          <img src="~/assets/img/wallet-icon/Math@2x.png" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mateMaskInfo } from '~/assets/utils/matemask.js';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';

export default {
  name: 'change-account',
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
  methods: {
    userInfoWatch(newValue) {
      let account = newValue.data.account;
      this.accountText = account.substr(0, 6) + '...' + account.substr(-5);
    },
    closeDialog() {
      this.$emit('close');
    },
    backDialog() {
      this.$emit('back');
      this.closeDialog();
    },
    changeWallet(item) {
      this.$store.dispatch('setWalletType', item);
      if (item === 'MetaMask') {
        this.connectMetaMask();
      } else {
        this.connectWallet();
      }
    },
    connectMetaMask() {
      try {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(async (account) => {
            window.localStorage.setItem('currentType', 'MetaMask');
            let userInfo = await mateMaskInfo(account[0], 'MetaMask');
            this.$store.dispatch('setUserInfo', userInfo);
            this.$bus.$emit('REFRESH_ALL_DATA');
            this.$bus.$emit('REFRESH_MINING');
            this.closeDialog();
          });
      } catch (error) {
        console.log('MateMask 扩展插件未安装或未启用##', error);
      }
    },
    async connectWallet() {
      console.log(window);
      try {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(async (account) => {
            window.localStorage.setItem('currentType', 'Math');
            let userInfo = await mateMaskInfo(account[0], 'Math');
            this.$store.dispatch('setUserInfo', userInfo);
            this.$bus.$emit('REFRESH_ALL_DATA');
            this.$bus.$emit('REFRESH_MINING');
            this.closeDialog();
          });
      } catch (error) {
        console.log('Math 扩展插件未安装或未启用##', error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .change-account-block {
    width: 510px;
    padding: 16px 30px;
    position: relative;
    background: #ffffff;
    position: relative;
    z-index: 102;
    padding-top: 60px;
    padding-bottom: 20px;
  }
}
@media screen and (max-width: 750px) {
  .change-account-block {
    width: 90%;
    padding: 8px 16px;
    position: relative;
    background: #ffffff;
    position: relative;
    z-index: 102;
    padding-top: 60px;
    padding-bottom: 20px;
  }
}
.change-account {
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
  .change-account-block {
    .back {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url('../../assets/img/icon/left2.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      position: absolute;
      left: 20px;
      top: 20px;
    }
    .close {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url('../../assets/img/icon/guanbi.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .current-account {
      display: flex;
      align-items: center;
      background: rgba($bg-a, 0.1);
      height: 60px;
      padding: 0px 16px;
      .circle {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #14b465;
        border-radius: 100%;
      }
      .address-text {
        color: $bg-d;
        font-size: 20px;
        padding-left: 8px;
        flex: 1;
        text-align: left;
      }
      > img {
        width: 30px;
        height: 30px;
      }
    }
    .wallet-list {
      li {
        border: 1px solid rgba($bg-a, 0.1);
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $bg-d;
        font-size: 20px;
        margin-top: 16px;
        padding: 0px 16px;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
        }
        &:hover {
          border: 1px solid #ff9600;
        }
      }
    }
  }
}
</style>