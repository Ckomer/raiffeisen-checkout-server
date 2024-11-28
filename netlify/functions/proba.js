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

    // Preostali zahtevi idu dalje u odgovarajući ruter
    next();
});

// POST ruter direktno na '/.netlify/functions/proba'
app.post('/.netlify/functions/proba', (req, res) => {
    // Privatni ključ za potpisivanje (RSA)
    const fs = require('fs');
    
    const privateKey = fs.readFileSync('keys/1770000.pem', 'utf8');
    // Korišćenje privatnog ključa
    console.log(privateKey); // Samo za testiranje



    // Prikazivanje podataka za logovanje
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
