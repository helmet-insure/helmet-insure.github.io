// import {web3} from './web3-obj.js';
import addressList from "~/abi/config.js";
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
} from "@uniswap/sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import precision from "~/assets/js/precision.js";

const selectNetwork = (charID) => {
  switch (charID) {
    case 1:
      return "Main";
    case 3:
      return "Ropsten";
    default:
      // return 'Ropsten';
      return "Rinkeby";
  }
};

// 获取地址
export const getAddress = (symbol, char_id) => {
  const charID = char_id || window.chainID;
  const network = selectNetwork(charID);
  let address = addressList[`${network}_${symbol}`];
  if (address) {
    return address.toLowerCase();
  } else {
    return null;
  }
};
// 获取合约
export const getContract = (name, charID = 3) => {
  const network = selectNetwork(charID);
  let contract = addressList[`${network}_CONTRACT_${name}`];
  if (contract) {
    return contract;
  } else {
    return null;
  }
};
export const getSymbol = (address, char_id) => {
  const charID = char_id || window.chainID;
  let symbol_list = ["WETH", "USDT", "USDC", "DAI", "WBTC", "CRV", "UNI"];
  const symbol = symbol_list.filter((item) => {
    return getAddress(item, charID) === address.toLowerCase();
  });
  if (symbol) {
    return symbol;
  } else {
    return ["NULL"];
  }
};

// 为什么多写了个返回值不一样的函数，后面确定逻辑后优化下
export const newGetSymbol = (adress) => {
  const charID = window.chainID;
  let symbol_list = ["WETH", "USDT", "USDC", "DAI", "WBTC", "CRV", "UNI"];
  const symbol = symbol_list.filter((item) => {
    return getAddress(item, charID) === adress.toLowerCase();
  });
  if (symbol) {
    return symbol[0];
  } else {
    return null;
    // return console.log(adress + '没有找到对应的Symbol')
  }
};

export const getWei = (token) => {
  let reg = /^0x[\S]+/;
  if (reg.test(token)) {
    // 0x adress
    token = getSymbol(token)[0];
  }
  switch (token) {
    case "USDT":
      return "lovelace"; // 6
    case "USDC":
      return "lovelace"; // 6
    default:
      return "ether"; // 18
  }
};

export const getWeiWithFix = (fix) => {
  switch (fix) {
    case 30:
      return "tether"; // 30
    default:
      return "ether"; // 18
  }
};

export const getStrikePriceFix = (und, col) => {
  // 币种，抵押物, 结算物
  let colFix = getWei_2(col);
  let undFix = getWei_2(und);
  if (colFix === undFix) {
    return 18;
  } else {
    return 18 + colFix - undFix;
  }
};

// 处理行权价格
export const dealWithStrikePrice = (px, coin) => {
  let coinFix = getWei_2(coin);
  if (coinFix !== 18) {
    return precision.divide(px, Math.pow(10, 30 - coinFix));
  } else {
    return px;
  }
};

// getWei和getWei_2不知何为， 后面更换注释
export const getWei_2 = (token) => {
  let reg = /^0x[\S]+/;
  if (reg.test(token)) {
    // 0x adress
    token = getSymbol(token)[0];
  }
  switch (token) {
    case "USDT":
      return 6; // 6
    case "USDC":
      return 6; // 6
    default:
      return 18; // 18
  }
};

// 获取id
export const getID = async () => {
  // const WEB3 = await web3();
  if (typeof window.ethereum !== "undefined") {
    const chainId = await window.WEB3.eth.net.getId();
    return chainId;
  } else {
    const walletConnectProvider = new WalletConnectProvider({
      infuraId: "3cd774e14cf34ff78167908f8377051c", // Required
      // bridge: 'https://bridge.myhostedserver.com'
      // qrcode: true
    });
    if (walletConnectProvider.networkId) {
      return walletConnectProvider.networkId;
    } else {
      return 1;
    }
  }
};

// UniSwap SDK
export const uniswap = async (token1, token2) => {
  console.log(token1, token2, "####################uniswap");
  // const WEB3 = await web();
  const address1 = getAddress(token1);
  const address2 = getAddress(token2);
  // console.log('window.chainID####', window.chainID);
  // console.log('token1####', token1);
  // console.log('token2####', token2);
  // 令牌实体表示特定链上特定地址处的 ERC-20令牌
  const TOKEN1 = new Token(
    window.chainID,
    address1,
    getWei_2(token1),
    token1,
    token1
  );
  const TOKEN2 = new Token(
    window.chainID,
    address2,
    getWei_2(token2),
    token2,
    token2
  );
  // Pair 实体表示一个 Uniswap 对，其中每个对标记都有一个平衡。
  // 从两个 token 初始化一个类实例
  try {
    // console.log('TOKEN1#####', TOKEN1);
    // console.log('TOKEN2#####', TOKEN2);
    const pair = await Fetcher.fetchPairData(TOKEN2, TOKEN1);
    // console.log('pair####', pair);
    // Route 实体表示一个或多个有序 Uniswap 对，具有从输入令牌到输出令牌的完全指定的路径。
    const route = new Route([pair], TOKEN1);
    // console.log('route#####', route);
    // // 贸易实体代表一条路线上完全指定的贸易。这个实体提供了制作路由器事务所需的所有信息。
    // const trade = new Trade(route, new TokenAmount(TOKEN1, window.WEB3.utils.toWei('1', getWei(token1))), TradeType.EXACT_INPUT);
    // console.log(trade.nextMidPrice.toSignificant(6));
    // return trade.executionPrice.toSignificant(6);
    // console.log(
    //   'route.midPrice.toSignificant(6)####',
    //   route.midPrice.toSignificant(6)
    // );
    if (token1 === "WBTC") {
      return route.midPrice.toSignificant(6) / 10000000000;
    }
    return route.midPrice.toSignificant(6);
  } catch (error) {
    // console.log('进到这里了是吗');
    const charID = 1;
    const adress1 = getAddress(token1, charID);
    const adress2 = getAddress(token2, charID);
    const TOKEN1 = new Token(charID, adress1, getWei_2(token1), token1, token1);
    const TOKEN2 = new Token(charID, adress2, getWei_2(token2), token2, token2);
    const pair = await Fetcher.fetchPairData(TOKEN2, TOKEN1);
    const route = new Route([pair], TOKEN1);

    if (token1 == "WBTC") {
      return route.midPrice.toSignificant(6) / 10000000000;
    }
    return route.midPrice.toSignificant(6);
  }
};
