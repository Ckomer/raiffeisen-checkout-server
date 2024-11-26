// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware za parsiranje JSON podataka
app.use(express.json());

// Serve PHP files (ako koristiš php server middleware)
app.use(express.static(path.join(__dirname, 'php-files')));

// Endpoint za webhook (ovo zamenjuje tvoj notify.php)
app.post('/notify', (req, res) => {
  const data = req.body;

  if (data && data.transactionStatus) {
    console.log('Webhook data primljeni:', data);
    // Ovdje dodaj logiku obrade podataka koje primiš
    res.status(200).json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'error', message: 'Invalid data' });
  }
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
