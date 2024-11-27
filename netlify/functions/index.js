const fs = require('fs');
const path = require('path');
const { signature } = require("./lib/Sign");
const { transactionState } = require("./lib/transaction-state");
const { reversal } = require("./lib/reversal");

exports.handler = async (event, context) => {
    // Parametri za CORS
    const allowedOrigin = 'https://jankos-wondrous-site-79299d.webflow.io';

    // Ako je potrebno, postavite CORS zaglavlje za preflight (OPTIONS) zahtev
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }

    try {
        // Dodajte privatni ključ ili koristite environment varijable ako je potrebno
        const privateKeyPath = path.join(__dirname, 'keys', 'privateKey.pem');
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');  // Ako koristite lokalne fajlove

        // Ako koristite environment varijable:
        // const privateKey = process.env.PRIVATE_KEY;

        // Ovde možete obraditi različite rute (npr. /signature, /transactionState, /reversal)
        let response;
        switch (event.path) {
            case '/signature':
                response = await signature(event.queryStringParameters, privateKey);
                break;
            case '/transactionState':
                response = await transactionState(event.queryStringParameters, privateKey);
                break;
            case '/reversal':
                response = await reversal(event.queryStringParameters, privateKey);
                break;
            default:
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Route not found' }),
                };
        }

        // Vrati odgovarajuće CORS zaglavlje sa odgovorom
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigin,  // CORS za specifičan domen
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
        };
    }
};
