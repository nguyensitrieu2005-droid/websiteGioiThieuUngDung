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

// Hàm hỗ trợ chuyển đổi cú pháp MSSQL sang MySQL chuẩn
function formatSqlQuery(sqlQuery: string): string {
  let formatted = sqlQuery;

  // 1. Chuyển "SELECT TOP (n)" hoặc "SELECT TOP n" thành LIMIT ở cuối câu
  const topRegex = /SELECT\s+TOP\s*\(?(\d+)\)?\s+/i;
  const matchTop = formatted.match(topRegex);
  if (matchTop) {
    const limitNum = matchTop[1];
    // Xóa chữ "TOP n" khỏi câu lệnh SELECT
    formatted = formatted.replace(topRegex, "SELECT ");
    // Thêm "LIMIT n" vào cuối câu lệnh (nếu chưa có LIMIT)
    if (!/LIMIT\s+\d+/i.test(formatted)) {
      formatted = `${formatted.trim()} LIMIT ${limitNum}`;
    }
  }

  // 2. Chuyển đổi tham số @param thành ?
  formatted = formatted.replace(/@\w+/g, "?");

  // 3. Đổi dấu ngoặc vuông [ColumnName] thành backtick `ColumnName`
  formatted = formatted.replace(/\[(\w+)\]/g, "`$1`");

  return formatted;
}

export async function getDb(): Promise<any> {
  return {
    request: function () {
      return {
        input: function () {
          return this;
        },
        query: async (sqlQuery: string) => {
          const convertedSql = formatSqlQuery(sqlQuery);
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
            const convertedSql = formatSqlQuery(sqlQuery);
            const [rows] = await pool.query(convertedSql);
            return { recordset: rows, recordsets: [rows] };
          },
        };
      },
    }),
    query: async (sqlQuery: string) => {
      const convertedSql = formatSqlQuery(sqlQuery);
      const [rows] = await pool.query(convertedSql);
      return { recordset: rows, recordsets: [rows] };
    },
  };
}

export default pool;