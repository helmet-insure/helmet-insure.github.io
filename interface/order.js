// import {web3} from '~/assets/utils/web3-obj.js';
import { Factory, Order, expERC20 } from './index';
import {
    getAddress,
    getContract,
    getWei,
    getID,
    getStrikePriceFix,
    getWeiWithFix,
} from '~/assets/utils/address-pool.js';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import precision from '~/assets/js/precision.js';
import { fixD, toRounding } from '~/assets/js/util.js';
import bus from '~/assets/js/bus';
import Notification from '~/components/common/Notification';
import Message from '~/components/common/Message';

const netObj = {
    1: '',
    3: 'ropsten.',
    4: 'rinkeby.',
    56: 'BSC',
};
// 翻倍
export const onIssueSell = async (data_, callBack) => {
    let data = { ...data_ };
    data.category = getAddress(data.category);
    data.currency = getAddress(data.currency);
    data.settleToken = getAddress(data.settleToken);
    let cwei = getWei(data.currency);
    let fix = cwei === 'lovelace' ? 6 : 18;
    data.expire = new Date(data.expire).getTime();
    data.expire = parseInt(precision.divide(data.expire, 1000));

    let volume = toWei(data_.volume, data_.currency);
    data.volume = volume;

    let priceFix = getStrikePriceFix(data_.currency, data_.category);
    let priceUnit = getWeiWithFix(priceFix);
    let price = fixD(data.price, priceFix);
    data.total = toWei(precision.times(data_.price, data_.volume), priceFix);
    price = window.WEB3.utils.toWei(String(price), priceUnit);
    data.price = price;

    let premiumFix = getStrikePriceFix(data_.currency, data_.category);
    let premiumUnit = getWeiWithFix(premiumFix);
    let premium = fixD(
        precision.divide(data_.premium, data_.volume),
        premiumFix
    );
    premium = window.WEB3.utils.toWei(String(premium), premiumUnit);
    data.premium = premium;
    bus.$emit('OPEN_STATUS_DIALOG', {
        type: 'pending',
        // 租用 0.5 个WETH 帽子，执行价格为300 USDT
        conText: `<p>Rent <span>${data_.volume} ${data_.currency}</span>, the execution price is <span>${data_.price} ${data_.category}</span></p>`,
    });
    console.log(data);
    try {
        const Contract = await expERC20(data.currency);
        // 一键判断是否需要授权，给予无限授权
        await oneKeyArrpove(Contract, 'ORDER', data.total, callBack);

        const orderContract = await Order();
        orderContract.methods
            .sell(
                false,
                data.currency, // 抵押物 DAI
                data.category, // 保险品类 WETH
                data.price, // 触发保险金额 抵押物单位   // 1/200
                // toWei("0.00651728", 6),
                data.expire,
                data.volume, // 200
                data.settleToken, // 支付货币
                data.premium // 单价
            )
            .send({ from: window.CURRENTADDRESS })
            .on('transactionHash', function(hash) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                bus.$emit('OPEN_STATUS_DIALOG', {
                    type: 'submit',
                    conText: `<a href="https://bscscan.com/tx/${hash}" target="_blank">View on BscScan</a>`,
                });
            })
            // .on('receipt', function(receipt){
            //     console.log('methods.sell##receipt###', receipt, '###时间###',new Date());
            // })
            .on('confirmation', function(confirmationNumber, receipt) {
                if (confirmationNumber === 0) {
                    if (window.statusDialog) {
                        bus.$emit('CLOSE_STATUS_DIALOG');
                        bus.$emit('OPEN_STATUS_DIALOG', {
                            type: 'success',
                            title: 'Successfully rented',
                            conTit:
                                '<div>The rental advertisement is published successfully, you can check it on <a href="/sell" target="blank">my rental advertisement page</a></div>',
                            conText: `<a href="https://bscscan.com/tx/${receipt.transactionHash}" target="_blank">View on BscScan</a>`,
                        });
                    } else {
                        Message({
                            message:
                                'The rental advertisement is published successfully',
                            type: 'success',
                            // duration: 0,
                        });
                    }
                    setTimeout(() => {
                        bus.$emit('REFRESH_ALL_DATA');
                        bus.$emit('REFRESH_BALANCE');
                    }, 1000);
                }
            })
            .on('error', function(error, receipt) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                if (error && error.message) {
                    Message({
                        message: error && error.message,
                        type: 'error',
                    });
                }
            });
    } catch (error) {
        console.log('onIssueSell', error);
    }
};
// 腰斩
export const onIssueSellOnETH = async (data_, callBack) => {
    let data = { ...data_ };
    data.category = getAddress(data.category);
    data.currency = getAddress(data.currency);
    data.settleToken = getAddress(data.settleToken);
    let cwei = getWei(data.currency);
    let fix = cwei === 'lovelace' ? 6 : 18;
    // let fix = 18;
    data.expire = new Date(data.expire).getTime();
    data.expire = parseInt(precision.divide(data.expire, 1000));
    data.total = toWei(
        precision.times(data.price, data.volume),
        data_.currency
    );
    // let premium = fixD(precision.divide(data.premium, data.price), 18);
    let premium = fixD(precision.divide(data.premium, data.volume), 18);
    // premium = toWei(premium, data_.currency);
    premium = toWei(premium);
    data.premium = premium;
    // let volume = fixD(precision.times(data.volume, data.price), fix);
    let volume = toWei(data_.volume, data_.currency);
    // volume = toWei(volume);
    data.volume = volume;

    let priceFix = getStrikePriceFix(data_.category, data_.currency);
    let priceUnit = getWeiWithFix(priceFix);
    // let price = fixD(precision.divide(1, data.price), fix);
    let price = fixD(precision.divide(1, data.price), priceFix);
    // price = toWei(price, data_.currency);
    price = window.WEB3.utils.toWei(String(price), priceUnit);
    // window.WEB3.utils.toWei(String(number), unit);
    data.price = price;

    bus.$emit('OPEN_STATUS_DIALOG', {
        type: 'pending',
        // 租用 0.5 个WETH 帽子，执行价格为300 USDT
        conText: `<p>Rent <span>${data_.volume} ${data_.category}</span>, the execution price is <span>${data_.price} ${data_.currency}</span></p>`,
    });
    try {
        const Contract = await expERC20(data.currency);
        // 一键判断是否需要授权，给予无限授权
        await oneKeyArrpove(Contract, 'ORDER', data.total, callBack);

        const orderContract = await Order();
        orderContract.methods
            .sellOnETH(
                false,
                // data.currency, // 抵押物 DAI
                data.category, // 保险品类 WETH
                data.price, // 触发保险金额 抵押物单位   // 1/200
                data.expire,
                // data.volume, // 200
                data.settleToken, // 支付货币
                data.premium // 单价
            )
            .send({ from: window.CURRENTADDRESS, value: data.volume })
            .on('transactionHash', function(hash) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                bus.$emit('OPEN_STATUS_DIALOG', {
                    type: 'submit',
                    conText: `<a href="https://bscscan.com/tx/${hash}" target="_blank">View on BscScan</a>`,
                });
            })
            // .on('receipt', function(receipt){
            //     console.log('methods.sell##receipt###', receipt, '###时间###',new Date());
            // })
            .on('confirmation', function(confirmationNumber, receipt) {
                if (confirmationNumber === 0) {
                    if (window.statusDialog) {
                        bus.$emit('CLOSE_STATUS_DIALOG');
                        bus.$emit('OPEN_STATUS_DIALOG', {
                            type: 'success',
                            title: 'Successfully rented',
                            conTit:
                                '<div>The rental advertisement is published successfully, you can check it on <a href="/sell" target="blank">my rental advertisement page</a></div>',
                            conText: `<a href="https://bscscan.com/tx/${receipt.transactionHash}" target="_blank">View on BscScan</a>`,
                        });
                    } else {
                        Message({
                            message:
                                'The rental advertisement is published successfully',
                            type: 'success',
                            // duration: 0,
                        });
                    }
                    setTimeout(() => {
                        bus.$emit('REFRESH_ALL_DATA');
                        bus.$emit('REFRESH_BALANCE');
                    }, 1000);
                }
            })
            .on('error', function(error, receipt) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                if (error && error.message) {
                    Message({
                        message: error && error.message,
                        type: 'error',
                    });
                }
            });
    } catch (error) {
        console.log('onIssueSellOnETH', error);
    }
};
// 翻倍
export const buyInsuranceBuy = async (_data, callBack) => {
    // 是的，不过价格是两个资产的比值，它的精度应该是两个token的精度的差
    // 两个精度的差，可能是负数，因此，再加个18位精度
    // 比如 WETH/DAI，两者精度都是18，那么价格的精度就是18-18+18=18
    // USDT/USDT，精度=6-6+18=18  在抵押物和结算物相同时，总是18
    let data = { ..._data };

    // const WEB3 = new web3();
    const charID = window.chainID;
    data.settleToken = getAddress(data.settleToken, charID);
    let cwei = getWei(data.settleToken);
    let fix = cwei === 'lovelace' ? 6 : 18;
    // let fix = 18;
    let payPrice = fixD(
        precision.times(
            precision.divide(_data.volume, _data._strikePrice),
            _data.price
        ),
        fix
    );
    payPrice = toWei(payPrice);
    data.payPrice = payPrice;
    // data.payPrice = window.WEB3.utils.toWei(
    //   (data.volume / data._strikePrice) * data.price + "",
    //   getWei(data.settleToken)
    // );
    // let volume = fixD(precision.divide(data.volume, data._strikePrice), fix);
    let volume = toWei(_data.volume, _data._collateral);
    // volume = toWei(volume);
    data.volume = volume;
    let pay = precision.times(_data._strikePrice, _data.volume);

    data.pay = toWei(pay, _data.settleToken);
    // data.volume = window.WEB3.utils.toWei(
    //   data.volume / data._strikePrice + "",
    //   getWei(data.settleToken)
    // );
    // console.log('data.volume####', data.volume);
    // return;
    const Contract = await expERC20(data.settleToken);
    bus.$emit('OPEN_STATUS_DIALOG', {
        type: 'pending',
        conText: `<p>Rent <span>${_data.volume} ${_data._underlying}
    </span> hats, the Premium is <span>
    ${_data.price * _data.volume} ${_data._collateral}
    </span></p>`,
    });
    // return;
    try {
        // 一键判断是否需要授权，给予无限授权
        await oneKeyArrpove(Contract, 'ORDER', data.payPrice, callBack);
        const orderContract = await Order();
        orderContract.methods
            .buy(data.askID, data.volume)
            .send({ from: window.CURRENTADDRESS })
            .on('transactionHash', function(hash) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                bus.$emit('OPEN_STATUS_DIALOG', {
                    type: 'submit',
                    conText: `<a href="https://bscscan.com/tx/tx/${hash}" target="_blank">View on BscScan</a>`,
                });
            })
            // .on('receipt', function(receipt){
            //     console.log('methods.sell##receipt###', receipt, '###时间###',new Date());
            // })
            .on('confirmation', function(confirmationNumber, receipt) {
                if (confirmationNumber === 0) {
                    if (window.statusDialog) {
                        bus.$emit('CLOSE_STATUS_DIALOG');
                        bus.$emit('OPEN_STATUS_DIALOG', {
                            type: 'success',
                            title: 'Successfully rented',
                            conTit:
                                '<div>The hat is rented successfully, please check <a href="/buy" target="blank">the hat I rented</a></div>',
                            conText: `<a href="https://bscscan.com/tx/${receipt.transactionHash}" target="_blank">View on BscScan</a>`,
                        });
                    } else {
                        Message({
                            message: 'The hat is rented successfully',
                            type: 'success',
                            // duration: 0,
                        });
                    }
                    setTimeout(() => {
                        bus.$emit('REFRESH_ALL_DATA');
                        bus.$emit('REFRESH_BALANCE');
                    }, 1000);
                }
            })
            .on('error', function(error, receipt) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                if (error && error.message) {
                    Message({
                        message: error && error.message,
                        type: 'error',
                        // duration: 0,
                    });
                }
            });
        // .on('transactionHash', hash => {
        //     callBack('pending')
        //     //onChangeHash(hash);
        // })
        // .on('confirmation', (_, receipt) => {
        //     callBack('success')
        //     //onReceiptChange(receipt);
        // })
        // .on('error', (err, receipt) => {
        //     callBack('failed')
        //     //onReceiptChange(receipt);
        // })
    } catch (error) {}
};
export const getSellLog = async (callback) => {
    Order().then((contract) => {
        contract.getPastEvents(
            'Sell',
            {
                fromBlock: 0,
                toBlock: 'latest',
            },
            (error, events) => {
                callback(error, events);
            }
        );
    });
};

