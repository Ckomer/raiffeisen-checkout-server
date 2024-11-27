const { cryptoSign } = require("./utils/crypto-sign");

/**
 * @param {{
 *          MerchantID: string, 
 *          TerminalID: string,
 *          PurchaseTime: number,
 *          OrderID: string,
 *          CurrencyID: string,
 *          TotalAmount: number,
 *          Delay: number
 *          }} params
 * @param {string} privateKeyPath
 * @returns {Promise<string|Error>}
 */

const paymentSign = (params, privateKeyPath) => {
  const {
    MerchantID,
    TerminalID,
    PurchaseTime,
    OrderID,
    CurrencyID,
    TotalAmount,
    Delay,
  } = params;
  const str = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID},${Delay};${CurrencyID};${TotalAmount};;`;

  return cryptoSign(str, privateKeyPath);
};


/**
 * @param {{
 *          MerchantID: string, 
 *          TerminalID: string,
 *          PurchaseTime: number,
 *          OrderID: string,
 *          CurrencyID: string,
 *          TotalAmount: number,
 *          }} params
 * @param {string} privateKeyPath
 * @returns {Promise<string|Error>}
 */

const recurrentPaymentSign = (params, privateKeyPath) => {
    const {
        MerchantID,
        TerminalID,
        PurchaseTime,
        OrderID,
        CurrencyID,
        TotalAmount,
        SessionData=''
    } = params;

    const str = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID};${CurrencyID};${TotalAmount};${SessionData};true;`;

    return cryptoSign(str, privateKeyPath);
};


/**
 * @param {{
 *          MerchantID: string, 
 *          TerminalID: string,
 *          PurchaseTime: number,
 *          OrderID: string,
 *          CurrencyID: string,
 *          TotalAmount: number,
 *          ApprovalCode: string,
 *          RRN: string,
 *          Ref3?: string,
 *          RefundAmount?: number
 *          }} params
 * @param {string} privateKeyPath
 * @returns {Promise<string|Error>}
 */

const reversalPaymentSign = (params, privateKeyPath) => {
    const {
        MerchantID,
        TerminalID,
        PurchaseTime,
        OrderID,
        CurrencyID,
        TotalAmount,
        SessionData='',
        ApprovalCode,
        RRN,
        Ref3='',
        RefundAmount= ''
    } = params;

    let str = '';

    if(Ref3){
        str = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID};${CurrencyID};${TotalAmount};${SessionData};${ApprovalCode};${RRN};${Ref3};`;
    } else if(RefundAmount) {
        str = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID};${CurrencyID};${TotalAmount};${SessionData};${ApprovalCode};${RRN};${RefundAmount};`;
    } else {
        str = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID};${CurrencyID};${TotalAmount};${SessionData};${ApprovalCode};${RRN};`;
    }
    return cryptoSign(str, privateKeyPath);
}


/**
 * @param {{
 *          MerchantID: string, 
 *          TerminalID: string,
 *          PurchaseTime: number,
 *          OrderID: string,
 *          CurrencyID: string,
 *          TotalAmount: number
 *          }} params
 * @param {string} privateKeyPath
 * @returns {Promise<string|Error>}
 */

const preAuthorizationSign = (params, privateKeyPath) => {
    const {
        MerchantID,
        TerminalID,
        PurchaseTime,
        OrderID,
        CurrencyID,
        TotalAmount,
        SessionData=''
    } = params;

    const str = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID};1;${CurrencyID};${TotalAmount};${SessionData};true;`;

    return cryptoSign(str, privateKeyPath);
}

module.exports = { paymentSign, recurrentPaymentSign, reversalPaymentSign, preAuthorizationSign };
