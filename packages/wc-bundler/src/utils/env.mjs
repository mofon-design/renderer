export const env = {
  DEBUG: envBoolean(process.env.DEBUG),
  DISABLE_CLI_RUNTIME_CACHE: envBoolean(process.env.DISABLE_CLI_RUNTIME_CACHE),
};

export function envBoolean(value: string | undefined): boolean {
  if (typeof value === 'string') {
    value = value.trim();
    if (value === 'false' || value === '0') return false;
    return true;
  }
  return false;
}
