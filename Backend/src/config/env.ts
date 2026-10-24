
import "dotenv/config";

function getRequiredEnv(
  key: string,
  fallback?: string,
): string {
  const value = process.env[key]?.trim() || fallback;

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}`,
    );
  }

  return value;
}

function getBooleanEnv(
  key: string,
  fallback = false,
): boolean {
  const value = process.env[key]?.trim().toLowerCase();

  if (!value) {
    return fallback;
  }

  return value === "true";
}

function getNumberEnv(
  key: string,
  fallback: number,
): number {
  const value = process.env[key]?.trim();

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      `Environment variable ${key} must be a positive integer.`,
    );
  }

  return parsed;
}

export const env = {
  NODE_ENV: getRequiredEnv(
    "NODE_ENV",
    "development",
  ),

  PORT: getNumberEnv("PORT", 5000),

  MONGO_URI: getRequiredEnv("MONGO_URI"),

  CLIENT_URL: getRequiredEnv(
    "CLIENT_URL",
    "http://localhost:5173",
  ),

  JWT_ACCESS_SECRET: getRequiredEnv(
    "JWT_ACCESS_SECRET",
  ),

  JWT_REFRESH_SECRET: getRequiredEnv(
    "JWT_REFRESH_SECRET",
  ),

  JWT_ACCESS_EXPIRES_IN: getRequiredEnv(
    "JWT_ACCESS_EXPIRES_IN",
    "15m",
  ),

  JWT_REFRESH_EXPIRES_IN: getRequiredEnv(
    "JWT_REFRESH_EXPIRES_IN",
    "7d",
  ),

  COOKIE_SECURE: getBooleanEnv(
    "COOKIE_SECURE",
    false,
  ),

  // AI configuration
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY?.trim() || "",

  OPENAI_MODEL: getRequiredEnv(
    "OPENAI_MODEL",
    "gpt-5.5",
  ),
};
