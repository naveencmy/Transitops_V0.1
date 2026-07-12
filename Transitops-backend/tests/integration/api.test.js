
const request = require('supertest');
const app = require('../../src/app');

describe('API Integration', () => {
  describe('Health Check', () => {
    it('should return ok status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Authentication', () => {
    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrongpass' }); // 9 chars, passes validation

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject login with missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com' }); // missing password

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject requests without token', async () => {
      const res = await request(app).get('/api/v1/vehicles');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/v1/unknown');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Fuel Endpoints', () => {
    it('should reject fuel log access without auth', async () => {
      const res = await request(app).get('/api/v1/fuel/logs');
      expect(res.status).toBe(401);
    });
  });

  describe('Expense Endpoints', () => {
    it('should reject expense access without auth', async () => {
      const res = await request(app).get('/api/v1/expenses');
      expect(res.status).toBe(401);
    });
  });
});