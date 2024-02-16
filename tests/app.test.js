import request from 'supertest';
import speakeasy from 'speakeasy';
import app from '../src/app';

describe('Express App Endpoints', () => {
  it('should generate secret and QR code', async () => {
    const response = await request(app).post('/api/setup').send({});
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('secret');
    expect(response.body).toHaveProperty('qr_code');
  });

  it('should verify token', async () => {
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });
    const verifyResponse = await request(app).post('/api/verify').send({
      secret: secret,
      token: token,
    });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty('verified');
    expect(verifyResponse.body.verified).toBe(true);
  });

  it('should fail verification', async () => {
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';

    const verifyResponse = await request(app).post('/api/verify').send({
      secret: secret,
      token: 123456,
    });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty('verified');
    expect(verifyResponse.body.verified).toBe(false);
  });
});
