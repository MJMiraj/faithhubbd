import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Double check admin role
  const user = await db.user.findUnique({
    where: { email: session.user?.email || "" },
    include: { role: true }
  });

  const allowedRoles = ["Admin", "Super Admin", "Staff"];
  if (!user?.role?.name || !allowedRoles.includes(user.role.name)) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950 overflow-hidden selection:bg-brand/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Header / Topbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-100 dark:border-gray-900 bg-white/50 dark:bg-black/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{user?.firstName || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
