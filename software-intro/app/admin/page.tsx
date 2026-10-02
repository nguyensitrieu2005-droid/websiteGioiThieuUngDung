"use client";

import { useEffect, useState } from "react";

type Content = {
  Id: number;
  SiteTitle: string;
  LogoText: string;
  HeroTitle: string;
  HeroHighlight: string;
  HeroDescription: string;
  HeroButtonText: string;
  ProcessButtonText: string;
  FooterText: string;
};

const defaultContent: Content = {
  Id: 1,
  SiteTitle: "",
  LogoText: "",
  HeroTitle: "",
  HeroHighlight: "",
  HeroDescription: "",
  HeroButtonText: "",
  ProcessButtonText: "",
  FooterText: "",
};

export default function AdminPage() {
  const [content, setContent] = useState<Content>(defaultContent);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);

      const response = await fetch("/api/content", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Không thể lấy nội dung");
      }

      setContent(data);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể lấy nội dung"
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveContent() {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Lưu thất bại");
      }

      setMessage("✓ Đã lưu nội dung vào database");

      await loadContent();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Lưu thất bại"
      );
    } finally {
      setSaving(false);
    }
  }

  function updateField(
    field: keyof Content,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p>Đang tải nội dung...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Admin
            </h1>

            <p className="text-sm text-slate-500">
              Quản lý nội dung website
            </p>
          </div>

          <a
            href="/"
            className="rounded-lg border px-5 py-2 hover:bg-slate-50"
          >
            Xem website
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold">
            Chỉnh sửa trang chủ
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Nội dung được lưu trực tiếp vào SQL Server.
          </p>

          {/* Tên website */}

          <div className="mt-8">
            <label className="mb-2 block font-semibold">
              Tên website
            </label>

            <input
              value={content.SiteTitle}
              onChange={(e) =>
                updateField("SiteTitle", e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Logo */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Logo
            </label>

            <input
              value={content.LogoText}
              onChange={(e) =>
                updateField("LogoText", e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Hero title */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Tiêu đề chính
            </label>

            <input
              value={content.HeroTitle}
              onChange={(e) =>
                updateField("HeroTitle", e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Hero highlight */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Tiêu đề nổi bật
            </label>

            <input
              value={content.HeroHighlight}
              onChange={(e) =>
                updateField(
                  "HeroHighlight",
                  e.target.value
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Description */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Mô tả
            </label>

            <textarea
              value={content.HeroDescription}
              onChange={(e) =>
                updateField(
                  "HeroDescription",
                  e.target.value
                )
              }
              rows={4}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Hero button */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Nội dung nút khám phá
            </label>

            <input
              value={content.HeroButtonText}
              onChange={(e) =>
                updateField(
                  "HeroButtonText",
                  e.target.value
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Process button */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Nội dung nút quy trình
            </label>

            <input
              value={content.ProcessButtonText}
              onChange={(e) =>
                updateField(
                  "ProcessButtonText",
                  e.target.value
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Footer */}

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Footer
            </label>

            <textarea
              value={content.FooterText}
              onChange={(e) =>
                updateField(
                  "FooterText",
                  e.target.value
                )
              }
              rows={3}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          {/* Buttons */}

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={saveContent}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu nội dung"}
            </button>

            <button
              onClick={loadContent}
              disabled={saving}
              className="rounded-xl border px-6 py-3 font-semibold"
            >
              Tải lại
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
        </div>
      </div>
    </main>
  );
}