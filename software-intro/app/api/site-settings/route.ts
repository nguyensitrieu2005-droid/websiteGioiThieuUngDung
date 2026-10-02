import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const result = await db.request().query(`
      SELECT
        Id,
        IntroLabel,
        IntroTitle,
        IntroDescription,
        IntroItem1,
        IntroItem2,
        IntroItem3,
        IntroItem4,
        ModuleCount,
        ModuleCountText,
        WorkflowCount,
        WorkflowCountText,
        FlowTitle,
        FlowDescription
      FROM SiteSettings
      ORDER BY Id ASC
      LIMIT 1
    `);

    const content = result.recordset[0];

    if (!content) {
      return NextResponse.json(
        { error: "Chưa có dữ liệu SiteSettings" },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error("Lỗi GET SiteSettings:", error);
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu SiteSettings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const requestDb = db.request();

    requestDb.input("IntroLabel", body.IntroLabel || "");
    requestDb.input("IntroTitle", body.IntroTitle || "");
    requestDb.input("IntroDescription", body.IntroDescription || "");
    requestDb.input("IntroItem1", body.IntroItem1 || "");
    requestDb.input("IntroItem2", body.IntroItem2 || "");
    requestDb.input("IntroItem3", body.IntroItem3 || "");
    requestDb.input("IntroItem4", body.IntroItem4 || "");
    requestDb.input("ModuleCount", body.ModuleCount || "");
    requestDb.input("ModuleCountText", body.ModuleCountText || "");
    requestDb.input("WorkflowCount", body.WorkflowCount || "");
    requestDb.input("WorkflowCountText", body.WorkflowCountText || "");
    requestDb.input("FlowTitle", body.FlowTitle || "");
    requestDb.input("FlowDescription", body.FlowDescription || "");

    await requestDb.query(`
      UPDATE SiteSettings
      SET
        IntroLabel = @IntroLabel,
        IntroTitle = @IntroTitle,
        IntroDescription = @IntroDescription,
        IntroItem1 = @IntroItem1,
        IntroItem2 = @IntroItem2,
        IntroItem3 = @IntroItem3,
        IntroItem4 = @IntroItem4,
        ModuleCount = @ModuleCount,
        ModuleCountText = @ModuleCountText,
        WorkflowCount = @WorkflowCount,
        WorkflowCountText = @WorkflowCountText,
        FlowTitle = @FlowTitle,
        FlowDescription = @FlowDescription
      ORDER BY Id ASC
      LIMIT 1
    `);

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật nội dung",
    });
  } catch (error: any) {
    console.error("Lỗi PUT SiteSettings:", error);
    return NextResponse.json(
      { error: error.message || "Không thể cập nhật SiteSettings" },
      { status: 500 }
    );
  }
}