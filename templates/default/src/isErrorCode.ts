import { ErrorCode, errorCodes } from './errorCodes';

export function isErrorCode(code: string | number): code is ErrorCode {
  const parsedCode = String(code);
  const allowedKeys: string[] = Object.values(errorCodes);

  return allowedKeys.indexOf(parsedCode) !== -1;
}
