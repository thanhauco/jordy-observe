import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'emerald' | 'blue' | 'yellow';
}

const colorMap = {
  primary: 'text-primary bg-primary/10 border-primary/20',
  secondary: 'text-secondary bg-secondary/10 border-secondary/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, delta, icon: Icon, color }) => {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-slate-800 shadow-xl group hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {delta && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${delta.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {delta}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;