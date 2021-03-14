import  { ErrorMessages } from './ErrorMessages';
import { errorCodes } from './errorCodes'
import { isErrorCode } from './isErrorCode';
import type { ErrorCode } from './errorCodes';
const {
  // 000s
  E_000,

  // 400s
  E_400,

  // 403s
  E_403,

  // 404s
  E_404,

  // 409s
  E_409,
  // 412s
  E_412,

  // 429s
  E_429,
  // 500s
  E_500,
  
} = errorCodes

export {
  ErrorMessages,
  isErrorCode,
};

export { 
  // 000s
  E_000,

  // 400s
  E_400,

  // 403s
  E_403,

  // 404s
  E_404,

  // 409s
  E_409,

  // 412s
  E_412,
  
  // 429s
  E_429,
  
  // 500s
  E_500,
  
 }
export type { ErrorCode }