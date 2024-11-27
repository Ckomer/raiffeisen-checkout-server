const crypto = require('crypto');
const fs = require('fs');

const {ParamsError} = require('./utils/errors');
const {throwIfPaymentDataNotValid} = require('./utils/validations');

/**
 *
 * @param {string|number} paymentInfo.MerchantID
 * @param {string} paymentInfo.TerminalID
 * @param {number} paymentInfo.PurchaseTime
 * @param {string} paymentInfo.OrderID
 * @param {string} paymentInfo.Currency
 * @param {number} paymentInfo.TotalAmount
 * @param {string} privateKeyPath
 * @returns {Promise<string|Error>}
 */

const signature = ({
                     MerchantID,
                     TerminalID,
                     PurchaseTime,
                     OrderID,
                     Currency,
                     TotalAmount
                   } = paymentInfo, privateKeyPath) => {

  return new Promise((resolve, reject) => {
    try {
      throwIfPaymentDataNotValid({
        MerchantID,
        TerminalID,
        PurchaseTime,
        OrderID,
        Currency,
        TotalAmount
      });

      if (!privateKeyPath) throw new ParamsError('privateKeyPath', 'Path to private key not setted');


      const private_key = fs.readFileSync(privateKeyPath, 'utf-8');
      const data = `${MerchantID};${TerminalID};${PurchaseTime};${OrderID};${Currency};${TotalAmount};;`;

      const signer = crypto.createSign('SHA256');
      signer.update(data);
      signer.end();

      const signature = signer.sign(private_key);
      const buff = Buffer.from(signature);
      const base64data = buff.toString('base64');

      resolve(base64data);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {signature};