export const getRePrice = async (callback) => {
    Order().then((contract) => {
        contract.getPastEvents(
            'Reprice',
            {
                fromBlock: 0,
                toBlock: 'latest',
            },
            (error, events) => {
                callback(error, events);
            }
        );
    });
};

export const getOptionCreatedLog = async (callback) => {
    return Factory().then((contract) => {
        contract.getPastEvents(
            'OptionCreated',
            {
                fromBlock: 0,
                toBlock: 'latest',
            },
            (error, events) => {
                callback(error, events);
            }
        );
    });
};

export const getBuyLog = async (callback) => {
    Order().then((contract) => {
        contract.getPastEvents(
            'Buy',
            {
                fromBlock: 0,
                toBlock: 'latest',
            },
            (error, events) => {
                callback(error, events);
            }
        );
    });
};

export const getExercise = async (buyer) => {
    const contract = await Order();
    if (!buyer) {
        return [];
    }
    const list = await contract.getPastEvents('Exercise', {
        filter: { buyer: buyer },
        // fromBlock: 8889011,
        fromBlock: 0,
        toBlock: 'latest',
    });
    return list;
};

export const getMint = async (callback) => {
    Factory().then((contract) => {
        contract.getPastEvents(
            'Mint',
            {
                fromBlock: 0,
                toBlock: 'latest',
            },
            (error, events) => {
                // callback(error, events);
            }
        );
    });
};

