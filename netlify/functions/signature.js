const crypto = require('crypto');

exports.handler = async (event) => {
    // Ako je OPTIONS zahtev, odgovori sa dozvoljenim CORS headerima
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://jankos-wondrous-site-79299d.webflow.io', // Omogući tačan domen bez dodatnog /
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    // Parsiranje JSON body-ja
    const { orderId, purchaseTime, totalAmount } = JSON.parse(event.body);

    // Hardkodirane vrednosti kao u PHP kodu
    const MerchantID = '1732159';
    const TerminalID = 'E7058794';
    const CurrencyID = 941;
    const Delay = 1;

    // Generisanje stringa sa podacima
    const data = `${MerchantID};${TerminalID};${purchaseTime};${orderId};${Delay};${CurrencyID},;${totalAmount},;`;

    // Učitaj privatni ključ
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

    // Kreiraj potpis koristeći privatni ključ
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');

    // Vrati signature kao response sa CORS headerima
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': 'https://jankos-wondrous-site-79299d.webflow.io', // Tačan domen
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify({ signature })
    };
};
