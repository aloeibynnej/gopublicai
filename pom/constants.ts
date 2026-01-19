import 'dotenv/config';

export const ENVIRONMENTS = {
  development: 'development',
  production: 'production',
};

export const ENV = process.env.ENV || ENVIRONMENTS.development;
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
export const PLATFORM_URL = process.env.PLATFORM_URL || 'https://platform-stage.gopublic.ai';
export const USERNAME = process.env.USERNAME || '';
export const PASSWORD = process.env.PASSWORD || '';
