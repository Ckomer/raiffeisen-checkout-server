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
  // CORS handling za OPTIONS metod
  if (event.httpMethod === 'OPTIONS') {
    const headers = {};
    handleCORS(headers); // Dodaj CORS zaglavlja
    return {
      statusCode: 204, // Preflight odgovor
      headers,
      body: JSON.stringify({ message: 'Preflight request allowed' })
    };
  }

  const headers = {}; // Zaglavlja odgovora
  handleCORS(headers); // Dodaj CORS zaglavlja

  let response = {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Success' })
  };

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);

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

  return response; // Vraća odgovor sa CORS zaglavljima
};
