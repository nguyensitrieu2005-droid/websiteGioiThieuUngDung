import { NextResponse } from "next/server";
import sql from "mssql";
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

    const result = await db
      .request()
      .input(
        "Title",
        sql.NVarChar(255),
        Title.trim()
      )
      .input(
        "Description",
        sql.NVarChar(sql.MAX),
        Description || ""
      )
      .input(
        "Icon",
        sql.NVarChar(100),
        Icon || ""
      )
      .input(
        "DisplayOrder",
        sql.Int,
        Number(DisplayOrder) || 0
      )
      .input(
        "IsActive",
        sql.Bit,
        IsActive ? 1 : 0
      )
      .input(
        "DetailContent",
        sql.NVarChar(sql.MAX),
        DetailContent || ""
      )
      .query(`
        INSERT INTO Features (
          Title,
          Description,
          Icon,
          DisplayOrder,
          IsActive,
          DetailContent
        )
        OUTPUT INSERTED.*
        VALUES (
          @Title,
          @Description,
          @Icon,
          @DisplayOrder,
          @IsActive,
          @DetailContent
        )
      `);

    return NextResponse.json(
      result.recordset[0]
    );
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