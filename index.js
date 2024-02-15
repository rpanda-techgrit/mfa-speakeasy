const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());

// Generate secret and QR code
app.post('/api/setup', (req, res) => {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: "Rp's Test Token",
  });
  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      res.status(500).json({ message: 'Error generating QR code' });
    } else {
      res.json({ secret: secret.base32, qr_code: data_url });
    }
  });
});

// Verify token
app.post('/api/verify', (req, res) => {
  const { secret, token } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });
  res.json({ verified });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
