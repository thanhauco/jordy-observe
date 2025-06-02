"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="bg-surface rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Trace Name</th>
              <th className="px-6 py-4 text-right">Latency</th>
              <th className="px-6 py-4 text-right">Cost</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-[13px]">
            {traces.map((trace) => (
              <tr 
                key={trace.id} 
                className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                onClick={() => router.push(`/traces/${trace.id}`)}
              >
                <td className="px-6 py-4 w-10 text-center">
                  <div className={`w-2 h-2 rounded-full mx-auto animate-pulse ${
                    trace.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                    trace.status === 'failed' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500'
                  }`} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium group-hover:text-primary transition-colors">{trace.name || 'Anonymous Trace'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{trace.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-300">
                  {trace.latency_ms.toFixed(0)}<span className="text-[10px] text-slate-500 ml-0.5">ms</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 font-mono text-xs">
                    ${trace.total_cost_usd.toFixed(4)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-500 text-xs">
                  {new Date(trace.start_time).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TraceList;