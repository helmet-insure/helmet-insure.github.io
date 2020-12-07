import { expERC20 } from "./index";
import { getAddress, getWei } from "~/assets/utils/address-pool.js";
export const getBalance = async (address1, address2) => {
  const charID = window.chainID;
  let adress1 = address1;
  let adress2 = address2;
  if (adress1.indexOf("0x") === -1) {
    adress1 = getAddress(address1, charID);
  }
  console.log(adress1, adress2);
  if (adress2.indexOf("0x") === -1) {
    adress2 = getAddress(address2, charID);
  }

  const contract = await expERC20(adress1);
  return contract.methods
    .balanceOf(adress2)
    .call()
    .then((res) => {
      let tocurrcy = adress2;
      return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
    });
};
