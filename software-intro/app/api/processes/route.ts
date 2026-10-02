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
        DisplayOrder,
        IsActive
      FROM Processes
      ORDER BY DisplayOrder ASC, Id ASC
    `);

    const processes = result.recordset;

    const stepsResult = await db.request().query(`
      SELECT
        Id,
        ProcessId,
        StepNumber,
        Title,
        Description
      FROM ProcessSteps
      ORDER BY StepNumber ASC, Id ASC
    `);

    const steps = stepsResult.recordset;

    const data = processes.map((process: any) => ({
      ...process,
      Steps: steps.filter(
        (step: any) => step.ProcessId === process.Id
      ),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/processes error:", error);

    return NextResponse.json(
      {
        error: "Không thể tải danh sách quy trình",
        detail:
          error instanceof Error
            ? error.message
            : "Unknown error",
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
      DisplayOrder,
      IsActive,
      Steps,
    } = body;

    if (!Title || !Title.trim()) {
      return NextResponse.json(
        {
          error: "Tên quy trình không được để trống",
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 1. Thêm bản ghi vào bảng Processes (Chuyển cú pháp từ MSSQL OUTPUT sang MySQL)
    const insertResult = await db
      .request()
      .input("Title", Title.trim())
      .input("Description", Description || "")
      .input(
        "DisplayOrder",
        Number.isFinite(Number(DisplayOrder))
          ? Number(DisplayOrder)
          : 0
      )
      .input(
        "IsActive",
        IsActive === false ? 0 : 1
      )
      .query(`
        INSERT INTO Processes
        (
          Title,
          Description,
          DisplayOrder,
          IsActive
        )
        VALUES
        (
          @Title,
          @Description,
          @DisplayOrder,
          @IsActive
        )
      `);

    // 2. Lấy ID vừa được tạo tự động trong MySQL
    const insertedId =
      insertResult.insertId ||
      insertResult.recordset?.insertId ||
      (await db.request().query("SELECT LAST_INSERT_ID() AS Id")).recordset[0]?.Id;

    const newProcess = {
      Id: insertedId,
      Title: Title.trim(),
      Description: Description || "",
      DisplayOrder: Number(DisplayOrder) || 0,
      IsActive: IsActive === false ? 0 : 1,
    };

    // 3. Chèn danh sách các bước (ProcessSteps) nếu có
    if (Array.isArray(Steps)) {
      for (let i = 0; i < Steps.length; i++) {
        const step = Steps[i];

        if (!step.Title || !step.Title.trim()) {
          continue;
        }

        await db
          .request()
          .input("ProcessId", newProcess.Id)
          .input("StepNumber", i + 1)
          .input("Title", step.Title.trim())
          .input(
            "Description",
            step.Description || ""
          )
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

    return NextResponse.json(
      {
        ...newProcess,
        Steps: Steps || [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/processes error:", error);

    return NextResponse.json(
      {
        error: "Không thể thêm quy trình",
        detail:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}