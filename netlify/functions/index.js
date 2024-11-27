// Importovanje potrebnih funkcionalnosti
const { signature } = require("./lib/Sign");
const { transactionState } = require("./lib/transaction-state");
const { reversal } = require("./lib/reversal");

// Definisanje CORS-a (ako je potrebno)
const handleCORS = (response) => {
  response.setHeader('Access-Control-Allow-Origin', 'https://jankos-wondrous-site-79299d.webflow.io/');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return response;
};

// Exportovanje funkcije kao handler
exports.handler = async function(event, context) {
  // Podesite CORS zaglavlja
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  };
  
  // Dodajte CORS header-e ako je potrebno
  handleCORS(response);

  // Možete obraditi zahteve ovde, npr. za različite rute kao:
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);

    // Logika za obradu POST zahteva sa različitim funkcijama
    if (body.action === 'signature') {
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
