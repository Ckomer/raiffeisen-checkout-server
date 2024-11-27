const https = require("https");

const ajax = (options, body) => {
  return new Promise((resolve, reject) => {
    const callback = function (response) {
      const data = {
        headers: response.headers,
        statusCode: response.statusCode,
        data: "",
      };

      response.on("data", function (chunk) {
        data.data += chunk;
      });

      response.on("end", function () {
        if (data.headers["content-type"].includes(`application/json`)) {
          const dataStr = data.data;
          try {
            data.data = JSON.parse(data.data);
          } catch (e) {
            data.data = dataStr;
          }
        }
        if (data.statusCode < 400) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    };
    const req = https.request(options, callback);
    if (body) {
      req.write(body);
    }
    req.end();
  });
};

module.exports = { ajax };
