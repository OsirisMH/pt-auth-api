import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../config/env";

export type AppContext = {
  port: number;
  db: ReturnType<typeof drizzle>;
  sql: postgres.Sql;
  jwt: {
    privateKeyPem: string;
    publicKeyPem: string;
    issuer: string;
    audience: string;
  };
  internalAuthSecret: string;
  onShutdown: () => Promise<void>;
};

export const buildContext = async (): Promise<AppContext> => {
  const port = env.PORT;
  const connectionString = env.DATABASE_URL;
  const sql = postgres(connectionString, { max: 10 });
  const db = drizzle(sql);

  try {
    await db.execute("SELECT 1");
    console.log("Database is up and reachable!");
  } catch (error) {
    console.error("Database is not reachable:", error);
    throw error;
  }

  const privateKeyPem = env.JWT_PRIVATE_KEY_PEM;
  const publicKeyPem = env.JWT_PUBLIC_KEY_PEM;
  const issuer = env.JWT_ISSUER;
  const audience = env.JWT_AUDIENCE;
  const internalAuthSecret = env.INTERNAL_AUTH_SECRET

  const onShutdown = async () => {
    await sql.end({ timeout: 5 });
  };

  return {
    port,
    db,
    sql,
    jwt: { privateKeyPem, publicKeyPem, issuer, audience },
    internalAuthSecret,
    onShutdown
  };
};
