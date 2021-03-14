import { defaultErrorMessages } from './defaultErrorMessages';
import { isErrorCode } from './isErrorCode';
import type { ErrorCode } from './errorCodes'

export class ErrorMessages {
  messages: Record<ErrorCode, string>;

  constructor(customErrorMessages: Partial<Record<ErrorCode, string>> = {}) {
    this.messages = {
      ...defaultErrorMessages,
      ...customErrorMessages,
    };
  }

  getErrorMessage(code: number | string, fallbackMessage?: string) {
    const parsedCode = String(code);

    if (!isErrorCode(parsedCode)) {
      return fallbackMessage ?? this.messages['000'];
    }

    const message = this.messages[parsedCode];

    return message;
  }
}
