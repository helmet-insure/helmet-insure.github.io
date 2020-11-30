import bus from "~/assets/js/bus.js";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export const mateMaskInfo = (address) => {
  let obj = {
    status: 1,
    data: {
      isLogin: false,
    },
  };

  try {
    let current;
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    if (address) {
      current = address;
    } else if (connector && connector.connected) {
      current = connector.accounts[0];
    } else {
      // current = window.CURRENTADDRESS;
      current = window.WEB3.currentProvider.selectedAddress;
    }
    if (!current) {
      // alert(111);
      return obj;
    }
    obj.data.isLogin = true;
    obj.data.account = current;
    obj.status = 1;
    return obj;
  } catch (error) {
    console.log("util=>matemask=>mateMaskInfo", error);
    // 打开下载弹框
    alert(1);

    bus.$emit("OPEN_DOWNLOAD");
    return {
      status: -1,
      error,
      msg: "MateMask 扩展插件未安装或未启用",
    };
  }
};
