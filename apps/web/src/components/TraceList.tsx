"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Clock, DollarSign } from 'lucide-react';

interface Trace {
  id: string;
  name: string;
  status: string;
  latency_ms: number;
  total_cost_usd: number;
  start_time: string;
}

const TraceList: React.FC<{ traces: Trace[] }> = ({ traces }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {traces.map((trace) => (
        <div
          key={trace.id}
          onClick={() => router.push(`/traces/${trace.id}`)}
          className="group relative flex items-center justify-between p-6 bg-slate-900/40 rounded-[28px] border border-white/5 hover:border-primary/30 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-primary/5 active:scale-[0.99]"
        >
          <div className="flex items-center gap-6">
            <div className={`w-3 h-3 rounded-full ${trace.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' :
                trace.status === 'failed' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'bg-blue-500'
              }`} />

            <div className="flex flex-col">
              <h5 className="text-sm font-black text-white uppercase tracking-tighter italic group-hover:text-primary transition-colors">
                {trace.name || 'Anonymous Interaction'}
              </h5>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{trace.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1 text-slate-400">
                <Clock size={12} />
                <span className="text-[11px] font-black italic">{trace.latency_ms.toFixed(0)}MS</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">End-to-End</span>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1 text-emerald-400">
                <DollarSign size={12} />
                <span className="text-[11px] font-black italic">{trace.total_cost_usd.toFixed(4)}</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Token Cost</span>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all group-hover:scale-110">
              <ChevronRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TraceList; ''')