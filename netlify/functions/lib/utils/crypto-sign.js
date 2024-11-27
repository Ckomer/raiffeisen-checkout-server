const crypto = require("crypto");
const fs = require("fs");
/**
 * @param  {string} str=""
 * @param  {string} privateKeyPath=""
 * @returns {Promise<string|Error>}
 */

const cryptoSign = (str = "", privateKeyPath = "") => {
  return new Promise((resolve, reject) => {
    try {
      const private_key = fs.readFileSync(privateKeyPath, "utf-8");

      const signer = crypto.createSign("SHA256");
      signer.update(str);
      signer.end();

      const signature = signer.sign(private_key);
      const buff = Buffer.from(signature);
      const base64data = buff.toString("base64");

      resolve(base64data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { cryptoSign };
