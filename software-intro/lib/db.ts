import mysql from "mysql2/promise";

// Khởi tạo Connection Pool kết nối đến Aiven MySQL
const pool = mysql.createPool({
  host: process.env.DB_SERVER || "",
  port: Number(process.env.DB_PORT) || 12144,
  database: process.env.DB_DATABASE || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Hàm getDb() giữ nguyên tên để không làm hỏng code hiện tại.
 * Trả về instance của mysql pool.
 */
export async function getDb() {
  return pool;
}

export default pool;