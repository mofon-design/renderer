export const env = {
  DEBUG: envBoolean(caseInsensitiveEnv('DEBUG')),
  DISABLE_CLI_RUNTIME_CACHE: envBoolean(caseInsensitiveEnv('DISABLE_CLI_RUNTIME_CACHE')),
  SILENT: envBoolean(caseInsensitiveEnv('SILENT')),
  TERM: process.env.TERM,
} as const;

export function caseInsensitiveEnv(key: string, env = process.env): string | undefined {
  key = key.toUpperCase();
  const found = Object.getOwnPropertyNames(env).find((k) => k.toUpperCase() === key);
  return found === undefined ? undefined : env[found];
}

export function envBoolean(value: string | undefined): boolean {
  if (typeof value === 'string') {
    value = value.trim();
    if (value === 'false' || value === '0') return false;
    return true;
  }
  return false;
}
