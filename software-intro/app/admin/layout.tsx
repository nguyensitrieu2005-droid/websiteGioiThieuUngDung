"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
    },
    {
      href: "/admin/introduction",
      label: "Giới thiệu",
    },
    {
      href: "/admin/features",
      label: "Chức năng",
    },
    {
      href: "/admin/processes",
      label: "Quy trình",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-slate-950 text-white">
          <div className="flex h-full flex-col">

            {/* LOGO */}

            <div className="border-b border-white/10 px-6 py-6">
              <Link
                href="/admin"
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                  A
                </div>

                <div>
                  <div className="font-bold">
                    Admin Panel
                  </div>

                  <div className="text-xs text-slate-400">
                    Quản trị website
                  </div>
                </div>
              </Link>
            </div>

            {/* MENU */}

            <nav className="flex-1 space-y-2 p-4">

              {menuItems.map((item) => {

                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

            </nav>

            {/* BOTTOM */}

            <div className="border-t border-white/10 p-4">

              <Link
                href="/"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                ← Xem website
              </Link>

            </div>

          </div>
        </aside>

        {/* CONTENT */}

        <div className="ml-64 min-h-screen flex-1">

          {children}

        </div>

      </div>
    </div>
  );
}