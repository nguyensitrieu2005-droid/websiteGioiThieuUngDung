import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const featureId = Number(id);

    if (!Number.isInteger(featureId) || featureId <= 0) {
      return NextResponse.json(
        {
          error: "ID không hợp lệ",
        },
        { status: 400 }
      );
    }

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
        "Id",
        sql.Int,
        featureId
      )
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
        UPDATE Features
        SET
          Title = @Title,
          Description = @Description,
          Icon = @Icon,
          DisplayOrder = @DisplayOrder,
          IsActive = @IsActive,
          DetailContent = @DetailContent
        OUTPUT INSERTED.*
        WHERE Id = @Id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          error: "Không tìm thấy chức năng",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      result.recordset[0]
    );
  } catch (error) {
    console.error("FEATURE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Không thể cập nhật chức năng",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const featureId = Number(id);

    if (!Number.isInteger(featureId) || featureId <= 0) {
      return NextResponse.json(
        {
          error: "ID không hợp lệ",
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db
      .request()
      .input(
        "Id",
        sql.Int,
        featureId
      )
      .query(`
        DELETE FROM Features
        OUTPUT DELETED.*
        WHERE Id = @Id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          error: "Không tìm thấy chức năng",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa chức năng",
    });
  } catch (error) {
    console.error("FEATURE DELETE ERROR:", error);

    return NextResponse.json(
      {
        error: "Không thể xóa chức năng",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}