import { NextResponse } from "next/server";
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

    // 1. Thực hiện UPDATE dữ liệu (Đã loại bỏ OUTPUT INSERTED)
    const updateResult = await db
      .request()
      .input("Id", featureId)
      .input("Title", Title.trim())
      .input("Description", Description || "")
      .input("Icon", Icon || "")
      .input("DisplayOrder", Number(DisplayOrder) || 0)
      .input("IsActive", IsActive ? 1 : 0)
      .input("DetailContent", DetailContent || "")
      .query(`
        UPDATE Features
        SET
          Title = @Title,
          Description = @Description,
          Icon = @Icon,
          DisplayOrder = @DisplayOrder,
          IsActive = @IsActive,
          DetailContent = @DetailContent
        WHERE Id = @Id
      `);

    // Kiểm tra số dòng bị ảnh hưởng
    if (updateResult.rowsAffected && updateResult.rowsAffected[0] === 0) {
      return NextResponse.json(
        {
          error: "Không tìm thấy chức năng",
        },
        { status: 404 }
      );
    }

    // 2. Trả về đối tượng sau khi đã cập nhật
    const updatedFeature = {
      Id: featureId,
      Title: Title.trim(),
      Description: Description || "",
      Icon: Icon || "",
      DisplayOrder: Number(DisplayOrder) || 0,
      IsActive: IsActive ? 1 : 0,
      DetailContent: DetailContent || "",
    };

    return NextResponse.json(updatedFeature);
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

    // Thực hiện DELETE (Đã loại bỏ OUTPUT DELETED)
    const deleteResult = await db
      .request()
      .input("Id", featureId)
      .query(`
        DELETE FROM Features
        WHERE Id = @Id
      `);

    if (deleteResult.rowsAffected && deleteResult.rowsAffected[0] === 0) {
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