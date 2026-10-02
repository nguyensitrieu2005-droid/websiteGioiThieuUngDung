import Link from "next/link";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type SiteContent = {
  Id: number;

  SiteTitle: string;
  LogoText: string | null;

  HeroTitle: string | null;
  HeroHighlight: string | null;
  HeroDescription: string | null;
  HeroButtonText: string | null;
  ProcessButtonText: string | null;

  IntroLabel: string | null;
  IntroTitle: string | null;
  IntroDescription: string | null;

  IntroItem1: string | null;
  IntroItem2: string | null;
  IntroItem3: string | null;
  IntroItem4: string | null;

  ModuleCount: string | null;
  ModuleCountText: string | null;

  WorkflowCount: string | null;
  WorkflowCountText: string | null;

  FlowTitle: string | null;
  FlowDescription: string | null;

  CtaTitle: string | null;
  CtaDescription: string | null;
  CtaButtonText: string | null;

  FooterText: string | null;
};

type Feature = {
  Id: number;
  Title: string;
  Description: string | null;
  Icon: string | null;
  DisplayOrder: number;
  IsActive: boolean;
  DetailContent: string | null;
};

type Process = {
  Id: number;
  Title: string;
  Description: string | null;
  DisplayOrder: number;
  IsActive: boolean;
};

type ProcessStep = {
  Id: number;
  ProcessId: number;
  StepNumber: number;
  Title: string;
  Description: string | null;
};

type DashboardData = {
  Id: number;
  Revenue: number;
  InventoryValue: number;
  ProductCount: number;
  Month: string | null;
};

