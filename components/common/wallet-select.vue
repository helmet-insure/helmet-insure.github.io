<!-- 选择钱包 -->
<template>
  <div class="wallet-select-mask mask">
    <div class="wallet-select-block">
      <i class="close" @click="closeDialog"></i>
      <h3 class="title">Select a Wallet</h3>
      <p class="sub-title">Please select a wallet to connect to this dapp</p>
      <ul>
        <li
          :class="
            item === 'MetaMask' || item === 'WalletConnect' ? 'on' : 'off'
          "
          v-for="item in walletList"
          :key="item"
          @click="selectWallet(item)"
        >
          <img :src="require(`~/assets/img/wallet-icon/${item}@2x.png`)" />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "@walletconnect/qrcode-modal";
import { mateMaskInfo } from '~/assets/utils/matemask.js';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';

export default {
  name: 'wallet-select',
  data() {
    return {
      walletList: [
        'MetaMask',
        'WalletConnect',
        'Fortmatic',
        'Ledger',
        'Trezor',
        'Authereum',
        'Dapper',
        'WalletLink',
        'Portis',
        'Torus',
        'Squarelink',
        'opera',
        'Unilogn',
      ],
      web3: {},
      coinbase: '',
    };
  },
  mounted() {
    this.selectWallet('MetaMask');
  },
  methods: {
    // 链接钱包
    selectWallet(item) {
      this.$store.dispatch('setWalletType', item);
      if (item === 'MetaMask') {
        try {
          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(async (account) => {
              window.localStorage.setItem('currentType', 'MetaMask');
              // setTimeout(() => {
              //     window.location.reload()
              // }, 500)
              let userInfo = await mateMaskInfo(account[0], 'MetaMask');
              this.$store.dispatch('setUserInfo', userInfo);
              this.$bus.$emit('REFRESH_ALL_DATA');
              this.$bus.$emit('REFRESH_MINING');
              this.closeDialog();
            });
        } catch (error) {
          console.log('MateMask 扩展插件未安装或未启用##', error);
        }
      } else if (item === 'WalletConnect') {
        this.connectWallet();
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    async connectWallet() {
      const walletConnectProvider = new WalletConnectProvider({
        infuraId: '3cd774e14cf34ff78167908f8377051c', // Required
        // qrcode: true
      });
      await walletConnectProvider.enable();
      const web3 = new Web3(walletConnectProvider);
      const coinbase = walletConnectProvider.wc.accounts[0];
      window.WEB3 = web3;
      let userInfo = await mateMaskInfo(coinbase, 'WalletConnect');
      this.$store.dispatch('setUserInfo', userInfo);
      window.localStorage.setItem('currentType', 'WalletConnect');
      this.$bus.$emit('REFRESH_ALL_DATA');
      this.$bus.$emit('REFRESH_MINING');
      this.closeDialog();
      // this.coinbase = await this.web3.eth.getAccounts()[0];
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .wallet-select-mask {
    .wallet-select-block {
      width: 478px;
      height: 602px;
      left: 50%;
      top: 50%;
      margin-left: -239px;
      margin-top: -301px;
      padding: 40px;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 180px;
        height: 50px;
        display: flex;
        align-items: center;
        border: 1px solid $text-t;
        margin-top: 16px;
        border-radius: 10px;
        padding: 0px 16px;
        &.on {
          cursor: pointer;
          &:hover {
            border: 2px solid $text-t;
          }
        }
        &.off {
          cursor: wait;
          opacity: 0.5;
        }

        img {
          width: 36px;
          height: 36px;
          margin-right: 16px;
        }
        span {
          font-size: 14px;
          color: $text-b2;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .wallet-select-mask {
    display: flex;
    align-items: center;
    justify-content: center;
    .wallet-select-block {
      min-width: 320px;
      width: 90%;
      height: 602px;
      padding: 30px;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 47%;
        min-width: 120px;
        height: 32px;
        display: flex;
        align-items: center;
        border: 1px solid $text-t;
        margin-top: 16px;
        border-radius: 10px;
        padding: 0px 8px;
        &.on {
          cursor: pointer;
          &:hover {
            border: 2px solid $text-t;
          }
        }
        &.off {
          cursor: wait;
          opacity: 0.5;
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 4px;
        }
        span {
          font-size: 12px;
          color: $text-b2;
        }
      }
    }
  }
}
.wallet-select-mask {
  .wallet-select-block {
    position: fixed;

    background-color: $bg-w;
    border-radius: 10px;
    text-align: left;
    .close {
      display: block;
      width: 20px;
      height: 20px;
      background: url('../../assets/img/icon/guanbi.png') center center
        no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 40px;
      top: 40px;
      cursor: pointer;
    }
    .title {
      font-size: 24px;
      color: $bg-f;
    }
    .sub-title {
      font-size: 14px;
      color: $bg-f;
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
}
</style>