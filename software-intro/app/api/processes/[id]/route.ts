import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const processId = Number(id);

    if (!Number.isInteger(processId)) {
      return NextResponse.json(
        { error: "ID quy trình không hợp lệ" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const processResult = await db
      .request()
      .input("Id", processId)
      .query(`
        SELECT
          Id,
          Title,
          Description,
          DisplayOrder,
          IsActive
        FROM Processes
        WHERE Id = @Id
      `);

    if (!processResult.recordset || processResult.recordset.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy quy trình" },
        { status: 404 }
      );
    }

    const stepsResult = await db
      .request()
      .input("ProcessId", processId)
      .query(`
        SELECT
          Id,
          ProcessId,
          StepNumber,
          Title,
          Description
        FROM ProcessSteps
        WHERE ProcessId = @ProcessId
        ORDER BY StepNumber ASC, Id ASC
      `);

    return NextResponse.json({
      ...processResult.recordset[0],
      Steps: stepsResult.recordset || [],
    });
  } catch (error) {
    console.error("GET /api/processes/[id] error:", error);

    return NextResponse.json(
      {
        error: "Không thể tải quy trình",
        detail:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const processId = Number(id);

    if (!Number.isInteger(processId)) {
      return NextResponse.json(
        { error: "ID quy trình không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      Title,
      Description,
      DisplayOrder,
      IsActive,
      Steps,
    } = body;

    if (!Title || !Title.trim()) {
      return NextResponse.json(
        { error: "Tên quy trình không được để trống" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1. Cập nhật bảng Processes (Đã xóa OUTPUT INSERTED)
    const updateResult = await db
      .request()
      .input("Id", processId)
      .input("Title", Title.trim())
      .input("Description", Description || "")
      .input(
        "DisplayOrder",
        Number.isFinite(Number(DisplayOrder)) ? Number(DisplayOrder) : 0
      )
      .input("IsActive", IsActive === false ? 0 : 1)
      .query(`
        UPDATE Processes
        SET
          Title = @Title,
          Description = @Description,
          DisplayOrder = @DisplayOrder,
          IsActive = @IsActive
        WHERE Id = @Id
      `);

    if (updateResult.rowsAffected && updateResult.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy quy trình" },
        { status: 404 }
      );
    }

    // 2. Xóa các bước cũ
    await db
      .request()
      .input("ProcessId", processId)
      .query(`
        DELETE FROM ProcessSteps
        WHERE ProcessId = @ProcessId
      `);

    // 3. Thêm lại các bước mới
    if (Array.isArray(Steps)) {
      for (let i = 0; i < Steps.length; i++) {
        const step = Steps[i];

        if (!step.Title || !step.Title.trim()) {
          continue;
        }

        await db
          .request()
          .input("ProcessId", processId)
          .input("StepNumber", i + 1)
          .input("Title", step.Title.trim())
          .input("Description", step.Description || "")
          .query(`
            INSERT INTO ProcessSteps
            (
              ProcessId,
              StepNumber,
              Title,
              Description
            )
            VALUES
            (
              @ProcessId,
              @StepNumber,
              @Title,
              @Description
            )
          `);
      }
    }

    const updatedProcess = {
      Id: processId,
      Title: Title.trim(),
      Description: Description || "",
      DisplayOrder: Number(DisplayOrder) || 0,
      IsActive: IsActive === false ? 0 : 1,
      Steps: Steps || [],
    };

    return NextResponse.json(updatedProcess);
  } catch (error) {
    console.error("PUT /api/processes/[id] error:", error);

    return NextResponse.json(
      {
        error: "Không thể cập nhật quy trình",
        detail:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const processId = Number(id);

    if (!Number.isInteger(processId)) {
      return NextResponse.json(
        { error: "ID quy trình không hợp lệ" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1. Xóa các bước trong ProcessSteps trước
    await db
      .request()
      .input("ProcessId", processId)
      .query(`
        DELETE FROM ProcessSteps
        WHERE ProcessId = @ProcessId
      `);

    // 2. Xóa quy trình chính trong Processes (Đã xóa OUTPUT DELETED)
    const deleteResult = await db
      .request()
      .input("Id", processId)
      .query(`
        DELETE FROM Processes
        WHERE Id = @Id
      `);

    if (deleteResult.rowsAffected && deleteResult.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy quy trình" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa quy trình",
    });
  } catch (error) {
    console.error("DELETE /api/processes/[id] error:", error);

    return NextResponse.json(
      {
        error: "Không thể xóa quy trình",
        detail:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}