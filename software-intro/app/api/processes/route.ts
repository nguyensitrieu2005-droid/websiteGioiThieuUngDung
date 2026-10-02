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

    const data = processes.map((process) => ({
      ...process,
      Steps: steps.filter(
        (step) => step.ProcessId === process.Id
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

    const transaction = db.transaction();

    await transaction.begin();

    try {
      const processResult = await transaction
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
          OUTPUT
            INSERTED.Id,
            INSERTED.Title,
            INSERTED.Description,
            INSERTED.DisplayOrder,
            INSERTED.IsActive
          VALUES
          (
            @Title,
            @Description,
            @DisplayOrder,
            @IsActive
          )
        `);

      const process = processResult.recordset[0];

      if (Array.isArray(Steps)) {
        for (let i = 0; i < Steps.length; i++) {
          const step = Steps[i];

          if (!step.Title || !step.Title.trim()) {
            continue;
          }

          await transaction
            .request()
            .input("ProcessId", process.Id)
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

      await transaction.commit();

      return NextResponse.json(
        {
          ...process,
          Steps: Steps || [],
        },
        { status: 201 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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