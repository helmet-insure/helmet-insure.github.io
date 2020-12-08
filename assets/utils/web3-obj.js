import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
const walletConnectProvider = new WalletConnectProvider({
  infuraId: "3cd774e14cf34ff78167908f8377051c", // Required
  // bridge: 'https://bridge.myhostedserver.com'
  // qrcode: true
});
// await walletConnectProvider.enable();
// console.log('coinbase###', coinbase);
let newWeb3 = null;
export const web3 = async () => {
  if (!newWeb3) {
    const walletType = window.localStorage.getItem("currentType");
    if (
      walletType === "WalletConnect" &&
      walletConnectProvider.wc.accounts[0]
    ) {
      await walletConnectProvider.enable();
      newWeb3 = new Web3(walletConnectProvider);
    } else {
      newWeb3 = new Web3(Web3.givenProvider);
    }
  }
  return newWeb3;
};
