export function emailValidation(value: string) {
  return value.includes("@");
}

/**
 * Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
 * Supports Unicode characters (including accented letters like Á, É, Ő, Ű, etc.)
 */
export function passwordValidation(val: string) {
  
  const hasUppercase = /\p{Lu}/u.test(val);
  const hasLowercase = /\p{Ll}/u.test(val);
  const hasDigit = /\d/.test(val);
  const hasSpecial = /[^\p{L}\p{N}\s]/u.test(val);
  
  return hasUppercase && hasLowercase && hasDigit && hasSpecial;
}
