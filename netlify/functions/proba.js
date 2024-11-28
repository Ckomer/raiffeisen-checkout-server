const express = require('express');
const serverless = require('serverless-http');
const crypto = require('crypto');
const app = express();

// Middleware za parsiranje JSON tela zahteva
app.use(express.json());

// Omogućavanje CORS-a za sve zahteve
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Odgovaranje na preflight OPTIONS zahteve
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight zahtevi završavaju ovde
    }

    next();
});

// Privatni ključ za potpisivanje (RSA)
const privateKey = `-----BEGIN PRIVATE KEY-----
        MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOwmLx4+3ofOcvAa
        FEmyhJmPXoYYN4IxJYfys9MJ2i2BW9lCn14Ph7sOWS7GQNAQLU0/3QHi+HCuL9Ub
        Cw4OjcJ2t8+LJYUPBVIglg7wbpA20VxJyMzctpXqFwp/VnhD8677Ed9P5eOX4A3Q
        cONB3LDmI56gP0vt4uaW793SCfJ/AgMBAAECgYA35socpNFU4MBAqkvHLmVJXLEJ
        mU36mdvClOeQu7JUN10gzy6eu5pr43elJPVOy6WNteKBgdNCCVn1XpN9XmCcBcf8
        /9l03T1IduxrRBcOxqycP1WVe3Yn7YgEO3cJUmouAS9SX7JekIEhwKnFlFLjf8xE
        D2aMSyQZTo0IewsOsQJBAPiNkGCVJfMIm+N/KTtwahQx/TYXH/EOrzdIcxv5AV8/
        q7k9hLQTbt7mdRmRTOamDrjulQlbclYIXDnmYcwcN7sCQQDzOXsiZ6J9JNkFEdhE
        QEWGZim2f3cb+jgnVu2qRDReluXL485uM1BW5Y9P4W50a2hHaj1gMefjbD0o9B1n
        ZHoNAkAzMxYWjyKuGYvjJQKdV97CIjoCtmjCA0BcpvPvQy/hKwB4vA9l+MrR568f
        gSrSKErIFX1l3AyFZFt7IdXrcbSZAkAdN/2L34lMoV2U11T0tgfkImfGbb+gU8nl
        J/M7LiBgcJ5AhShqYq23ErLJtNoxECoh0ih3YudpkbozLkhOAGsNAkEAkKNZKB/s
        uE/2jQNLbbcxXJxO/5fsVglxmmYI8cYGcuG32XZTfi8NLobHVyLePLuxq+FwWnpp
        1f8cvJr4PqL/IQ==
        -----END PRIVATE KEY-----`; 

// POST ruter direktno na root '/.netlify/functions/proba'
app.post('/', (req, res) => {
    console.log('Received POST request with body:', req.body);

    const paymentData = req.body.data;

    if (!paymentData) {
        return res.status(400).json({ error: "No payment data received" });
    }

    // Priprema podataka za potpisivanje (konvertovanje u string)
    const dataString = `${paymentData.MerchantID};${paymentData.TerminalID};${paymentData.PurchaseTime};${paymentData.OrderID};${paymentData.CurrencyID};${paymentData.TotalAmount};;`;

    console.log('Data string to sign:', dataString);

    // Kreiranje potpisa koristeći RSA privatni ključ
    const sign = crypto.createSign('SHA256');
    sign.update(dataString);
    const signature = sign.sign(privateKey, 'base64');

    // Vraćanje potpisa kao JSON
    console.log('Generated signature:', signature);
    res.json({ signature });
});

// Expose funkciju za Netlify
module.exports.handler = serverless(app);
