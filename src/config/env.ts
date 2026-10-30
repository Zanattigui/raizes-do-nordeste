import "dotenv/config";

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error(
    "Faltam variáveis no .env (DATABASE_URL e JWT_SECRET). Copie o .env.example para .env",
  );
  process.exit(1);
}

export const env = {
  PORT: Number(process.env.PORT ?? 3333),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1h",
};
