"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Database, 
  CheckCircle, 
  Code, 
  Settings, 
  HelpCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Trace Explorer', icon: Activity, href: '/traces' },
    { name: 'Datasets', icon: Database, href: '/datasets' },
    { name: 'Evaluations', icon: CheckCircle, href: '/evaluations' },
    { name: 'Prompts', icon: Code, href: '/prompts' },
    { name: 'Alerts', icon: Zap, href: '/alerts' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-surface/80 backdrop-blur-xl flex flex-col h-full">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">
            JORDY <span className="text-primary">OBS</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                ? 'bg-primary/10 text-primary border border-primary/20 font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} className={active ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-700" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Thanh Vu</span>
              <span className="text-[10px] text-slate-500">Free Plan</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-between text-slate-400 hover:text-white transition">
            <Settings size={14} />
            <HelpCircle size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;