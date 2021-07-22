export const env = {
  DEBUG: envBoolean(caseInsensitiveEnv('DEBUG')),
  DISABLE_CLI_RUNTIME_CACHE: envBoolean(caseInsensitiveEnv('DISABLE_CLI_RUNTIME_CACHE')),
  LOG_FILE: caseInsensitiveEnv('LOG_FILE')?.trim(),
  GULP_PLUMBER: envBoolean(caseInsensitiveEnv('GULP_PLUMBER')),
  SILENT: envBoolean(caseInsensitiveEnv('SILENT')),
  TERM: process.env.TERM,
} as const;

export function caseInsensitiveEnv(key: string, env?: NodeJS.ProcessEnv): string | undefined {
  key = key.toUpperCase();

  if (env === undefined) {
    if (caseInsensitiveEnv.cachedEnv !== process.env) {
      caseInsensitiveEnv.cachedEnv = process.env;
      caseInsensitiveEnv.cachedEnvKeysMap = createProcessEnvKeysMap();
    }

    const found = caseInsensitiveEnv.cachedEnvKeysMap[key];
    return found === undefined ? undefined : caseInsensitiveEnv.cachedEnv[found];
  }

  const found = Object.getOwnPropertyNames(env).find((k) => k.toUpperCase() === key);
  return found === undefined ? undefined : env[found];
}

caseInsensitiveEnv.cachedEnv = process.env;
caseInsensitiveEnv.cachedEnvKeysMap = createProcessEnvKeysMap();

export function envBoolean(value: string | undefined): boolean {
  if (typeof value === 'string') {
    value = value.trim().toLowerCase();
    if (value === 'false' || value === '0') return false;
    return true;
  }
  return false;
}

function createProcessEnvKeysMap() {
  return Object.getOwnPropertyNames(process.env).reduce((map, name) => {
    map[name.toUpperCase()] = name;
    return map;
  }, {} as Record<string, string | undefined>);
}
