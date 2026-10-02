import sql from "mssql";

const config: sql.config = {
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getDb() {
  if (pool && pool.connected) {
    return pool;
  }

  pool = await sql.connect(config);

  return pool;
}