export const getWaive = async (buyer) => {
    const contract = await Order();
    if (!buyer) {
        return [];
    }
    const list = await contract.getPastEvents('Waive', {
        filter: { buyer: buyer },
        fromBlock: 0,
        toBlock: 'latest',
    });
    return list;
};

export const asks = async (askID, type = 'default', token = 'ether') => {
    // const WEB3 = await web3();
    // console.log(askID)
    if (!askID) return 0;
    const order = await Order();
    if (type === 'default') {
        return order.methods.asks(askID).call();
    }
    const res = await order.methods.asks(askID).call();

    return fromWei(res.remain, token);
};
export const claim = async () => {
    const order = await Order();
    let result;
    if (!window.CURRENTADDRESS) {
        return;
    }
    try {
        order.methods
            .claim()
            .send({ from: window.CURRENTADDRESS })
            .on('transactionHash', function(hash) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                bus.$emit('OPEN_STATUS_DIALOG', {
                    type: 'submit',
                    conText: `https://bscscan.com/tx/${hash}" target="_blank">View on BscScan</a>`,
                });
            })
            .on('confirmation', function(confirmationNumber, receipt) {
                if (confirmationNumber === 0) {
                    if (window.statusDialog) {
                        ``;
                        bus.$emit('CLOSE_STATUS_DIALOG');
                        bus.$emit('OPEN_STATUS_DIALOG', {
                            type: 'success',
                            title: 'Successfully rented',
                            conTit: '<div>Hat activated successfully</div>',
                            conText: `<a href="https://bscscan.com/tx/${receipt.transactionHash}" target="_blank">View on BscScan</a>`,
                        });
                    } else {
                        Message({
                            message: 'Hat activated successfully',
                            type: 'success',
                        });
                    }
                    setTimeout(() => {
                        bus.$emit('REFRESH_ASSETS');
                    }, 1000);
                }
            })
            .on('error', function(error, receipt) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                if (error && error.message) {
                    Message({
                        message: error && error.message,
                        type: 'error',
                    });
                }
            });
    } catch (error) {
        console.log(error);
    }
    return result;
};
// 有效交易总量
export const frequency = async (address) => {
    let charID = window.charID;
    let adress = address;
    if (adress.indexOf('0x') === -1) {
        adress = getContract(address, charID);
    }
    const order = await Order();
    if (!adress) {
        return 0;
    }
    return order.methods
        .frequency()
        .call()
        .then((res) => {
            let tocurrcy = adress;
            return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
        });
};

