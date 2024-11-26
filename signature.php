// server-side PHP kod za generisanje potpisa
$MerchantID = '1732159';
$TerminalID = 'E7058794';
$OrderID = $_GET['orderId'];  // Ili uzimanje order ID iz URL-a ili drugog izvora
$PurchaseTime = $_GET['purchaseTime'];  // Datum i vreme
$TotalAmount = $_GET['totalAmount'];  // Iznos
$CurrencyID = 941;  // RSD
$Delay = 1;  // Postavite Delay na 1

$data = "$MerchantID;$TerminalID;$PurchaseTime;$OrderID,$Delay;$CurrencyID;,$TotalAmount;;";

// Učitavanje privatnog ključa
$privKey = file_get_contents('path_to_your_private_key.pem');
$pkeyid = openssl_get_privatekey($privKey);

// Potpisivanje podataka
openssl_sign($data, $signature, $pkeyid);
openssl_free_key($pkeyid);

// Baze64 enkodovanje potpisa
$b64sign = base64_encode($signature);

echo $b64sign;
