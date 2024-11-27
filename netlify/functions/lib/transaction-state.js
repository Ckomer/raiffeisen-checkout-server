const jws = require("jws");
const fs = require("fs");

const { ajax } = require("./utils/ajax");
const { ParamsError } = require("./utils/errors");
const { throwIfPaymentDataNotValid } = require("./utils/validations");
const { HOST_NAME } = require("./utils/constants");

/**
 *
 * @param {string|number} paymentInfo.MerchantID
 * @param {string} paymentInfo.TerminalID
 * @param {number} paymentInfo.PurchaseTime
 * @param {string} paymentInfo.OrderID
 * @param {string} paymentInfo.Currency
 * @param {number} paymentInfo.TotalAmount
 * @param {string} privateKeyPath
 * @param {string} hostname
 * @returns {Promise<any|Error>}
 */
const transactionState = (paymentInfo, privateKeyPath, hostname) => {
  return new Promise((resolve, reject) => {
    try {
      throwIfPaymentDataNotValid(paymentInfo);
      if (!privateKeyPath)
        throw new ParamsError(
          "privateKeyPath",
          "Path to private key not setted"
        );
      const private_key = fs.readFileSync(privateKeyPath, "utf-8");

      const signature = jws.sign({
        header: { alg: "RS256" },
        payload: paymentInfo,
        privateKey: private_key,
      });

      const [header, payload, Signature] = signature.split(".");

      ajax(
        {
          hostname: hostname || HOST_NAME,
          path: "/go/service/01",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
        JSON.stringify({ header, payload, Signature })
      )
        .then((data) => {
          const encoded = Buffer.from(data.data.payload, "base64").toString();
          resolve(JSON.parse(encoded));
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { transactionState };
