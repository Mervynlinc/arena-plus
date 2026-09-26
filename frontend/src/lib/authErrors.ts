interface ClerkLikeError {
  code?: string;
  errors?: { code?: string }[];
}

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const clerkError = error as ClerkLikeError;
  if (clerkError.code) return clerkError.code;
  if (Array.isArray(clerkError.errors)) return clerkError.errors[0]?.code;
  return undefined;
}

const SAFE_MESSAGES: Record<string, string> = {
  form_identifier_not_found: "Invalid email or password.",
  form_password_incorrect: "Invalid email or password.",
  form_password_pwned:
    "This password has appeared in a data breach. Please choose a stronger one.",
  form_password_compromised:
    "This password is not secure enough. Please choose a stronger one.",
  form_password_length_too_short: "Please choose a longer password.",
  form_param_format_invalid: "Please check the information you entered.",
  form_param_length_too_short: "Please check the information you entered.",
  form_param_too_short: "Please check the information you entered.",
  form_email_address_exists: "An account already exists for this email.",
  form_username_identifier_exists: "That username is already taken.",
  form_code_incorrect: "The verification code is incorrect. Please try again.",
  form_expired:
    "The verification code has expired. Please request a new one.",
  verification_failed:
    "The verification code is incorrect or has expired. Please try again.",
  user_locked:
    "This account is temporarily locked. Please try again later.",
  captcha_invalid: "We could not verify you. Please try again.",
  captcha_missing_token: "We could not verify you. Please try again.",
  captcha_not_enabled: "We could not verify you. Please try again.",
  not_allowed_access: "You do not have permission to do that.",
  origin_invalid: "Unable to sign in at this time.",
};

export function getFriendlyAuthError(error: unknown): string {
  const code = getErrorCode(error);
  if (code && SAFE_MESSAGES[code]) return SAFE_MESSAGES[code];
  return "Something went wrong. Please try again.";
}

export function logAuthError(error: unknown): void {
  if (__DEV__ && error) {
    console.error(error);
  }
}
