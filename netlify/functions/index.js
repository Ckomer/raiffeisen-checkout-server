const { signature } = require("./lib/Sign");
const { transactionState } = require("./lib/transaction-state");
const { reversal } = require("./lib/reversal");

const handleCORS = (headers) => {
  // Dodaj CORS zaglavlja u odgovor
  headers['Access-Control-Allow-Origin'] = '*';  // Zameniti sa Webflow domenom ako je potrebno
  headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type';
};

exports.handler = async function(event, context) {
    // Dodajte CORS header-e za preflight (OPTIONS) i ostale HTTP metode
    if (event.httpMethod === 'OPTIONS') {
      const response = {
        statusCode: 204,
        body: JSON.stringify({ message: 'Preflight request allowed' })
      };
      return handleCORS(response);
    }
  
    // Ostatak koda za obradu POST zahteva
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    };
  
    handleCORS(response);
  
    // Obrada POST zahteva sa različitim akcijama
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
  
      if (body.action === 'paymentSign') {
        const paymentData = body.data;
        // Tu možeš obraditi logiku za 'paymentSign' akciju
        const signature = await signature(paymentData); // Pretpostavljam da ćeš koristiti ovu funkciju za generisanje potpisa
        response.body = JSON.stringify({ signature });
      } else if (body.action === 'signature') {
        const signedData = await signature(body.params);
        response.body = JSON.stringify({ signedData });
      } else if (body.action === 'transactionState') {
        const state = await transactionState(body.params);
        response.body = JSON.stringify({ state });
      } else if (body.action === 'reversal') {
        const reversalData = await reversal(body.params);
        response.body = JSON.stringify({ reversalData });
      } else {
        response.statusCode = 400;
        response.body = JSON.stringify({ error: 'Invalid action' });
      }
    }
  
    return response;
  };
  
