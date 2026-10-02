"use client";

import { useEffect, useState } from "react";

type ProcessStep = {
  Id?: number;
  ProcessId?: number;
  StepNumber: number;
  Title: string;
  Description: string;
};

type Process = {
  Id: number;
  Title: string;
  Description: string;
  DisplayOrder: number;
  IsActive: boolean;
  Steps: ProcessStep[];
};

type StepForm = {
  Title: string;
  Description: string;
};

const emptyProcess = {
  Title: "",
  Description: "",
  DisplayOrder: 0,
  IsActive: true,
};

const emptyStep = {
  Title: "",
  Description: "",
};

export default function ProcessesAdminPage() {
  const [processes, setProcesses] = useState<Process[]>([]);

  const [form, setForm] = useState(emptyProcess);

  const [steps, setSteps] = useState<StepForm[]>([]);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProcesses();
  }, []);

  async function loadProcesses() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/processes",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error
        );
      }

      setProcesses(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể tải quy trình"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof typeof emptyProcess,
    value: string | number | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addStep() {
    setSteps((current) => [
      ...current,
      {
        ...emptyStep,
      },
    ]);
  }

  function updateStep(
    index: number,
    field: keyof StepForm,
    value: string
  ) {
    setSteps((current) =>
      current.map((step, stepIndex) =>
        stepIndex === index
          ? {
              ...step,
              [field]: value,
            }
          : step
      )
    );
  }

  function removeStep(index: number) {
    setSteps((current) =>
      current.filter(
        (_, stepIndex) => stepIndex !== index
      )
    );
  }

  function moveStep(
    index: number,
    direction: "up" | "down"
  ) {
    setSteps((current) => {
      const newSteps = [...current];

      const targetIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= newSteps.length
      ) {
        return current;
      }

      const temp = newSteps[index];

      newSteps[index] =
        newSteps[targetIndex];

      newSteps[targetIndex] = temp;

      return newSteps;
    });
  }

  function editProcess(process: Process) {
    setEditingId(process.Id);

    setForm({
      Title: process.Title,
      Description:
        process.Description || "",
      DisplayOrder: process.DisplayOrder,
      IsActive: process.IsActive,
    });

    setSteps(
      process.Steps.map((step) => ({
        Title: step.Title,
        Description:
          step.Description || "",
      }))
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);

    setForm({
      ...emptyProcess,
    });

    setSteps([]);

    setMessage("");
  }

  async function saveProcess() {
    try {
      setSaving(true);

      setMessage("");

      const url = editingId
        ? `/api/processes/${editingId}`
        : "/api/processes";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          Steps: steps,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error
        );
      }

      setMessage(
        editingId
          ? "✓ Đã cập nhật quy trình"
          : "✓ Đã thêm quy trình"
      );

      cancelEdit();

      await loadProcesses();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu quy trình"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProcess(id: number) {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa quy trình này?\n\nCác bước bên trong quy trình cũng sẽ bị xóa."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/processes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error
        );
      }

      setMessage("✓ Đã xóa quy trình");

      await loadProcesses();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể xóa quy trình"
      );
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-slate-500">
          Đang tải...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Quản lý quy trình
            </h1>

            <p className="text-sm text-slate-500">
              Thêm, sửa, xóa quy trình và các bước
              trên website
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin"
              className="rounded-lg border bg-white px-5 py-2"
            >
              Admin
            </a>

            <a
              href="/"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Xem website
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* FORM QUY TRÌNH */}

        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {editingId
                  ? "Chỉnh sửa quy trình"
                  : "Thêm quy trình"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Nội dung được lưu trực tiếp vào SQL
                Server.
              </p>
            </div>

            {editingId && (
              <button
                onClick={cancelEdit}
                className="rounded-lg border px-4 py-2 hover:bg-slate-50"
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">
                Tên quy trình
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
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Thứ tự hiển thị
              </label>

              <input
                type="number"
                value={form.DisplayOrder}
                onChange={(e) =>
                  updateForm(
                    "DisplayOrder",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-semibold">
              Mô tả quy trình
            </label>

            <textarea
              value={form.Description}
              onChange={(e) =>
                updateForm(
                  "Description",
                  e.target.value
                )
              }
              rows={4}
              placeholder="Mô tả quy trình..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.IsActive}
              onChange={(e) =>
                updateForm(
                  "IsActive",
                  e.target.checked
                )
              }
              className="h-5 w-5"
            />

            <label className="font-semibold">
              Hiển thị quy trình trên website
            </label>
          </div>

          {/* CÁC BƯỚC */}

          <div className="mt-10 border-t pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Các bước trong quy trình
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Các bước sẽ được hiển thị theo
                  thứ tự bên dưới.
                </p>
              </div>

              <button
                type="button"
                onClick={addStep}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                + Thêm bước
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-slate-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                        {index + 1}
                      </div>

                      <span className="font-semibold">
                        Bước {index + 1}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          moveStep(
                            index,
                            "up"
                          )
                        }
                        disabled={index === 0}
                        className="rounded-lg border bg-white px-3 py-1.5 text-sm disabled:opacity-30"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveStep(
                            index,
                            "down"
                          )
                        }
                        disabled={
                          index ===
                          steps.length - 1
                        }
                        className="rounded-lg border bg-white px-3 py-1.5 text-sm disabled:opacity-30"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeStep(index)
                        }
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold">
                      Tên bước
                    </label>

                    <input
                      value={step.Title}
                      onChange={(e) =>
                        updateStep(
                          index,
                          "Title",
                          e.target.value
                        )
                      }
                      placeholder="Ví dụ: Tạo đơn mua"
                      className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold">
                      Mô tả bước
                    </label>

                    <textarea
                      value={step.Description}
                      onChange={(e) =>
                        updateStep(
                          index,
                          "Description",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Mô tả bước..."
                      className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}

              {steps.length === 0 && (
                <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                  Chưa có bước nào.
                  <br />
                  Nhấn "Thêm bước" để thêm.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={saveProcess}
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Đang lưu..."
                : editingId
                ? "Cập nhật quy trình"
                : "Thêm quy trình"}
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

        {/* DANH SÁCH QUY TRÌNH */}

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-xl font-bold">
              Danh sách quy trình
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {processes.length} quy trình
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {processes.map((process) => (
              <div
                key={process.Id}
                className="rounded-xl border p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                      {String(
                        process.DisplayOrder
                      ).padStart(2, "0")}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold">
                          {process.Title}
                        </h3>

                        <span
                          className={
                            process.IsActive
                              ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                              : "rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500"
                          }
                        >
                          {process.IsActive
                            ? "Đang hiển thị"
                            : "Đang ẩn"}
                        </span>
                      </div>

                      {process.Description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {process.Description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() =>
                        editProcess(process)
                      }
                      className="rounded-lg border px-4 py-2 font-semibold hover:bg-slate-50"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() =>
                        deleteProcess(
                          process.Id
                        )
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {/* STEPS HIỂN THỊ */}

                <div className="mt-6 border-t pt-5">
                  <h4 className="text-sm font-bold">
                    Các bước
                  </h4>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {process.Steps.map(
                      (step, index) => (
                        <div
                          key={
                            step.Id ??
                            `${process.Id}-${index}`
                          }
                          className="flex items-start gap-3 rounded-lg bg-slate-50 p-4"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {index + 1}
                          </div>

                          <div>
                            <div className="font-semibold">
                              {step.Title}
                            </div>

                            {step.Description && (
                              <div className="mt-1 text-sm text-slate-500">
                                {
                                  step.Description
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}

                    {process.Steps.length ===
                      0 && (
                      <div className="text-sm text-slate-400">
                        Chưa có bước nào.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {processes.length === 0 && (
              <div className="rounded-xl border border-dashed p-10 text-center text-slate-500">
                Chưa có quy trình nào.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}