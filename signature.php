
<?php
header("Access-Control-Allow-Origin: https://jankos-wondrous-site-79299d.webflow.io"); // Omogućava pristup sa bilo koje domene, možete specifično dozvoliti samo vaš domen npr: "https://jankos-wondrous-site-79299d.webflow.io"
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Učitajte Merchant ID, Terminal ID, i druge podatke
$MerchantID = '1732159';
$TerminalID = 'E7058794';
$OrderID = $_GET['orderId'];  // Uzmi Order ID iz GET parametara ili drugih izvora
$PurchaseTime = $_GET['purchaseTime'];  // Datum i vreme
$TotalAmount = $_GET['totalAmount'];  // Iznos
$CurrencyID = 941;  // RSD
$Delay = 1;  // Delay postavljen na 1 (TRUE)

// Generisanje $data stringa prema vašim zahtevima
$data = "$MerchantID;$TerminalID;$PurchaseTime;$OrderID,$Delay;$CurrencyID,;$TotalAmount,;";

// Učitajte privatni ključ
$privKey = file_get_contents('path_to_your_private_key.pem');
$pkeyid = openssl_get_privatekey($privKey);

// Potpisivanje podataka
openssl_sign($data, $signature, $pkeyid);
openssl_free_key($pkeyid);

// Baze64 enkodovanje potpisa
$b64sign = base64_encode($signature);

// Ispisivanje potpisa
echo $b64sign;
?>
