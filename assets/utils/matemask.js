// import WalletConnect from '@walletconnect/client';
// import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import bus from "~/assets/js/bus.js";
import { getID } from "~/assets/utils/address-pool.js";

// import Web3 from 'web3';
// import WalletConnectProvider from '@walletconnect/web3-provider';

export const mateMaskInfo = async (address, name) => {
  let obj = {
    status: 1,
    data: {
      isLogin: false,
    },
  };

  try {
    // let current = address || window.CURRENTADDRESS;
    let current;
    let currentType = window.localStorage.getItem("currentType");

    const walletConnectProvider = new WalletConnectProvider({
      infuraId: "3cd774e14cf34ff78167908f8377051c", // Required
      // bridge: 'https://bridge.myhostedserver.com'
      // qrcode: true
    });
    // await walletConnectProvider.enable();
    const coinbase = walletConnectProvider.wc.accounts[0];
    if (address) {
      current = address;
      obj.data.name = name;
      if (name === "WalletConnect") {
        await walletConnectProvider.enable();
        window.WEB3 = new Web3(walletConnectProvider);
      } else {
        window.WEB3 = new Web3(Web3.givenProvider);
      }
      window.chainID = await getID();
      bus.$emit("REFRESH_ALL_DATA");
    } else {
      if (currentType === "WalletConnect") {
        if (coinbase) {
          current = coinbase;
          await walletConnectProvider.enable();
          // window.WEB3 = new Web3(walletConnectProvider);
          obj.data.name = "WalletConnect";
        }
      } else {
        // window.WEB3 = new Web3(Web3.givenProvider);
        // current = window.CURRENTADDRESS;
        current = window.WEB3.currentProvider.selectedAddress;
        obj.data.name = "MetaMask";
      }
    }

    // console.log('重新获取到了吗###', window.chainID);

    if (!current) {
      // alert(111);
      return obj;
    } else {
      window.CURRENTADDRESS = current;
    }
    obj.data.isLogin = true;
    obj.data.account = current;
    obj.status = 1;
    return obj;
  } catch (error) {
    console.log("util=>matemask=>mateMaskInfo", error);
    // 打开下载弹框
    bus.$emit("OPEN_DOWNLOAD");
    return {
      status: -1,
      error,
      msg: "MateMask 扩展插件未安装或未启用",
    };
  }
};
