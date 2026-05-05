type AppEnv = Record<string, string | undefined>;

const DEFAULT_ENV = {
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: '5432',
  DATABASE_USER: 'cactus',
  DATABASE_PASSWORD: 'cactus',
  DATABASE_NAME: 'cactus_nft',
  HARDHAT_RPC_URL: 'http://127.0.0.1:8545',
  EVENTS_START_BLOCK: '0',
  API_PORT: '3000',
};

export function validateEnv(config: AppEnv): AppEnv {
  const merged = {
    ...config,
    ...Object.fromEntries(
      Object.entries(DEFAULT_ENV).filter(([key]) => config[key] === undefined),
    ),
  };

  assertNumber(merged.DATABASE_PORT, 'DATABASE_PORT');
  assertNumber(merged.API_PORT, 'API_PORT');
  assertNumber(merged.EVENTS_START_BLOCK, 'EVENTS_START_BLOCK');
  assertUrl(merged.HARDHAT_RPC_URL, 'HARDHAT_RPC_URL');

  return merged;
}

function assertNumber(value: string | undefined, name: string) {
  if (value === undefined || Number.isNaN(Number(value))) {
    throw new Error(`${name} must be a number`);
  }
}

function assertUrl(value: string | undefined, name: string) {
  if (value === undefined) {
    throw new Error(`${name} is required`);
  }

  try {
    new URL(value);
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }
}
