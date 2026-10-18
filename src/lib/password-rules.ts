export function validateNewPassword(password: string, confirmation: string): string | null {
  if (password.length < 12) return "Use at least 12 characters.";
  if (password !== confirmation) return "Passwords do not match.";
  return null;
}