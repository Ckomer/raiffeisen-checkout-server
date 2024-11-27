const {ParamsError} = require('./errors');

/**
 *
 * @param {string|number} paymentInfo.MerchantID
 * @param {string} paymentInfo.TerminalID
 * @param {number} paymentInfo.PurchaseTime
 * @param {string} paymentInfo.OrderID
 * @param {string} paymentInfo.Currency
 * @param {number} paymentInfo.TotalAmount
 * @returns {boolean|Error}
 */

function throwIfPaymentDataNotValid( paymentInfo) {
    const required = ['MerchantID', 'TerminalID', 'PurchaseTime', 'OrderID', 'Currency', 'TotalAmount'];

    if (!paymentInfo || typeof paymentInfo !== 'object') {
        throw new ParamsError(
            'paymentInfo',
          'signature require object params; see: https://docs.ecconnect.com.ua/display/DOCEN/Data+Signature'
        );
    }

    const errors = required.reduce((acc, cur) => {
        if (!paymentInfo[cur]) {
            acc.push(cur);
        }
        return acc;
    }, []);

    if (errors.length) {
        throw new ParamsError(
            'paymentInfo',
            `paymentInfo not present params: {${errors.join()}}; see: https://docs.ecconnect.com.ua/display/DOCEN/Data+Signature`
        );
    }

    if (!Number.isInteger(paymentInfo.TotalAmount) || paymentInfo.TotalAmount <= 0) {
        throw new ParamsError(
            'TotalAmount',
            `TotalAmount must be integer number and greater than 0; see: https://docs.ecconnect.com.ua/display/DOCEN/Data+Signature`
        );
    }

    if (!Number.isInteger(paymentInfo.PurchaseTime) || isNaN(new Date(paymentInfo.PurchaseTime).getTime())) {
        throw new ParamsError(
            'PurchaseTime',
            `PurchaseTime must be valid timestamp date; see: https://docs.ecconnect.com.ua/display/DOCEN/Data+Signature`
        );
    }

    return true;
}


module.exports = { throwIfPaymentDataNotValid };
