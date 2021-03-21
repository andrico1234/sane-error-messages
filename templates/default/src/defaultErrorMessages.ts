import { errorCodes } from "./errorCodes";
import type { ErrorCode } from "./errorCodes";

export const defaultErrorMessages: Record<ErrorCode, string> = {
  [errorCodes.E_000]: "Something went wrong when making your request",
  [errorCodes.E_400]: "We had trouble processing your request",
  [errorCodes.E_401]: "You cannot access this while logged out, please log in",
  [errorCodes.E_403]: "You are not allowed to access ",
  [errorCodes.E_404]: "We couldn't find what you were looking for",
  [errorCodes.E_409]:
    "We ran into a conflict, are you trying to create something that already exists?",
  [errorCodes.E_412]:
    "We were not able to make your changes, please get in touch with tech support if this issue persists",
  [errorCodes.E_429]:
    "We've limitted how many times you can make this request. Please try again later",
  [errorCodes.E_500]:
    "Something's gone wrong on our side. Please try again in a little bit, or get in touch with tech support if the issue still persists",
};
