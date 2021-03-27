export const env: {
  readonly DEBUG: boolean;
  readonly DISABLE_CLI_RUNTIME_CACHE: boolean;
};

export function envBoolean(value: string | undefined): boolean;
