import {getWei} from '~/assets/utils/address-pool.js';

export const toWei = (number, currency = 'WETH') => {
    const unit = getWei(currency);
    let result;
    try {
       result = window.WEB3.utils.toWei(String(number), unit);
       if (currency !== 'WBTC') {
           return result;
       } else {
           return fromWei(result, 'gwei');
       }
    } catch (e) {
        console.log('toWei###Error###', e);
    }
};

export const fromWei = (number, currency = 'WETH') => {
    const unit = getWei(currency);
    let result;
    try {
        result = window.WEB3.utils.fromWei(String(number), unit);
        if (currency !== 'WBTC') {
          return result;
        } else {
          return toWei(result, 'gwei');
        }
    } catch (e) {
        console.log('fromWei###Error###', e);
    }
};
