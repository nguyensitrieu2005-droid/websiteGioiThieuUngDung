"use client";

import { useEffect, useState } from "react";

type IntroContent = {
  IntroLabel: string;
  IntroTitle: string;
  IntroDescription: string;

  IntroItem1: string;
  IntroItem2: string;
  IntroItem3: string;
  IntroItem4: string;

  ModuleCount: string;
  ModuleCountText: string;

  WorkflowCount: string;
  WorkflowCountText: string;

  FlowTitle: string;
  FlowDescription: string;
};

const emptyContent: IntroContent = {
  IntroLabel: "",
  IntroTitle: "",
  IntroDescription: "",

  IntroItem1: "",
  IntroItem2: "",
  IntroItem3: "",
  IntroItem4: "",

  ModuleCount: "",
  ModuleCountText: "",

  WorkflowCount: "",
  WorkflowCountText: "",

  FlowTitle: "",
  FlowDescription: "",
};

export default function IntroductionAdminPage() {
  const [form, setForm] = useState<IntroContent>(emptyContent);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/site-settings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error);
      }

      setForm({
        IntroLabel: data.IntroLabel || "",
        IntroTitle: data.IntroTitle || "",
        IntroDescription: data.IntroDescription || "",

        IntroItem1: data.IntroItem1 || "",
        IntroItem2: data.IntroItem2 || "",
        IntroItem3: data.IntroItem3 || "",
        IntroItem4: data.IntroItem4 || "",

        ModuleCount: data.ModuleCount || "",
        ModuleCountText: data.ModuleCountText || "",

        WorkflowCount: data.WorkflowCount || "",
        WorkflowCountText: data.WorkflowCountText || "",

        FlowTitle: data.FlowTitle || "",
        FlowDescription: data.FlowDescription || "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải nội dung"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof IntroContent,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveContent() {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error);
      }

      setMessage("✓ Đã lưu nội dung thành công");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu nội dung"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-slate-600">
          Đang tải...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Quản lý giới thiệu
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Chỉnh sửa phần "Số hóa toàn bộ quy trình vận hành doanh nghiệp"
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin"
              className="rounded-lg border bg-white px-5 py-2 font-semibold hover:bg-slate-50"
            >
              Admin
            </a>

            <a
              href="/"
              target="_blank"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Xem website
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* MAIN FORM */}

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-xl font-bold">
              Nội dung chính
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Các nội dung ở đây sẽ hiển thị trực tiếp trên trang chủ.
            </p>
          </div>

          {/* LABEL */}

          <div className="mt-8">
            <label className="mb-2 block font-semibold">
              Nhãn phía trên
            </label>

            <input
              value={form.IntroLabel}
              onChange={(e) =>
                updateField("IntroLabel", e.target.value)
              }
              placeholder="Một hệ thống — nhiều nghiệp vụ"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* TITLE */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Tiêu đề
            </label>

            <input
              value={form.IntroTitle}
              onChange={(e) =>
                updateField("IntroTitle", e.target.value)
              }
              placeholder="Số hóa toàn bộ quy trình vận hành doanh nghiệp"
              className="w-full rounded-xl border px-4 py-3 text-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Mô tả
            </label>

            <textarea
              value={form.IntroDescription}
              onChange={(e) =>
                updateField(
                  "IntroDescription",
                  e.target.value
                )
              }
              rows={5}
              placeholder="Nhập mô tả..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* ITEMS */}

          <div className="mt-8">
            <h3 className="text-lg font-bold">
              Các nội dung có dấu ✓
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nội dung 1
                </label>

                <input
                  value={form.IntroItem1}
                  onChange={(e) =>
                    updateField(
                      "IntroItem1",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nội dung 2
                </label>

                <input
                  value={form.IntroItem2}
                  onChange={(e) =>
                    updateField(
                      "IntroItem2",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nội dung 3
                </label>

                <input
                  value={form.IntroItem3}
                  onChange={(e) =>
                    updateField(
                      "IntroItem3",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nội dung 4
                </label>

                <input
                  value={form.IntroItem4}
                  onChange={(e) =>
                    updateField(
                      "IntroItem4",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* STATISTICS */}

          <div className="mt-10">
            <h3 className="text-lg font-bold">
              Hai ô thống kê
            </h3>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Số lượng phân hệ
                </label>

                <input
                  value={form.ModuleCount}
                  onChange={(e) =>
                    updateField(
                      "ModuleCount",
                      e.target.value
                    )
                  }
                  placeholder="6+"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Chữ dưới số lượng phân hệ
                </label>

                <input
                  value={form.ModuleCountText}
                  onChange={(e) =>
                    updateField(
                      "ModuleCountText",
                      e.target.value
                    )
                  }
                  placeholder="Phân hệ quản lý"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Số lượng luồng nghiệp vụ
                </label>

                <input
                  value={form.WorkflowCount}
                  onChange={(e) =>
                    updateField(
                      "WorkflowCount",
                      e.target.value
                    )
                  }
                  placeholder="3"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Chữ dưới số lượng luồng
                </label>

                <input
                  value={form.WorkflowCountText}
                  onChange={(e) =>
                    updateField(
                      "WorkflowCountText",
                      e.target.value
                    )
                  }
                  placeholder="Luồng nghiệp vụ chính"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* FLOW */}

          <div className="mt-10">
            <h3 className="text-lg font-bold">
              Luồng hoạt động
            </h3>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Tiêu đề luồng
              </label>

              <input
                value={form.FlowTitle}
                onChange={(e) =>
                  updateField(
                    "FlowTitle",
                    e.target.value
                  )
                }
                placeholder="Mua hàng → Kho → Sản xuất → Bán hàng"
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Mô tả luồng
              </label>

              <textarea
                value={form.FlowDescription}
                onChange={(e) =>
                  updateField(
                    "FlowDescription",
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Nhập mô tả..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>
          </div>

          {/* SAVE */}

          <div className="mt-8 flex items-center gap-5 border-t pt-6">
            <button
              onClick={saveContent}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Đang lưu..."
                : "Lưu thay đổi"}
            </button>

            {message && (
              <span
                className={
                  message.startsWith("✓")
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {message}
              </span>
            )}
          </div>
        </section>

        {/* PREVIEW */}

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">
            Xem trước
          </h2>

          <div className="mt-6 rounded-2xl bg-slate-50 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              {form.IntroLabel || "Nhãn"}
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              {form.IntroTitle || "Tiêu đề"}
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-slate-600">
              {form.IntroDescription || "Mô tả"}
            </p>

            <div className="mt-6 space-y-3">
              {[
                form.IntroItem1,
                form.IntroItem2,
                form.IntroItem3,
                form.IntroItem4,
              ]
                .filter(Boolean)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      ✓
                    </div>

                    <span>
                      {item}
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">
                  {form.ModuleCount}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {form.ModuleCountText}
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">
                  {form.WorkflowCount}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {form.WorkflowCountText}
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm sm:col-span-2">
                <div className="font-semibold">
                  {form.FlowTitle}
                </div>

                <div className="mt-3 text-sm leading-6 text-slate-500">
                  {form.FlowDescription}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}