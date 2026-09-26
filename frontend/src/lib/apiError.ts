const USER_MESSAGES = {
  OFFLINE: "No connection. Check your network and try again.",
  SPORTS_UNAVAILABLE: "Sports are unavailable right now.",
  MATCHES_UNAVAILABLE: "Matches are unavailable right now.",
  STREAMS_UNAVAILABLE: "Streams are unavailable right now.",
  CONFIG_MISSING: "Something went wrong. Please reinstall the app.",
  UNKNOWN: "Something went wrong. Please try again.",
} as const;

export type ApiErrorCode = keyof typeof USER_MESSAGES;

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(code: ApiErrorCode, status?: number) {
    super(USER_MESSAGES[code]);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function toUserMessage(err: unknown): string {
  return err instanceof ApiError ? USER_MESSAGES[err.code] : USER_MESSAGES.UNKNOWN;
}

const URL_PATTERN = /\b[a-z][a-z0-9+.-]*:\/\/[^\s"')]+/gi;
const HOST_PATTERN =
  /\b[\w-]+(?:\.[\w-]+)*\.(?:com|net|org|io|pk|dev|app|co|me|cloud)\b/gi;

function redact(value: string): string {
  return value.replace(URL_PATTERN, "[url]").replace(HOST_PATTERN, "[host]");
}

export function logInternalError(err: unknown, context: string): void {
  if (!__DEV__) return;
  const raw = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  console.warn(`[api] ${context} -> ${redact(raw)}`);
}
