// import { setCookie, getCookie } from '~/assets/js/cookie';
import { CangetUNI, CangetPAYA } from '~/interface/deposite.js';
import {
    getOptionCreatedLog,
    getSellLog,
    getBuyLog,
    getMint,
    getRePrice,
} from '~/interface/order.js';
import { getProgress } from '~/interface/price.js';
import {
    getID,
    newGetSymbol,
    getTokenName,
    getAddress,
    getContract,
    dealWithStrikePrice,
} from '~/assets/utils/address-pool.js';
import Web3 from 'web3';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import {
    asks,
    frequency,
    totalSupply,
    BalanceMine,
    MyPayaso,
    claimable,
} from '~/interface/order.js';
// import precision from '~/assets/js/precision.js';
import { accDiv, add, mul } from '~/assets/utils/calculate.js';
import { toRounding } from '~/assets/js/util.js';

export const state = () => ({
    locales: ['en_US', 'zh_CN'],
    locale: 'en_US',
    localeList: [
        {
            key: 'en_US',
            name: 'English',
        },
        // {
        //   key: "po_TU",
        //   name: "Português",
        // },
        {
            key: 'zh_CN',
            name: '简体中文',
        },
    ],
    // typeList: ["WETH", "UNI", "WBTC", "CRV", "OTHERS"],
    typeList: ['WETH', 'WBTC', 'OTHERS'],
    coinList: ['HELMET', 'CAKE', 'CTK', 'FORTUBE'],
    typeFixObj: {
        WETH: 0,
        UNI: 0,
        WBTC: 0,
        CRV: 2,
    },
    longMap: null,
    sellMap: null,
    buyMap: null,
    repriceMap: null,
    aboutInfoSell: null,
    myAboutInfoSell: null, // seller是我的 aboutInfoSell
    notExpriedAbountInfoSell: null, // 未过期的aboutInfoSell
    sellObj: null, // 已askID为key的sell列表对象
    aboutInfoBuy: null,
    myAboutInfoBuy: null, // buyer是我的 aboutInfoBuy
    aboutInfoBuySeller: null, // seller是我的 aboutInfoBuy （为了用在【出租订单】）
    totalInfo: null, //
    userInfo: {
        // 用户信息
        data: {
            isLogin: false,
            account: null,
            balace: '--',
        },
        status: 0,
    },
    hatList: [], // 矿工帽列表'
    walletType: '', // 钱包类型
    currentAllId: {
        currentClaimId: '', // 当前结算ID
        currentCancelId: '',
    },

    showDialog: {
        showMask: false,
        showPayaso: false,
    },
    assets: {
        validBorrowing: 0,
        totalHelmet: 0,
        balanceMine: 0,
        myPaya: 0,
        payaSettle: 0,
        claimAbleHelmet: 0,
    },
    DAI_ETH: 0,
    ETH_DAI_LPT: 0,
    myUNI: 0,
    myPAYA: 0,

    helmetVarieties: 0, // 已经成交的保险品种的种类
    totalHelmetsBorrowedVolume: 0, // 保险交易过的资金量  （保单数量累加， vol 用抵押物处理）
    longTokenCreatedVolume: 0, // 24小时Long token 铸造量
    approveList: {
        HELMET_BNB: false,
        BNB_HELMET: false,
        CAKE_BNB: false,
        BNB_CAKE: false,
        CTK_BNB: false,
        BNB_CTK: false,
        FOR_BNB: false,
        BNB_FOR: false,
    },
    dueDate: '2021-01-31 00:00',
    allIndexPrice: [
        {
            HELMET: 0,
            BNB: 0,
            CAKE: 0,
            FORTUBE: 0,
        },
        {
            HELMET: 0,
            BNB: 0,
            CAKE: 0,
            FORTUBE: 0,
        },
    ],
    allHelmetPrice: [
        {
            HELMET: 0,
            BNB: 0,
            CAKE: 0,
            FORTUBE: 0,
        },
        {
            HELMET: 0,
            BNB: 0,
            CAKE: 0,
            FORTUBE: 0,
        },
    ],
    BalanceArray: {},
});

