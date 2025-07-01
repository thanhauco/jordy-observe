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
  Zap,
  Cpu,
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Console', icon: LayoutDashboard, href: '/' },
    { name: 'Traces', icon: Activity, href: '/traces' },
    { name: 'Datasets', icon: Database, href: '/datasets' },
    { name: 'Evaluations', icon: CheckCircle, href: '/evaluations' },
    { name: 'Logic', icon: Code, href: '/prompts' },
    { name: 'Metrics', icon: Zap, href: '/alerts' },
  ];

  return (
    <aside className="w-80 border-r border-white/5 bg-[#020617]/40 backdrop-blur-3xl flex flex-col h-full relative z-50">
      <div className="p-10">
        <Link href="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
            <Cpu className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">
              JORDY<span className="text-primary tracking-normal">.</span>
            </h1>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pt-1">Observe</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 group ${active
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={20} className={active ? 'text-primary' : 'text-slate-600 group-hover:text-slate-300 transition-colors'} />
              <span className={`text-sm tracking-wide uppercase font-black italic ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto">
        <div className="bg-slate-900/40 rounded-[32px] p-6 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl -mr-10 -mt-10" />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
              <Fingerprint className="text-primary" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white italic uppercase tracking-tighter">Thanh Vu</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-0.5">Quantum Tier</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="p-2.5 rounded-xl bg-slate-800/50 text-slate-500 hover:text-white transition-colors">
              <Settings size={18} />
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800/80 text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-700 transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;