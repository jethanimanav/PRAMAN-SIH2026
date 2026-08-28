"use client";

import { Panel } from "@/components/ui";
import { Settings } from "lucide-react";
import { usePraman } from "@/lib/PramanContext";

export default function SettingsPage() {
  const { user } = usePraman();
  
  return (
    <div className="space-y-6">
      <Panel title="Settings" icon={<Settings size={18} />}>
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Officer Profile</h3>
            <div className="mt-2 text-sm text-slate-600">
              <p>Name: {user?.name}</p>
              <p>Email: {user?.email}</p>
              <p>Role: {user?.role}</p>
              <p>Department: {user?.department || "N/A"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-800">System Information</h3>
            <div className="mt-2 text-sm text-slate-600">
              <p>Version: 1.0.0 (Hackathon Prototype)</p>
              <p>Environment: Demo</p>
              <p>Data Class: SIMULATED</p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
