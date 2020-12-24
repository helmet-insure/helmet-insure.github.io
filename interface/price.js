import { expERC20, Payaso } from './index';
import bus from '~/assets/js/bus';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import Message from '~/components/common/Message';
import {
    getAddress,
    getContract,
    getWei,
} from '~/assets/utils/address-pool.js';
export const getBalance = async (address1, address2) => {
    const charID = window.chainID;
    let adress1 = address1;
    let adress2 = address2;
    if (adress1.indexOf('0x') === -1) {
        adress1 = getAddress(address1, charID);
    }
    if (adress2.indexOf('0x') === -1) {
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
export const getProgess = async () => {
    const contract = await Payaso();
    return contract.methods
        .getProgess()
        .call()
        .then((res) => {
            return window.WEB3.utils.fromWei(res, getWei('BNB'));
        });
};
export const recruit = async (address, num) => {
    const charID = window.chainID;
    let adress = address;
    if (adress.indexOf('0x') === -1) {
        adress = getContract(address, charID);
    }
    let volume = toWei(Number(num), 'BNB');
    try {
        const contract = await Payaso();
        console.log(contract);
        return contract.methods
            .recruit()
            .send({ from: window.CURRENTADDRESS, value: volume })
            .on('transactionHash', function(hash) {
                bus.$emit('CLOSE_STATUS_DIALOG');
                bus.$emit('OPEN_STATUS_DIALOG', {
                    type: 'submit',
                    conText: `<a href="https://bscscan.com/tx/${hash}" target="_blank">View on BscScan</a>`,
                });
            })
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
                        bus.$emit('GET_BALANCE');
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
    } catch (error) {}
};