export const bids = async (bidID, type = 'default', token = 'default') => {
    // const WEB3 = await web3();
    // console.log(bidID)
    if (!bidID) return 0;
    const order = await Order();
    if (type === 'sync') {
        const res = await order.methods.bids(bidID).call();
        return window.WEB3.utils.fromWei(res.remain, getWei(token));
    }

    return order.methods.bids(bidID).call();
};

export const getMySellLog = async (callback) => {};

export const getBalance = async (type, currcy) => {
    // const WEB3 = await web3();
    // const charID = await getID();
    const charID = window.chainID;
    let adress = type;
    if (type.indexOf('0x') === -1) {
        adress = getAddress(type, charID);
    }
    if (!adress || !window.CURRENTADDRESS) {
        // bus.$emit("REFRESH_BALANCE");
        return 0;
    }
    const contract = await expERC20(adress);
    return contract.methods
        .balanceOf(window.CURRENTADDRESS)
        .call()
        .then((res) => {
            let tocurrcy = currcy || type;
            return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
        });
};
export const totalSupply = async (address) => {
    const charID = window.chainID;
    let adress = address;
    if (address.indexOf('0x') === -1) {
        adress = getContract(address, charID);
    }
    if (!adress) {
        return 0;
    }
    const Contract = await expERC20(adress);
    return Contract.methods
        .totalSupply()
        .call()
        .then((res) => {
            let tocurrcy = adress;
            return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
        });
};
export const BalanceMine = async (address1, address2) => {
    const charID = window.chainID;
    let adress1 = address1;
    let adress2 = address2;
    if (address1.indexOf('0x') === -1) {
        adress1 = getContract(address1, charID);
    }
    if (address2.indexOf('0x') === -1) {
        adress2 = getContract(address2, charID);
    }
    if (!adress1 || !adress2) {
        return 0;
    }
    const contract = await expERC20(adress1);
    return contract.methods
        .balanceOf(adress2)
        .call()
        .then((res) => {
            let tocurrcy = address1;
            return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
        });
};
export const claimable = async (address1, address2) => {
    const charID = window.chainID;
    let adress1 = address1;
    if (address1.indexOf('0x') === -1) {
        adress1 = getContract(address1, charID);
    }
    if (!adress1 || (!address2 && !window.CURRENTADDRESS)) {
        return 0;
    }
    const order = await Order(adress1);
    return order.methods
        .claimable(address2 || window.CURRENTADDRESS)
        .call()
        .then((res) => {
            let tocurrcy = address1;
            return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
        });
};

