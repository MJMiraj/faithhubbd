import { db } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";
import { RoleGate } from "@/components/admin/RoleGate";

export default async function AdminSettingsPage() {
  const settings = await db.storeSettings.findUnique({
    where: { id: "global_settings" }
  });

  return (
    <RoleGate 
      allowedRoles={["Super Admin", "Admin"]} 
      fallback={
        <div className="p-8 text-center text-red-500 font-bold bg-red-50 dark:bg-red-950/20 rounded-3xl">
          You do not have permission to access Store Settings.
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Store Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your global store configurations and API keys.</p>
        </div>

        <SettingsForm settings={settings} />
      </div>
    </RoleGate>
  );
}
