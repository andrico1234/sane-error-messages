import { ValueOf } from './utils';

// 000s
const E_000 = '000';

// 400s
const E_400 = '400';

// 401s
const E_401 = '401';

// 403s
const E_403 = '403';

// 404s
const E_404 = '404';

// 409s
const E_409 = '409';

// 412s
const E_412 = '412';

// 429s
const E_429 = '429';

// 500s
const E_500 = '500';

export const errorCodes = {
  E_000,
  E_400,
  E_401,
  E_403,
  E_404,
  E_409,
  E_412,
  E_429,
  E_500,
} as const;

export type ErrorCode = ValueOf<typeof errorCodes>;
