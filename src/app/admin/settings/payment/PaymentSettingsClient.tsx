"use client";

import { useState } from "react";
import { createPaymentAccount, deletePaymentAccount, togglePaymentAccount } from "./actions";
import { Plus, Trash2, CheckCircle, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileBankingAccount {
  id: string;
  provider: string;
  type: string;
  number: string;
  isActive: boolean;
}

export function PaymentSettingsClient({ accounts }: { accounts: MobileBankingAccount[] }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  
  const [provider, setProvider] = useState("bKash");
  const [type, setType] = useState("Personal");
  const [number, setNumber] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;
    setIsPending(true);
    await createPaymentAccount({ provider, type, number });
    setNumber("");
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      setIsPending(true);
      await deletePaymentAccount(id);
      setIsPending(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setIsPending(true);
    await togglePaymentAccount(id, !isActive);
    setIsPending(false);
  };

  return (
    <div className="space-y-8">
      {/* Add New Account Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand" /> Add Mobile Banking Account
        </h3>
        
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Provider</label>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand outline-none"
            >
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Account Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand outline-none"
            >
              <option value="Personal">Personal</option>
              <option value="Agent">Agent</option>
              <option value="Merchant">Merchant</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Phone Number</label>
            <input 
              type="text" 
              value={number} 
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. 017..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand outline-none"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isPending || !number}
            className="w-full bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 h-[42px]"
          >
            {isPending ? "Adding..." : "Add Account"}
          </button>
        </form>
      </div>

      {/* Account List */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-brand" /> Active Accounts
        </h3>
        
        {accounts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-semibold">No mobile banking accounts added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(acc => (
              <div key={acc.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-md">
                      {acc.provider}
                    </span>
                    <button 
                      onClick={() => handleToggle(acc.id, acc.isActive)}
                      className={`text-xs font-bold px-2 py-1 rounded-md transition-colors ${acc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      disabled={isPending}
                    >
                      {acc.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <h4 className="text-xl font-black text-gray-900">{acc.number}</h4>
                  <p className="text-sm text-gray-500 font-semibold">{acc.type}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => handleDelete(acc.id)}
                    disabled={isPending}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