export const MyPayaso = async (address1) => {
    const charID = window.chainID;
    let adress = address1;
    if (address1.indexOf('0x') === -1) {
        adress = getContract(address1, charID);
    }
    if (!adress || !window.CURRENTADDRESS) {
        return 0;
    }
    const contract = await expERC20(adress);
    return contract.methods
        .balanceOf(window.CURRENTADDRESS)
        .call()
        .then((res) => {
            let tocurrcy = address1;
            return window.WEB3.utils.fromWei(res, getWei(tocurrcy));
        });
};
export const onExercise = async (data, callBack) => {
    console.log(data);
    bus.$emit('OPEN_STATUS_DIALOG', {
        type: 'pending',
        // your will swap XXX wBNB to XXXX Helmet/
        // 租用 0.5 个WETH 帽子，执行价格为300 USDT
        conText: `<p>your will swap<span> ${toRounding(
            data._underlying_vol,
            4
        )} ${data._underlying}</span> to <span> ${data.vol} ${
            data._collateral
        }</span></p>`,
    });
    bus.$emit('ONEXERCISE_PENDING', data.bidID);

    // const WEB3 = await web3();
    const charID = window.chainID;
    let adress = getAddress(data.token, charID);

    const Contract = await expERC20(adress);
    const long = await expERC20(data.long);
    const order = await Order();

    // 一键判断是否需要授权，给予无限授权
    await oneKeyArrpove(Contract, 'ORDER', 100000, (res) => {
        if (res === 'failed') {
            bus.$emit('CLOSE_STATUS_DIALOG');
            bus.$emit('ONEXERCISE_END', data.bidID);
        }
    });
    await oneKeyArrpove(long, 'ORDER', 100000, (res) => {
        if (res === 'failed') {
            bus.$emit('CLOSE_STATUS_DIALOG');
            bus.$emit('ONEXERCISE_END', data.bidID);
        }
    });

    order.methods
        .exercise(data.bidID)
        .send({ from: window.CURRENTADDRESS })
        .on('transactionHash', function(hash) {
            bus.$emit('CLOSE_STATUS_DIALOG');
            bus.$emit('OPEN_STATUS_DIALOG', {
                type: 'submit',
                conText: `<a href="https://bscscan.com/tx/${hash}" target="_blank">View on BscScan</a>`,
            });
        })
        // .on('receipt', function(receipt){
        //     console.log('methods.sell##receipt###', receipt, '###时间###',new Date());
        // })
        .on('confirmation', function(confirmationNumber, receipt) {
            if (confirmationNumber === 0) {
                if (window.statusDialog) {
                    bus.$emit('CLOSE_STATUS_DIALOG');
                    bus.$emit('OPEN_STATUS_DIALOG', {
                        type: 'success',
                        title: 'Successfully rented',
                        conTit: '<div>Activated successfully</div>',
                        conText: `<a href="https://bscscan.com/tx/${receipt.transactionHash}" target="_blank">View on BscScan</a>`,
                    });
                } else {
                    Message({
                        message: 'Activated successfully',
                        type: 'success',
                        // duration: 0,
                    });
                }
                setTimeout(() => {
                    bus.$emit('REFRESH_ALL_DATA');
                    bus.$emit('ONEXERCISE_END', data.bidID);
                }, 1000);
            }
        })
        .on('error', function(error, receipt) {
            bus.$emit('CLOSE_STATUS_DIALOG');
            bus.$emit('ONEXERCISE_END', data.bidID);
            if (error && error.message) {
                Message({
                    message: error && error.message,
                    type: 'error',
                    // duration: 0,
                });
            }
        });
    // .on('transactionHash', (hash) => {
    //   callBack('approve');
    //   //onChangeHash(hash);
    // })
    // .on('confirmation', (_, receipt) => {
    //   callBack('success');
    //   //onReceiptChange(receipt);
    // })
    // .on('error', (err, receipt) => {
    //   callBack('failed');
    //   //onReceiptChange(receipt);
    // });
};

