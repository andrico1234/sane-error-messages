import { defaultErrorMessages } from "./defaultErrorMessages";
import type { ErrorCode } from "./errorCodes";

export class ErrorMessages {
  messages: Record<ErrorCode, string>;

  constructor(customErrorMessages: Record<number | string, string> = {}) {
    this.messages = {
      ...defaultErrorMessages,
      ...customErrorMessages,
    };
  }

  isErrorCode = (code: string | number): code is ErrorCode => {
    const errorCodes = Object.keys(this.messages);
    const parsedCode = String(code);
    const allowedKeys: string[] = Object.values(errorCodes);

    return allowedKeys.indexOf(parsedCode) !== -1;
  };

  getErrorMessage = (code: number | string, fallbackMessage?: string) => {
    const parsedCode = String(code);

    if (!this.isErrorCode(parsedCode)) {
      return fallbackMessage ?? this.messages["000"];
    }

    const message = this.messages[parsedCode];

    return message;
  };
}
