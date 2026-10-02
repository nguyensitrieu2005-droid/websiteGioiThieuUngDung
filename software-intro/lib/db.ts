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

class MssqlRequest {
  private namedParams: Record<string, any> = {};

  input(name: string, typeOrValue: any, value?: any) {
    const actualValue = value !== undefined ? value : typeOrValue;
    // Bỏ dấu @ ở đầu nếu có để thống nhất tên key
    const paramName = name.startsWith("@") ? name.substring(1) : name;
    this.namedParams[paramName] = actualValue;
    return this;
  }

  async query(sqlQuery: string) {
    let formattedSql = sqlQuery;

    // 1. Chuyển "SELECT TOP (n)" hoặc "SELECT TOP n" thành LIMIT ở cuối câu
    const topRegex = /SELECT\s+TOP\s*\(?(\d+)\)?\s+/i;
    const matchTop = formattedSql.match(topRegex);
    if (matchTop) {
      const limitNum = matchTop[1];
      formattedSql = formattedSql.replace(topRegex, "SELECT ");
      if (!/LIMIT\s+\d+/i.test(formattedSql)) {
        formattedSql = `${formattedSql.trim()} LIMIT ${limitNum}`;
      }
    }

    // 2. Đổi dấu ngoặc vuông [ColumnName] thành backtick `ColumnName`
    formattedSql = formattedSql.replace(/\[(\w+)\]/g, "`$1`");

    // 3. Trích xuất đúng thứ tự các tham số @ParamName trong câu SQL
    const orderedParams: any[] = [];
    const paramMatches = formattedSql.match(/@\w+/g);

    if (paramMatches) {
      for (const match of paramMatches) {
        const paramName = match.substring(1); // Bỏ dấu @
        if (paramName in this.namedParams) {
          orderedParams.push(this.namedParams[paramName]);
        } else {
          orderedParams.push(null);
        }
      }
    }

    // 4. Thay thế toàn bộ @ParamName thành dấu ? cho mysql2
    formattedSql = formattedSql.replace(/@\w+/g, "?");

    // Thực thi câu lệnh với danh sách tham số đã sắp xếp chuẩn thứ tự
    const [rows] = await pool.query(formattedSql, orderedParams);
    return { recordset: rows, recordsets: [rows] };
  }
}

export async function getDb(): Promise<any> {
  return {
    request: function () {
      return new MssqlRequest();
    },
    transaction: () => ({
      begin: async () => {},
      commit: async () => {},
      rollback: async () => {},
      request: function () {
        return new MssqlRequest();
      },
    }),
    query: async (sqlQuery: string, params?: any[]) => {
      let formattedSql = sqlQuery
        .replace(/\[(\w+)\]/g, "`$1`")
        .replace(/@\w+/g, "?");
      const [rows] = await pool.query(formattedSql, params || []);
      return { recordset: rows, recordsets: [rows] };
    },
  };
}

export default pool;