const allowance = async (token_exp, contract_str) => {
    // const WEB3 = await web3();
    const charID = await getID();
    const result = await token_exp.methods
        .allowance(
            window.CURRENTADDRESS,
            getContract(contract_str, window.chainID)
        )
        .call({ from: window.CURRENTADDRESS });

    return window.WEB3.utils.fromWei(result, getWei());
};

const approve = async (token_exp, contract_str, callback = (status) => {}) => {
    // const WEB3 = await web3();
    const charID = await getID();
    const result = await token_exp.methods
        .approve(
            getContract(contract_str, charID),
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        )
        .send({ from: window.CURRENTADDRESS })
        .on('transactionHash', (hash) => {
            callback('approve');
        })
        .on('confirmation', (_, receipt) => {
            callback('success');
        })
        .on('error', (err, receipt) => {
            callback('failed');
        });
    return result;
};

// 一键授权
const oneKeyArrpove = async (token_exp, contract_str, num, callback) => {
    // 校验参数
    if (!token_exp || !contract_str) return;
    // 判断授权额度是否充足
    const awc = await allowance(token_exp, contract_str);
    if (parseInt(awc) > parseInt(num)) {
        // console.log("额度充足", parseInt(awc));
        return;
    }
    // 无限授权
    const res = await approve(token_exp, contract_str, callback);
};