export const mutations = {
    SET_LANG(state, locale) {
        if (state.locales.includes(locale)) {
            state.locale = locale;
        }
    },
    SET_LONG_MAP(state, data) {
        state.longMap = data;
    },
    SET_SELL_MAP(state, data) {
        state.sellMap = data;
    },
    SET_BUY_MAP(state, data) {
        state.buyMap = data;
    },
    SET_ABOUT_INFO_SELL(state, data) {
        state.aboutInfoSell = data.aboutInfoSell;
        state.myAboutInfoSell = data.myAboutInfoSell;
    },
    SET_NOT_EXPRIED_ABOUT_INFO_SELL(state, data) {
        state.notExpriedAbountInfoSell = data;
    },
    SET_SELL_OBJ(state, data) {
        state.sellObj = data;
    },
    SET_ABOUT_INFO_BUY(state, data) {
        state.aboutInfoBuy = data.aboutInfoBuy;
        state.myAboutInfoBuy = data.myAboutInfoBuy;
        state.aboutInfoBuySeller = data.aboutInfoBuySeller;
    },
    SET_TOTAL_INFO(state, data) {
        state.totalInfo = data;
    },
    SET_USER_INFO(state, data) {
        state.userInfo = data;
    },
    SET_HAT_LIST(state, data) {
        state.hatList = data;
    },
    SET_WALLET_RYPE(state, data) {
        state.walletType = data;
    },
    SET_CURRENT_ID(state, data) {
        state.currentAllId.currentClaimId = data.currentClaimId;
        state.currentAllId.currentCancelId = data.currentCancelId;
    },
    SET_MASK_DIALOG(state, data) {
        state.showDialog.showMask = data;
    },
    SET_PAYASO_DIALOG(state, data) {
        state.showDialog.showPayaso = data;
    },
    SET_ASSETS_VALUE(state, data) {
        if (data.frequency) {
            state.assets.validBorrowing = data.frequency;
        }
        if (data.totalHelmet) {
            state.assets.totalHelmet = data.totalHelmet;
        }
        if (data.balanceMine) {
            state.assets.balanceMine = data.balanceMine;
        }
        if (data.myPaya) {
            state.assets.myPaya = data.myPaya;
        }
        if (data.payaSettle) {
            state.assets.payaSettle = data.payaSettle;
        }
        if (data.claimAbleHelmet) {
            state.assets.claimAbleHelmet = data.claimAbleHelmet;
        }
    },
    SET_ETH_DAI_LPT(state, data) {
        state.ETH_DAI_LPT = data;
    },
    SET_DAI_ETH(state, data) {
        state.DAI_ETH = data;
    },
    SET_MY_UNI(state, data) {
        state.myUNI = data;
    },
    SET_MY_PAYA(state, data) {
        state.myPAYA = data;
    },
    SET_HELMET_VARIETIES(state, data) {
        // 将对应的key存进去
        state.helmetVarieties = data;
    },
    SET_TOTAL_HELMETS_BORROWED_VOLUME(state, data) {
        // 保险交易过的资金量  （保单数量累加， vol 用抵押物处理）
        state.totalHelmetsBorrowedVolume = data;
    },
    SET_LONG_TOKEN_CREATED_VOLUME(state, data) {
        // 24小时Long token 铸造量
        state.longTokenCreatedVolume = data;
    },
    // 授权列表
    SET_APPROVE_LIST(state, data) {
        state.approveList = data;
    },
    // 保存所有指数价格
    SET_ALL_INDEX_PRICE(state, data) {
        state.allIndexPrice = data;
    },
    SET_ALL_HELMET_PRICE(state, data) {
        state.allHelmetPrice = data;
    },
    // 存放余额
    SET_BALANCE(state, data) {
        state.BalanceArray = data;
    },
    SET_REPRICE_MAP(state, data) {
        state.repriceMap = data;
    },
};

