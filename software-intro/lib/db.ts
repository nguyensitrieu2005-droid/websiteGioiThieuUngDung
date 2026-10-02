import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_SERVER || "",
  port: Number(process.env.DB_PORT) || 12144,
  database: process.env.DB_DATABASE || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getDb(): Promise<any> {
  return {
    request: function () {
      return {
        input: function () {
          return this;
        },
        query: async (sqlQuery: string) => {
          // Tự động đổi biến dạng @param của MSSQL thành ? của MySQL nếu có
          const convertedSql = sqlQuery.replace(/@\w+/g, "?");
          const [rows] = await pool.query(convertedSql);
          return { recordset: rows, recordsets: [rows] };
        },
      };
    },
    transaction: () => ({
      begin: async () => {},
      commit: async () => {},
      rollback: async () => {},
      request: function () {
        return {
          input: function () {
            return this;
          },
          query: async (sqlQuery: string) => {
            const convertedSql = sqlQuery.replace(/@\w+/g, "?");
            const [rows] = await pool.query(convertedSql);
            return { recordset: rows, recordsets: [rows] };
          },
        };
      },
    }),
    query: async (sqlQuery: string) => {
      const [rows] = await pool.query(sqlQuery);
      return { recordset: rows, recordsets: [rows] };
    },
  };
}

export default pool;