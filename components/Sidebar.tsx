import React from 'react';
import { LayoutDashboard, List, Settings, Power, Activity } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-20 h-screen bg-slate-950 flex flex-col items-center py-8 border-r border-slate-800 z-10 relative">
      <div className="mb-12 text-primary-500">
        <Activity size={32} />
      </div>

      <div className="flex-1 flex flex-col gap-8 w-full">
        <NavItem icon={<LayoutDashboard size={24} />} active />
        <NavItem icon={<List size={24} />} />
        <NavItem icon={<Settings size={24} />} />
      </div>

      <div className="mt-auto pb-4">
        <button className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
          <Power size={24} />
        </button>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; active?: boolean }> = ({ icon, active }) => (
  <button
    className={`w-full flex justify-center py-3 relative transition-all duration-300 ${
      active ? 'text-primary-500' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
    )}
    {icon}
  </button>
);