export const actions = {
    // nuxtServerInit(store, {req}) {
    //   if (req.locale) {
    //     store.commit('SET_LANG', req.locale);
    //   }
    // },

    setLanguage({ commit }, data) {
        commit('SET_LANG', data);
    },
    setMaskDialog({ commit }, data) {
        commit('SET_MASK_DIALOG', data);
    },
    setPayasoDialog({ commit }, data) {
        commit('SET_PAYASO_DIALOG', data);
    },
    // 设置钱包类型
    setWalletType({ commit }, data) {
        commit('SET_WALLET_RYPE', data);
    },
    //设置当前结算ID
    setCurrentId({ commit }, data) {
        commit('SET_CURRENT_ID', data);
    },

    // 获取long, Sell, Buy映射
    setAllMap({ commit }) {
        // 创建long映射对象
        getOptionCreatedLog((err, data) => {
            if (err) {
                return;
            }
            let long_map = {};
            let resultItem;
            let _col;
            // 设置已经成交的保险品种的种类
            commit('SET_HELMET_VARIETIES', data.length);
            data.forEach((item) => {
                if (!item.returnValues.long) return;
                resultItem = item.returnValues;
                _col = newGetSymbol(resultItem._collateral, window.chainID);
                if (_col === 'USDT' || _col === 'USDC') {
                    // if (Number(resultItem._strikePrice) < Math.pow(10, 8)) return;
                    resultItem._strikePrice = String(
                        toRounding(
                            window.WEB3.utils.fromWei(
                                String(resultItem._strikePrice),
                                'mether'
                            ),
                            0
                        )
                    );
                    if (!Number(resultItem._strikePrice)) return;
                }
                if (Number(resultItem._strikePrice) > Math.pow(10, 30)) return;
                // long_map[item.returnValues.long] = item.returnValues;
                long_map[item.returnValues.long] = resultItem;
            });
            commit('SET_LONG_MAP', long_map);
        });
        // 创建Sell 映射对象
        getSellLog((err, data) => {
            if (err) {
                return;
            }
            let sell_map = {};
            data.forEach((item, index) => {
                sell_map[item.returnValues.long + index] = item.returnValues;
            });
            commit('SET_SELL_MAP', sell_map);
        });
        // 创建Buy 映射对象
        getBuyLog((err, data) => {
            if (err) {
                return;
            }
            let buy_map = {};
            data.forEach((item, index) => {
                buy_map[item.returnValues.askID + index] = item.returnValues;
            });
            commit('SET_BUY_MAP', buy_map);
        });
        // 创建修改价格 映射对象
        getRePrice((err, data) => {
            if (err) {
                return;
            }
            let reprice_map = [];
            data.forEach((item, index) => {
                reprice_map.push(item.returnValues);
            });
            commit('SET_REPRICE_MAP', reprice_map);
        });
        getMint((err, data) => {
            let longTokenCreatedVolume = 0;
            if (err) {
                return;
            }
            let last = data[data.length - 1].blockNumber;
            let h24 = 24 * 60 * 60;
            let _col;
            for (let i = 0; i < data.length; i++) {
                // if (last - data[i].blockNumber < h24) {
                _col = newGetSymbol(
                    data[i].returnValues._collateral,
                    window.chainID
                );
                longTokenCreatedVolume += Number(
                    fromWei(data[i].returnValues.vol, _col)
                );
                // }
            }

            commit('SET_LONG_TOKEN_CREATED_VOLUME', longTokenCreatedVolume);
        });
    },

    async mapAbountInfoSell({ commit, state }, data) {
        const longMap = state.longMap;
        const sellMap = state.sellMap;
        const aboutInfoSell = [];
        const myAboutInfoSell = [];
        const notExpiredAboutInfoSell = [];
        const sellObj = {}; // 以askID为key的sell对象 (用在获取mapAboutInfoBuy)
        let item;
        let longInfo;
        const createTime = new Date('2020-12-16').getTime() / 1000;
        const charID = await getID();
        const now = new Date().getTime() / 1000;
        const myAddress =
            state.userInfo.data &&
            state.userInfo.data.account &&
            state.userInfo.data.account.toLowerCase();
        for (let key in sellMap) {
            item = sellMap[key];
            longInfo = longMap[item.long];
            // 过滤垃圾数据
            // 过滤未创建settleable 之前的数据
            // if (!longInfo) return;
            // if (charID === 1 || (longInfo && parseInt(longInfo.count) >= 63 && parseInt(longInfo._expiry) >= createTime)) {
            if (
                Number(item.price) < Math.pow(10, 30) &&
                ((longInfo && charID === 1) ||
                    (longInfo && parseInt(longInfo._expiry) >= 1607997600))
            ) {
                aboutInfoSell.push({
                    ...item,
                    longInfo,
                });
                if (parseInt(longInfo._expiry) > now) {
                    notExpiredAboutInfoSell.push({
                        ...item,
                        longInfo,
                    });
                }
                if (item.seller.toLowerCase() === myAddress) {
                    myAboutInfoSell.push({
                        ...item,
                        longInfo,
                    });
                }
            }
            sellObj[item.askID] = {
                ...item,
                longInfo,
            };
        }
        commit('SET_ABOUT_INFO_SELL', { aboutInfoSell, myAboutInfoSell });
        commit('SET_SELL_OBJ', sellObj);
        commit('SET_NOT_EXPRIED_ABOUT_INFO_SELL', notExpiredAboutInfoSell); // 设置未过期的数据
    },

    async mapAboutInfoBuy({ commit, state }, data) {
        const charID = await getID();
        // const longMap = state.longMap;
        const sellObj = state.sellObj;
        const buyMap = state.buyMap;
        const aboutInfoBuy = [];
        const myAboutInfoBuy = [];
        const aboutInfoBuySeller = [];
        const myAddress =
            state.userInfo.data &&
            state.userInfo.data.account &&
            state.userInfo.data.account.toLowerCase();
        let item;
        let sellInfo;
        let totalHelmetsBorrowedVolume = 0; // 保险交易过的资金量  （保单数量累加， vol 用抵押物处理）
        const createTime = new Date('2020-10-16').getTime() / 1000;
        let _col;
        for (let key in buyMap) {
            item = buyMap[key];
            sellInfo = sellObj[item.askID];
            // 过滤垃圾数据
            // 过滤未创建settleable 之前的数据
            // 过滤数量为0的数据
            // 过滤时间戳过长的脏数据 (例如1603123200000000000000000000000)
            // if (charID === 1 || (sellInfo.longInfo && parseInt(sellInfo.longInfo.count) >= 63 && sellInfo.longInfo._expiry.length === 10 && parseInt(sellInfo.longInfo._expiry) >= createTime && parseInt(item.vol) !== 0)) {
            if (sellInfo.longInfo && sellInfo.longInfo._expiry.length === 10) {
                // totalHelmetsBorrowedVolume
                _col = newGetSymbol(
                    sellInfo.longInfo._collateral,
                    window.chainID
                );
                totalHelmetsBorrowedVolume += Number(fromWei(item.vol, _col));
            }
            if (
                charID === 1 ||
                (sellInfo.longInfo &&
                    sellInfo.longInfo._expiry.length === 10 &&
                    parseInt(sellInfo.longInfo._expiry) >= createTime &&
                    parseInt(item.vol) !== 0)
            ) {
                aboutInfoBuy.push({
                    ...item,
                    sellInfo,
                });

                if (item.buyer.toLowerCase() === myAddress) {
                    myAboutInfoBuy.push({
                        ...item,
                        sellInfo,
                    });
                }
                if (sellInfo.seller.toLowerCase() === myAddress) {
                    aboutInfoBuySeller.push({
                        ...item,
                        sellInfo,
                    });
                }
            }
        }

        commit('SET_ABOUT_INFO_BUY', {
            aboutInfoBuy,
            myAboutInfoBuy,
            aboutInfoBuySeller,
        });
        commit('SET_TOTAL_HELMETS_BORROWED_VOLUME', totalHelmetsBorrowedVolume);
    },

    async getCountByType({ commit, state }, data) {
        const aboutInfoSell = state.aboutInfoSell;
        let expiry;
        let current = new Date().getTime();
        let _col;
        let arr = [];
        aboutInfoSell.forEach((item) => {
            expiry = parseInt(item.longInfo._expiry) * 1000;
            // 今天之后过期的卖单
            if (expiry > current) {
                // 抵押品
                _col = newGetSymbol(item.longInfo._collateral, window.chainID);
                arr.push({
                    askID: item.askID,
                    volume: fromWei(item.volume, _col),
                    price: fromWei(item.price, _col),
                    // 标的物
                    _underlying: newGetSymbol(
                        item.longInfo._underlying,
                        window.chainID
                    ),
                    _collateral: _col,
                    // 行权价
                    _strikePrice: fromWei(item.longInfo._strikePrice, _col),
                    // 到期日
                    _expiry: expiry,
                });
            }
        });
        Promise.all(
            arr.map(async (item) => {
                const res = await asks(item.askID);
                return {
                    ...item,
                    remain: fromWei(res.remain, item.settleToken),
                };
            })
        ).then((res) => {
            let und_arr = [];
            let data_obj = {};
            res.forEach((item) => {
                let remain = mul(item.remain, item._strikePrice);
                let count = mul(item.volume, item._strikePrice);
                let min = accDiv(1, item._strikePrice);
                let max = accDiv(1, item._strikePrice);
                if (und_arr.includes(item._underlying)) {
                    data_obj[item._underlying] = {
                        remain: add(data_obj[item._underlying].remain, remain),
                        count: add(data_obj[item._underlying].count, count),
                        min:
                            min < data_obj[item._underlying].min
                                ? min
                                : data_obj[item._underlying].min,
                        max:
                            max > data_obj[item._underlying].max
                                ? max
                                : data_obj[item._underlying].max,
                    };
                } else {
                    data_obj[item._underlying] = {
                        remain,
                        count,
                        min,
                        max,
                    };
                    und_arr.push(item._underlying);
                }
            });
            commit('SET_TOTAL_INFO', data_obj);
        });
    },

    setUserInfo({ commit, state }, data) {
        commit('SET_USER_INFO', data);
    },
    // 有效成交
    async getValidBorrowing({ commit, state }, data) {
        let res = await frequency('HELMET');
        commit('SET_ASSETS_VALUE', { frequency: res });
    },
    //Helmet总发行量
    async getTotalHelmet({ commit, state }, data) {
        let res = await totalSupply('HELMET');
        commit('SET_ASSETS_VALUE', { totalHelmet: res });
    },
    //Helmet矿山余额
    async getBalanceMine({ commit, state }, data) {
        let res = await BalanceMine('HELMET', 'FARM');
        commit('SET_ASSETS_VALUE', { balanceMine: res });
    },
    // 可结算helmet
    async getClaimAbleHelmet({ commit, state }, data) {
        let res = await claimable(
            'ORDER',
            '0x0000000000000000000000000000000000000000'
        );
        commit('SET_ASSETS_VALUE', { claimAbleHelmet: res });
    },
    // 我的PAYA
    async getMyPayaso({ commit, state }, data) {
        let res = await MyPayaso('PAYA');
        commit('SET_ASSETS_VALUE', { myPaya: res });
    },
    // 待结算PAYA
    async getPayaSettle({ commit, state }, data) {
        let res = await claimable('PAYA');
        commit('SET_ASSETS_VALUE', { payaSettle: res });
    },
    async getmyPAYA({ commit }, data) {
        let res = await CangetPAYA(data);
        commit('SET_MY_PAYA', res);
    },
    async getmyUNI({ commit }, data) {
        let DAI = await CangetUNI('ETH_DAI');
        let USDT = await CangetUNI('ETH_USDT');
        let USDC = await CangetUNI('ETH_USDC');
        let WBTC = await CangetUNI('ETH_WBTC');
        let res = DAI + USDT + USDC + WBTC;
        commit('SET_MY_UNI', res);
    },
    // 获取矿工帽列表  und 抵押物， col 标的物
    async getHatList({ commit, state }) {
        const list = state.notExpriedAbountInfoSell || [];
        let item;
        const result = [];
        let status = '';
        let sort = 0;
        let _strikePrice;
        let resultItem;
        for (let i = 0; i < list.length; i++) {
            item = list[i];
            // 标的物
            const _collateral = getTokenName(item.longInfo._collateral);
            // 抵押物
            const _underlying = getTokenName(item.longInfo._underlying);
            // if (und && col) { // 抵押物，标的物双筛选
            let res = await asks(item.askID, 'sync', _collateral);
            // if (res === '0') {
            if (Number(res) == 0) {
                status = 'sellout';
                sort = 1;
            } else {
                status = 'onsell';
                sort = 2;
            }
            _strikePrice = fromWei(item.longInfo._strikePrice, _collateral);
            // _strikePrice = dealWithStrikePrice(_strikePrice, _collateral);
            resultItem = {
                askID: item.askID,
                seller: item.seller,
                long: item.long,
                _collateral,
                price: fromWei(item.price, _collateral),
                volume: fromWei(item.volume, _collateral),
                settleToken: getTokenName(item.settleToken),
                _underlying,
                _strikePrice,
                // _strikePrice: fromWei(
                //     item.longInfo._strikePrice,
                //     _collateral
                // ),
                _expiry: parseInt(item.longInfo._expiry * 1000),
                count: item.longInfo.count,
                remain: res,
                status,
                sort,
                buyNum: '',
            };
            result.push(resultItem);
        }
        const sortResult = JSON.parse(JSON.stringify(result)).sort((a1, a2) => {
            return a2.sort - a1.sort;
        });
        commit('SET_HAT_LIST', sortResult);
    },
};
