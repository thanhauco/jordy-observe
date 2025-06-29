"use client";

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'emerald' | 'blue' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, delta, icon: Icon, color }) => {
  const isPositive = delta.startsWith('+');

  const colorMap = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    secondary: 'text-secondary bg-secondary/10 border-secondary/20',
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  };

  return (
    <div className="glass-3d p-8 rounded-[40px] preserve-3d group cursor-pointer overflow-hidden relative">
      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out pointer-events-none" />

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`p-5 rounded-[24px] border transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] ${colorMap[color]}`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border font-black text-[10px] tracking-widest uppercase italic shadow-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1 pl-1">Global {label}</p>
        <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none truncate">
          {value}
        </h4>
      </div>

      {/* Abstract Flow Line */}
      <div className="absolute bottom-6 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className={`w-16 h-1 rounded-full bg-${color === 'primary' ? 'primary' : color + '-400'}`} />
      </div>
    </div>
  );
};

export default MetricCard; ''')