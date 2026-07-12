/**
 * Environment configuration with validation
 * Ensures all required env vars are present before app starts
 */

require('dotenv').config();

const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  isProduction() {
    return this.NODE_ENV === 'production';
  }
};
