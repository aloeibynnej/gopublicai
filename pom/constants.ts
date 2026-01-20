import 'dotenv/config';

export const ENVIRONMENTS = {
  development: 'development',
  production: 'production',
};

export const ENV = process.env.ENV || ENVIRONMENTS.development;
export const BASE_URL = process.env.BASE_URL || 'https://staging.gopublic.ai'
export const USERNAME = process.env.USERNAME || 'derick.gapuz@gopublic.ai';
export const PASSWORD = process.env.PASSWORD || 'qatester123!';

