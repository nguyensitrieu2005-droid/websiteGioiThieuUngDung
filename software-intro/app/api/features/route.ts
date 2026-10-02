import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const result = await db.request().query(`
      SELECT
        Id,
        Title,
        Description,
        Icon,
        DisplayOrder,
        IsActive,
        DetailContent
      FROM Features
      ORDER BY DisplayOrder ASC, Id ASC
    `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("FEATURES GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Không thể lấy danh sách chức năng",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      Title,
      Description,
      Icon,
      DisplayOrder,
      IsActive,
      DetailContent,
    } = body;

    if (!Title?.trim()) {
      return NextResponse.json(
        {
          error: "Tên chức năng không được để trống",
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Loại bỏ kiểu dữ liệu `sql.NVarChar`, `sql.Int` của MSSQL
    const insertResult = await db
      .request()
      .input("Title", Title.trim())
      .input("Description", Description || "")
      .input("Icon", Icon || "")
      .input("DisplayOrder", Number(DisplayOrder) || 0)
      .input("IsActive", IsActive ? 1 : 0)
      .input("DetailContent", DetailContent || "")
      .query(`
        INSERT INTO Features (
          Title,
          Description,
          Icon,
          DisplayOrder,
          IsActive,
          DetailContent
        )
        VALUES (
          @Title,
          @Description,
          @Icon,
          @DisplayOrder,
          @IsActive,
          @DetailContent
        )
      `);

    // Lấy ID vừa được tạo tự động từ MySQL
    const insertedId =
      insertResult.insertId ||
      insertResult.recordset?.insertId ||
      (await db.request().query("SELECT LAST_INSERT_ID() AS Id")).recordset[0]?.Id;

    const newFeature = {
      Id: insertedId,
      Title: Title.trim(),
      Description: Description || "",
      Icon: Icon || "",
      DisplayOrder: Number(DisplayOrder) || 0,
      IsActive: IsActive ? 1 : 0,
      DetailContent: DetailContent || "",
    };

    return NextResponse.json(newFeature, { status: 201 });
  } catch (error) {
    console.error("FEATURES POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Không thể thêm chức năng",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}