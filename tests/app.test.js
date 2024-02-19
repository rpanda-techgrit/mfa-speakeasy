import request from 'supertest';
import speakeasy from 'speakeasy';
import app from '../src/app.js';

describe('Express App Endpoints', () => {
  it('should generate secret and QR code', async () => {
    const response = await request(app).post('/api/setup').send({});
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('secret');
    expect(response.body).toHaveProperty('qrCode');
  });

  it('should verify token', async () => {
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';
    const token = speakeasy.totp({
      secret,
      encoding: 'base32'
    });
    const verifyResponse = await request(app).post('/api/verify').send({
      secret,
      token
    });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty('verified');
    expect(verifyResponse.body.verified).toBe(true);
  });

  it('should fail verification', async () => {
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';

    const verifyResponse = await request(app).post('/api/verify').send({
      secret,
      token: 123456
    });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty('verified');
    expect(verifyResponse.body.verified).toBe(false);
  });

  it('should generate token', async () => {
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';
    const response = await request(app).post('/api/generate').send({ secret });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should verify token if sent within 1 minute', async () => {
    process.env.TOKEN_TIME_DELTA = 2;
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';

    const response = await request(app).post('/api/generate').send({ secret });
    expect(response.statusCode).toBe(200);
    await new Promise((r) => {
      setTimeout(r, 50000);
    });
    const verifyResponse = await request(app).post('/api/verify-delta').send({
      secret,
      token: response.body.token
    });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty('verified');
    expect(verifyResponse.body.verified).toBe(true);
  }, 60000);

  it('should fail verification if sent after 1.5 minutes', async () => {
    process.env.TOKEN_TIME_DELTA = 2;
    const secret = 'FYSWO6DLGI2F4PTBPBIFWTSEFFKTI6KL';

    const response = await request(app).post('/api/generate').send({ secret });
    expect(response.statusCode).toBe(200);
    await new Promise((r) => {
      setTimeout(r, 90000);
    });
    const verifyResponse = await request(app).post('/api/verify-delta').send({
      secret,
      token: response.body.token
    });

    expect(verifyResponse.statusCode).toBe(200);
    expect(verifyResponse.body).toHaveProperty('verified');
    expect(verifyResponse.body.verified).toBe(false);
  }, 200000);
});
