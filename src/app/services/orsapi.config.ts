export interface ORSAPIConfig {
  baseUrl: string;
  LOGIN_API: string;
  TOKEN_REFRESH_API: string;
}

const BASE = 'http://127.0.0.1:8000';

export const ORSAPI: ORSAPIConfig = {
  baseUrl: BASE,
  LOGIN_API: `${BASE}/ORSAPI/api/User/login/`,
  TOKEN_REFRESH_API: `${BASE}/api/token/refresh/`
};
