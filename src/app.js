import express, { json } from 'express';
import speakeasy from 'speakeasy';
import { toDataURL } from 'qrcode';
import dotenv from 'dotenv';
const envPath =
  process.env.NODE_ENV === 'development'
    ? '.env'
    : `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: `.env${envPath}` });

const app = express();
app.use(json());

// Generate secret and QR code
app.post('/api/setup', (req, res) => {
  console.info('MFA setup request received');
  const secret = speakeasy.generateSecret({
    length: +process.env.TOKEN_LENGTH,
    name: process.env.SECRET_NAME,
  });

  toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      res.status(500).json({ message: 'Error generating QR code' });
    } else {
      res.json({ secret: secret.base32, qr_code: data_url });
    }
  });
});

// Verify token
app.post('/api/verify', (req, res) => {
  console.info('Verification request received');
  const { secret, token } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });
  res.json({ verified });
});

export default app;
