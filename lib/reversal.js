const querystring = require("querystring");

const { ajax } = require("./utils/ajax");
const { HOST_NAME } = require("./utils/constants");
const { ParamsError } = require("./utils/errors");
const { reversalPaymentSign } = require("./Sign");

const reversal = (paymentInfo, privateKeyPath, hostname) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!privateKeyPath) {
        throw new ParamsError(
          "privateKeyPath",
          "Path to private key not setted"
        );
      }
      const data = querystring.stringify({
        ...paymentInfo,
        Signature: await reversalPaymentSign(paymentInfo, privateKeyPath),
      });

      ajax(
        {
          hostname: hostname || HOST_NAME,
          path: "/go/repayment",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(data),
          },
        },
        data
      )
        .then((data) => {
          resolve(data.data);
        })
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { reversal };