export const onCancel = async (askID, callBack) => {
    // const WEB3 = await web3();
    const order = await Order();
    if (!window.CURRENTADDRESS) {
        return;
    }
    order.methods
        .cancel(askID)
        .send({ from: window.CURRENTADDRESS })
        .on('transactionHash', (hash) => {
            callBack('approve');
            //onChangeHash(hash);
        })
        .on('confirmation', (_, receipt) => {
            callBack('success');
            //onReceiptChange(receipt);
        })
        .on('error', (err, receipt) => {
            callBack('failed');
            //onReceiptChange(receipt);
        });
};

export const onWaive = async (data) => {
    bus.$emit('ONWAIVE_PENDING', data.bidID);
    const charID = window.chainID;
    // let adress = getAddress(data._underlying, charID);
    // const Contract = await expERC20(adress);
    const long = await expERC20(data.long);
    const order = await Order();

    // 一键判断是否需要授权，给予无限授权
    // await oneKeyArrpove(Contract, "ORDER", 100000, (res) => {
    //   if (res === "failed") {
    //     bus.$emit("ONWAIVE_END", data.bidID);
    //   }
    // });
    await oneKeyArrpove(long, 'ORDER', 100000, (res) => {
        if (res === 'failed') {
            bus.$emit('ONWAIVE_END', data.bidID);
        }
    });

    // const order = await Order();
    order.methods
        .waive(data.bidID)
        .send({ from: window.CURRENTADDRESS })
        .on('transactionHash', (hash) => {})
        .on('confirmation', (confirmationNumber, receipt) => {
            if (confirmationNumber === 0) {
                setTimeout(() => {
                    bus.$emit('REFRESH_ALL_DATA');
                    bus.$emit('ONWAIVE_END', data.bidID);
                }, 1000);
            }
        })
        .on('error', (err, receipt) => {
            bus.$emit('ONWAIVE_END', data.bidID);
        });
};

export const RePrice = async (data) => {
    const charID = window.chainID;
    let askID = data.id;
    let price;
    if (data._underlying == 'WBNB') {
        let premiumFix = getStrikePriceFix(data._collateral, data._underlying);
        let premiumUnit = getWeiWithFix(premiumFix);
        price = window.WEB3.utils.toWei(String(data.price), premiumUnit);
        data.price = price;
    }
    const order = await Order();
    if (!window.CURRENTADDRESS) {
        return;
    }
    order.methods
        .reprice(askID, price)
        .send({ from: window.CURRENTADDRESS })
        .on('transactionHash', (hash) => {
            bus.$emit('CLONE_REPRICE');
            //onChangeHash(hash);
        })
        .on('confirmation', (_, receipt) => {
            //onReceiptChange(receipt);
        })
        .on('error', (err, receipt) => {
            bus.$emit('CLONE_REPRICE');
            //onReceiptChange(receipt);
        });
};
