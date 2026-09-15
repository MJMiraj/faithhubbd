import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  const user = await db.user.findUnique({
    where: { email: session?.user?.email || "" }
  });

  return (
    <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Account Settings</h2>
      
      <div className="space-y-8 max-w-lg">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-brand rounded focus:ring-brand" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email me about order updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-brand rounded focus:ring-brand" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email me about promotions and offers</span>
            </label>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Danger Zone</h3>
          <button className="text-red-600 font-bold text-sm bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