export default async function Home() {
  const db = await getDb();

  /* =========================
     SITE SETTINGS
  ========================= */

  const siteResult =
    await db.request().query<SiteContent>(`
      SELECT TOP 1
        Id,
        SiteTitle,
        LogoText,

        HeroTitle,
        HeroHighlight,
        HeroDescription,
        HeroButtonText,
        ProcessButtonText,

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
        FlowDescription,

        CtaTitle,
        CtaDescription,
        CtaButtonText,

        FooterText

      FROM SiteSettings
      ORDER BY Id ASC
    `);

  const content =
    siteResult.recordset[0];

  /* =========================
     FEATURES
  ========================= */

  const featuresResult =
    await db.request().query<Feature>(`
      SELECT
        Id,
        Title,
        Description,
        Icon,
        DisplayOrder,
        IsActive,
        DetailContent
      FROM Features
      WHERE IsActive = 1
      ORDER BY DisplayOrder ASC, Id ASC
    `);

  const features =
    featuresResult.recordset;

  /* =========================
     PROCESSES
  ========================= */

  const processesResult =
    await db.request().query<Process>(`
      SELECT
        Id,
        Title,
        Description,
        DisplayOrder,
        IsActive
      FROM Processes
      WHERE IsActive = 1
      ORDER BY DisplayOrder ASC, Id ASC
    `);

  const processes =
    processesResult.recordset;

  /* =========================
     PROCESS STEPS
  ========================= */

  const stepsResult =
    await db.request().query<ProcessStep>(`
      SELECT
        Id,
        ProcessId,
        StepNumber,
        Title,
        Description
      FROM ProcessSteps
      ORDER BY
        ProcessId ASC,
        StepNumber ASC,
        Id ASC
    `);

  const processSteps =
    stepsResult.recordset;

  /* =========================
     DASHBOARD
  ========================= */

  const dashboardResult =
    await db.request().query<DashboardData>(`
      SELECT TOP 1
        Id,
        Revenue,
        InventoryValue,
        ProductCount,
        Month
      FROM DashboardDemo
      ORDER BY Id DESC
    `);

  const dashboard =
    dashboardResult.recordset[0];

  /* =========================
     DATABASE EMPTY
  ========================= */

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">

          <h1 className="text-2xl font-bold">
            Chưa có dữ liệu website
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            Hãy thêm dữ liệu vào bảng
            SiteSettings trong SQL Server.
          </p>

        </div>

      </main>
    );
  }

  /* =========================
     INTRO ITEMS
  ========================= */

  const introItems = [
    content.IntroItem1,
    content.IntroItem2,
    content.IntroItem3,
    content.IntroItem4,
  ].filter(
    (item): item is string =>
      Boolean(
        item &&
        item.trim()
      )
  );

  return (
    <main className="min-h-screen scroll-smooth bg-white text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <a
            href="#top"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              A
            </div>

            <div>

              <div className="text-lg font-bold">
                {content.LogoText ||
                  "Admin ERP"}
              </div>

              <div className="text-xs text-slate-500">
                {content.SiteTitle}
              </div>

            </div>

          </a>

          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#top"
              className="text-sm font-semibold text-blue-600"
            >
              Trang chủ
            </a>

            <a
              href="#intro"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Giới thiệu
            </a>

            <a
              href="#features"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Chức năng
            </a>

            <a
              href="#processes"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Quy trình
            </a>

          </nav>

          <Link
            href="/lien-he"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Liên hệ
          </Link>

        </div>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="top"
        className="relative scroll-mt-20 overflow-hidden bg-slate-950 pt-32"
      >

        <div className="absolute inset-0">

          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">

              <span className="h-2 w-2 rounded-full bg-blue-400" />

              Giải pháp quản lý doanh nghiệp

            </div>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">

              {content.HeroTitle ||
                "Quản lý doanh nghiệp"}

              <span className="block text-blue-400">
                {content.HeroHighlight ||
                  "toàn diện"}
              </span>

            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">

              {content.HeroDescription ||
                "Giải pháp quản lý doanh nghiệp tập trung, kết nối dữ liệu và quy trình vận hành."}

            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="#features"
                className="rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-700"
              >
                {content.HeroButtonText ||
                  "Xem chức năng"}
              </a>

              <a
                href="#processes"
                className="rounded-lg border border-slate-600 px-6 py-3.5 font-semibold text-white hover:bg-slate-800"
              >
                {content.ProcessButtonText ||
                  "Xem quy trình"}
              </a>

            </div>

          </div>

          {/* DASHBOARD */}

          <div className="relative">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl">

              <div className="rounded-xl bg-white p-5">

                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <div className="text-sm text-slate-500">
                      Tổng quan
                    </div>

                    <div className="mt-1 text-xl font-bold">
                      Dashboard
                    </div>

                  </div>

                  <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600">
                    {dashboard?.Month ||
                      "Tháng hiện tại"}
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <div className="text-xs text-slate-500">
                      Doanh thu
                    </div>

                    <div className="mt-2 text-xl font-bold">
                      {dashboard
                        ? `${Number(
                            dashboard.Revenue
                          ).toLocaleString(
                            "vi-VN"
                          )} đ`
                        : "0 đ"}
                    </div>

                    <div className="mt-1 text-xs text-green-600">
                      Doanh thu hiện tại
                    </div>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <div className="text-xs text-slate-500">
                      Tồn kho
                    </div>

                    <div className="mt-2 text-xl font-bold">
                      {dashboard
                        ? `${Number(
                            dashboard.InventoryValue
                          ).toLocaleString(
                            "vi-VN"
                          )} đ`
                        : "0 đ"}
                    </div>

                    <div className="mt-1 text-xs text-blue-600">
                      {dashboard?.ProductCount ||
                        0}{" "}
                      mặt hàng
                    </div>

                  </div>

                  <div className="col-span-2 rounded-xl bg-blue-600 p-5 text-white">

                    <div className="text-sm text-blue-100">
                      Luồng hoạt động
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs">

                      <span>
                        Mua hàng
                      </span>

                      <span>
                        →
                      </span>

                      <span>
                        Kho
                      </span>

                      <span>
                        →
                      </span>

                      <span>
                        Sản xuất
                      </span>

                      <span>
                        →
                      </span>

                      <span>
                        Bán hàng
                      </span>

                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-blue-400/40">

                      <div className="h-full w-4/5 rounded-full bg-white" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        id="intro"
        className="scroll-mt-20 mx-auto max-w-7xl px-6 py-24"
      >

        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              {content.IntroLabel ||
                "Một hệ thống — nhiều nghiệp vụ"}
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              {content.IntroTitle ||
                "Số hóa toàn bộ quy trình vận hành doanh nghiệp"}
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              {content.IntroDescription ||
                "Hệ thống giúp doanh nghiệp kết nối các bộ phận và theo dõi xuyên suốt dòng chảy hàng hóa, tiền và công nợ."}
            </p>

            <div className="mt-8 space-y-4">

              {introItems.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >

                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      ✓
                    </div>

                    <span className="text-slate-700">
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

          <div className="rounded-2xl bg-slate-50 p-8">

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="text-3xl font-bold text-blue-600">
                  {content.ModuleCount ||
                    `${features.length}+`}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {content.ModuleCountText ||
                    "Phân hệ quản lý"}
                </div>

              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">

                <div className="text-3xl font-bold text-blue-600">
                  {content.WorkflowCount ||
                    `${processes.length}`}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {content.WorkflowCountText ||
                    "Luồng nghiệp vụ chính"}
                </div>

              </div>

              <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm">

                <div className="text-sm font-semibold">
                  {content.FlowTitle ||
                    "Mua hàng → Kho → Sản xuất → Bán hàng"}
                </div>

                <div className="mt-3 text-sm leading-6 text-slate-500">
                  {content.FlowDescription ||
                    "Dữ liệu được liên kết giữa các nghiệp vụ giúp doanh nghiệp dễ dàng theo dõi toàn bộ quá trình vận hành."}
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="scroll-mt-20 bg-slate-50 py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Chức năng
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Các phân hệ chính
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Các nghiệp vụ được kết nối trong cùng một hệ thống để hỗ trợ doanh nghiệp quản lý tập trung.
            </p>

          </div>

          {/* CARDS */}

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {features.map(
              (feature, index) => (

                <div
                  key={feature.Id}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >

                  <div className="text-sm font-bold text-blue-600">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {feature.Title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.Description}
                  </p>

                  <a
                    href={`#feature-detail-${feature.Id}`}
                    className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Tìm hiểu thêm →
                  </a>

                </div>

              )
            )}

          </div>

          {/* =================================================
              FEATURE DETAILS
          ================================================= */}

          <div className="mt-16 space-y-8">

            {features.map(
              (feature) => (

                <section
                  key={feature.Id}
                  id={`feature-detail-${feature.Id}`}
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                      {String(
                        feature.DisplayOrder
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div>

                      <h3 className="text-2xl font-bold text-slate-900">
                        {feature.Title}
                      </h3>

                      {feature.Description && (
                        <p className="mt-3 leading-7 text-slate-600">
                          {
                            feature.Description
                          }
                        </p>
                      )}

                    </div>

                  </div>

                  {feature.DetailContent ? (

                    <div className="mt-8 whitespace-pre-line rounded-xl bg-slate-50 p-6 leading-8 text-slate-700">
                      {
                        feature.DetailContent
                      }
                    </div>

                  ) : (

                    <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-slate-400">
                      Chưa có nội dung chi tiết cho chức năng này.
                    </div>

                  )}

                  <div className="mt-6">

                    <a
                      href="#features"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      ↑ Quay lại danh sách chức năng
                    </a>

                  </div>

                </section>

              )
            )}

          </div>

          {features.length === 0 && (

            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Chưa có chức năng nào.
            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          PROCESSES
      ===================================================== */}

      <section
        id="processes"
        className="scroll-mt-20 mx-auto max-w-7xl px-6 py-24"
      >

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Quy trình nghiệp vụ
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Các luồng vận hành chính
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Từ lúc hàng hóa được mua vào cho đến khi sản phẩm được bán ra, hệ thống quản lý toàn bộ quá trình.
          </p>

        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">

          {processes.map(
            (process, index) => {

              const steps =
                processSteps.filter(
                  (step) =>
                    step.ProcessId ===
                    process.Id
                );

              return (
                <div
                  key={process.Id}
                  className="rounded-2xl border border-slate-200 p-7"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <h3 className="text-xl font-bold">
                      {process.Title}
                    </h3>

                  </div>

                  {process.Description && (

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {
                        process.Description
                      }
                    </p>

                  )}

                  <div className="mt-7 space-y-3">

                    {steps.map(
                      (step) => (

                        <div
                          key={step.Id}
                          className="flex items-start gap-3"
                        >

                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                            {
                              step.StepNumber
                            }
                          </div>

                          <div>

                            <div className="text-sm font-medium text-slate-700">
                              {
                                step.Title
                              }
                            </div>

                            {step.Description && (

                              <div className="text-xs leading-5 text-slate-500">
                                {
                                  step.Description
                                }
                              </div>

                            )}

                          </div>

                        </div>

                      )
                    )}

                    {steps.length === 0 && (

                      <div className="text-sm text-slate-400">
                        Chưa có bước nào.
                      </div>

                    )}

                  </div>

                </div>
              );
            }
          )}

          {processes.length === 0 && (

            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Chưa có quy trình nào.
            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="bg-blue-600">

        <div className="mx-auto max-w-7xl px-6 py-20 text-center text-white">

          <h2 className="text-3xl font-bold sm:text-4xl">
            {content.CtaTitle ||
              "Quản lý doanh nghiệp hiệu quả hơn"}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            {content.CtaDescription ||
              "Kết nối dữ liệu, quy trình và các bộ phận trên cùng một nền tảng."}
          </p>

          <a
            href="#intro"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-600 hover:bg-blue-50"
          >
            {content.CtaButtonText ||
              "Tìm hiểu phần mềm"}
          </a>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t bg-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 sm:flex-row">

          <div>

            <a
              href="#top"
              className="font-bold"
            >
              {content.LogoText ||
                "Admin ERP"}
            </a>

            <div className="mt-1 text-sm text-slate-500">
              {content.FooterText ||
                ""}
            </div>

          </div>

          <div className="text-sm text-slate-500">
            © 2026{" "}
            {content.LogoText ||
              "Admin ERP"}. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}