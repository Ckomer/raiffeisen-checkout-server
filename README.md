# UpcPaymentNodeSdk

### Підпис даних

Приклад використання 
```javascript
const { signature } = require("upc-payment-sdk");

signature(paymentInfo, path.join(__dirname, "../keys/private.pem"))
  .then((signature) => {
    console.log({ signature });
  })
  .catch((e) => {
    console.log({ e });
  });
```

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
 
 signature = (paymentInfo, privateKeyPath)
 
 **signature** - функція, яка приймає об'єкт **paymentInfo** для прикладу 
```javascript
const paymentInfo = {
	  MerchantID: 77777799004,
	  TerminalID: `E9977774`,
	  PurchaseTime: new Date().getTime(),
	  OrderID: 1,
	  Currency: "980",
	  TotalAmount: 100,
};
```
 а також **privateKeyPath** - шлях до приватного ключа
**signature** повертає Promise який в then успішний підпис, або в catch помилку валідації
 
 
------------


###  Запит стану транзакції

Приклад використання
```javascript
const { transactionState } = require("upc-payment-sdk");

transactionState(
  reqData,
  path.join(__dirname, "../keys/private.pem"),
  "ecg.test.upc.ua"
)
  .then((data) => {
    console.log({ data });
  })
  .catch((e) => {
    console.log({
      reject: e,
    });
  });

```
/**
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

 transactionState = (paymentInfo, privateKeyPath, hostname)
 
 **transactionState** - функція
 **paymentInfo**  об'єкт наступними полями: 
```javascript
const paymentInfo = {
	  MerchantID: 77777799004,
	  TerminalID: `E9977774`,
	  PurchaseTime: new Date().getTime(),
	  OrderID: 1,
	  Currency: "980",
	  TotalAmount: 100,
};
```
 **privateKeyPath** - шлях до приватного ключа
 **hostname** - не обов'зяковий параметр, для виклику тестового середовища вкажіть "ecg.test.upc.ua" випадку відсутності параметра значення на замовчуванням secure.upc.ua
**transactionState** повертає Promise який в **then** успішний підпис, або в **catch** помилку валідації, або запиту даних




### Створення форми на express.js i ejs шаблонізаторі
Приклад використання

Встановимо залежності
`npm install express ejs`

створимо для прикладу наступні файли: **index.js,** **SampleForm.ejs**

```javascript
// index.js

const express = require("express");
const path = require("path");
const { signature } = require("../../index");

const app = express();

var PORT = process.env.port || 3000;

// View Engine Setup
app.set("views", path.join(__dirname));
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  // Sample date to be filled in form
  const form = {
    MerchantID: 77777799004,
    TerminalID: `E9977774`,
    PurchaseTime: new Date().getTime(),
    OrderID: 1,
    Currency: "980",
    TotalAmount: 100,
  };

  const Signature = await signature.paymentSign(
    form,
    path.join(__dirname, "../../keys/private.pem")
  );

  form["Signature"] = Signature;

  res.render("SampleForm", {
    form: form,
  });
});

app.listen(PORT, function (error) {
  if (error) throw error;
  console.log("Server created Successfully on PORT", PORT);
});

```
```javascript
// SampleForm.ejs

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment page</title>
</head>
<body>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <form action="https://secure.upc.ua/go/pay" method="POST">
        <% for (var name in form) {  %>
            <input type="hidden" name="<%-name%>" value="<%-form[name]%>">
        <% 
            }
        %>
            <input type="submit" />
    </form>
</body>
</html>
```
