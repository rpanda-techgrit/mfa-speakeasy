import express, { json } from 'express';
import cors from 'cors';
import speakeasy from 'speakeasy';
import { toDataURL } from 'qrcode';
import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV === 'development' ? '.env' : `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

const app = express();
app.use(cors());
app.use(json());

// Setup secret and qr_code
app.post('/api/setup', (req, res) => {
  console.info('MFA setup request received');
  const secret = speakeasy.generateSecret({
    length: +process.env.TOKEN_LENGTH,
    name: process.env.SECRET_NAME
  });

  toDataURL(secret.otpauth_url, (err, dataUrl) => {
    if (err) {
      res.status(500).json({ message: 'Error generating QR code' });
    } else {
      res.json({ secret: secret.base32, qrCode: dataUrl });
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
    token
  });
  res.json({ verified });
});

// Generate token
app.post('/api/generate', (req, res) => {
  console.info('Generation request received');
  const { secret } = req.body;
  const token = speakeasy.totp({
    secret,
    encoding: 'base32',
    step: 30,
    window: +process.env.TOKEN_TIME_DELTA
  });
  res.json({ token });
});

// verify-window
app.post('/api/verify-delta', (req, res) => {
  console.info('Verification delta request received');
  const { secret, token } = req.body;
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    step: 30,
    window: +process.env.TOKEN_TIME_DELTA
  });
  res.json({ verified });
});

export default app;
