import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const result = await db.request().query(`
      SELECT TOP 1
        Id,
        SiteTitle,
        LogoText,
        HeroTitle,
        HeroHighlight,
        HeroDescription,
        HeroButtonText,
        ProcessButtonText,
        FooterText
      FROM SiteSettings
      ORDER BY Id ASC
    `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "Chưa có dữ liệu SiteSettings" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error("DATABASE GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Lỗi database",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      Id,
      SiteTitle,
      LogoText,
      HeroTitle,
      HeroHighlight,
      HeroDescription,
      HeroButtonText,
      ProcessButtonText,
      FooterText,
    } = body;

    if (!Id) {
      return NextResponse.json(
        { error: "Thiếu Id" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db
      .request()
      .input("Id", sql.Int, Id)
      .input("SiteTitle", sql.NVarChar(255), SiteTitle)
      .input("LogoText", sql.NVarChar(255), LogoText)
      .input("HeroTitle", sql.NVarChar(255), HeroTitle)
      .input("HeroHighlight", sql.NVarChar(255), HeroHighlight)
      .input("HeroDescription", sql.NVarChar(sql.MAX), HeroDescription)
      .input("HeroButtonText", sql.NVarChar(100), HeroButtonText)
      .input("ProcessButtonText", sql.NVarChar(100), ProcessButtonText)
      .input("FooterText", sql.NVarChar(sql.MAX), FooterText)
      .query(`
        UPDATE SiteSettings
        SET
          SiteTitle = @SiteTitle,
          LogoText = @LogoText,
          HeroTitle = @HeroTitle,
          HeroHighlight = @HeroHighlight,
          HeroDescription = @HeroDescription,
          HeroButtonText = @HeroButtonText,
          ProcessButtonText = @ProcessButtonText,
          FooterText = @FooterText
        WHERE Id = @Id
      `);

    return NextResponse.json({
      success: true,
      message: "Đã lưu nội dung",
    });
  } catch (error) {
    console.error("DATABASE PUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Lưu thất bại",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}