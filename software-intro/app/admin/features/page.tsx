"use client";

import { useEffect, useState } from "react";

type Feature = {
  Id: number;
  Title: string;
  Description: string | null;
  Icon: string | null;
  DisplayOrder: number;
  IsActive: boolean;
  DetailContent: string | null;
};

type FeatureForm = {
  Title: string;
  Description: string;
  Icon: string;
  DisplayOrder: number;
  IsActive: boolean;
  DetailContent: string;
};

const emptyForm: FeatureForm = {
  Title: "",
  Description: "",
  Icon: "",
  DisplayOrder: 0,
  IsActive: true,
  DetailContent: "",
};

export default function FeaturesAdminPage() {
  const [features, setFeatures] = useState<Feature[]>([]);

  const [form, setForm] =
    useState<FeatureForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "/api/features",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Không thể tải chức năng"
        );
      }

      setFeatures(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách chức năng"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof FeatureForm,
    value: string | number | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function editFeature(feature: Feature) {
    setEditingId(feature.Id);

    setForm({
      Title: feature.Title || "",
      Description:
        feature.Description || "",
      Icon: feature.Icon || "",
      DisplayOrder:
        feature.DisplayOrder || 0,
      IsActive:
        Boolean(feature.IsActive),
      DetailContent:
        feature.DetailContent || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function saveFeature() {
    try {
      setSaving(true);
      setMessage("");

      const url = editingId
        ? `/api/features/${editingId}`
        : "/api/features";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Không thể lưu chức năng"
        );
      }

      if (editingId) {
        setMessage(
          "✓ Đã cập nhật chức năng và chi tiết"
        );
      } else {
        setMessage(
          "✓ Đã thêm chức năng"
        );
      }

      await loadFeatures();

      if (!editingId && data?.Id) {
        setEditingId(data.Id);

        setForm({
          Title: data.Title || "",
          Description:
            data.Description || "",
          Icon: data.Icon || "",
          DisplayOrder:
            data.DisplayOrder || 0,
          IsActive:
            Boolean(data.IsActive),
          DetailContent:
            data.DetailContent || "",
        });
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu chức năng"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteFeature(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Bạn có chắc muốn xóa chức năng này?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `/api/features/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Không thể xóa chức năng"
        );
      }

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      setMessage(
        "✓ Đã xóa chức năng"
      );

      await loadFeatures();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể xóa chức năng"
      );
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
            <h1 className="text-2xl font-bold text-slate-900">
              Quản lý chức năng
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Quản lý chức năng và nội dung chi tiết
              hiển thị trên website.
            </p>
          </div>

          <div className="flex gap-3">

            <a
              href="/admin"
              className="rounded-lg border border-slate-200 bg-white px-5 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Admin
            </a>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Xem website
            </a>

          </div>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* FORM */}

        <section className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {editingId
                  ? "Chỉnh sửa chức năng"
                  : "Thêm chức năng"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Chức năng và chi tiết chức năng được lưu
                chung trong bảng Features.
              </p>

            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy chỉnh sửa
              </button>
            )}

          </div>

          {/* TÊN + ICON */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold text-slate-700">
                Tên chức năng
              </label>

              <input
                value={form.Title}
                onChange={(e) =>
                  updateForm(
                    "Title",
                    e.target.value
                  )
                }
                placeholder="Ví dụ: Mua hàng"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold text-slate-700">
                Icon
              </label>

              <input
                value={form.Icon}
                onChange={(e) =>
                  updateForm(
                    "Icon",
                    e.target.value
                  )
                }
                placeholder="cart"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* ORDER + ACTIVE */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold text-slate-700">
                Thứ tự hiển thị
              </label>

              <input
                type="number"
                value={
                  form.DisplayOrder
                }
                onChange={(e) =>
                  updateForm(
                    "DisplayOrder",
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-3 pt-8">

              <input
                type="checkbox"
                checked={
                  form.IsActive
                }
                onChange={(e) =>
                  updateForm(
                    "IsActive",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />

              <label className="font-semibold text-slate-700">
                Hiển thị chức năng trên website
              </label>

            </div>

          </div>

          {/* MÔ TẢ */}

          <div className="mt-6">

            <label className="mb-2 block font-semibold text-slate-700">
              Mô tả ngắn
            </label>

            <textarea
              value={
                form.Description
              }
              onChange={(e) =>
                updateForm(
                  "Description",
                  e.target.value
                )
              }
              rows={4}
              placeholder="Quản lý đơn mua, nhà cung cấp và quá trình nhập hàng."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* CHI TIẾT */}

          <div className="mt-8 border-t pt-8">

            <h3 className="text-lg font-bold text-slate-900">
              Chi tiết chức năng
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Nội dung này sẽ hiển thị khi người dùng
              bấm "Tìm hiểu thêm" trên website.
            </p>

            <textarea
              value={
                form.DetailContent
              }
              onChange={(e) =>
                updateForm(
                  "DetailContent",
                  e.target.value
                )
              }
              rows={18}
              placeholder={`Ví dụ:

Bước 1: Tạo đơn mua
Mô tả bước thực hiện...

Bước 2: Chọn nhà cung cấp
Mô tả bước thực hiện...

Bước 3: Nhập kho
Mô tả bước thực hiện...

Bước 4: Theo dõi công nợ
Mô tả bước thực hiện...`}
              className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-4 font-mono text-sm leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* SAVE */}

          <div className="mt-6 flex flex-wrap items-center gap-4">

            <button
              type="button"
              onClick={
                saveFeature
              }
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Đang lưu..."
                : editingId
                ? "Cập nhật"
                : "Thêm chức năng"}
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

        {/* DANH SÁCH */}

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Danh sách chức năng
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {features.length} chức năng
            </p>

          </div>

          <div className="mt-6 space-y-4">

            {features.map(
              (feature) => (

                <div
                  key={feature.Id}
                  className="flex flex-col gap-5 rounded-xl border border-slate-200 p-5 md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                      {String(
                        feature.DisplayOrder
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-slate-900">
                          {
                            feature.Title
                          }
                        </h3>

                        <span
                          className={
                            feature.IsActive
                              ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                              : "rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500"
                          }
                        >
                          {feature.IsActive
                            ? "Đang hiển thị"
                            : "Đang ẩn"}
                        </span>

                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {feature.Description ||
                          "Chưa có mô tả."}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">

                        {feature.DetailContent
                          ? "✓ Đã có chi tiết chức năng"
                          : "Chưa có chi tiết chức năng"}

                      </p>

                    </div>

                  </div>

                  <div className="flex shrink-0 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        editFeature(
                          feature
                        )
                      }
                      className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteFeature(
                          feature.Id
                        )
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
                    >
                      Xóa
                    </button>

                  </div>

                </div>

              )
            )}

            {features.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                Chưa có chức năng nào.
              </div>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}