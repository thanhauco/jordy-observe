"use client";

import React from 'react';
import MetricCard from '@/components/MetricCard';
import TraceList from '@/components/TraceList';
import {
  Activity,
  Clock,
  Target,
  DollarSign,
  Zap,
  Filter,
  RefreshCcw,
  Plus
} from 'lucide-react';

export default function Home() {
  const mockTraces = [
    { id: 't_f8a1', name: 'RAG Search', status: 'completed', latency_ms: 1240, total_cost_usd: 0.0024, start_time: new Date().toISOString() },
    { id: 't_f8a2', name: 'Agent Reasoning', status: 'failed', latency_ms: 2450, total_cost_usd: 0.0048, start_time: new Date().toISOString() },
    { id: 't_f8a3', name: 'Summarization', status: 'completed', latency_ms: 850, total_cost_usd: 0.0012, start_time: new Date().toISOString() },
    { id: 't_f8a4', name: 'Embeddings v1', status: 'completed', latency_ms: 320, total_cost_usd: 0.0005, start_time: new Date().toISOString() },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white">System <span className="text-primary italic">Overview</span></h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time performance analytics for your AI infrastructure.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition font-bold text-sm">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white transition font-bold text-sm">
            <RefreshCcw size={16} /> Sync
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition text-sm">
            <Plus size={18} /> New API Key
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Traces"
          value="12,842"
          delta="+14.2%"
          icon={Activity}
          color="primary"
        />
        <MetricCard
          label="Avg Latency"
          value="1.24s"
          delta="-2.4%"
          icon={Clock}
          color="blue"
        />
        <MetricCard
          label="Success Rate"
          value="98.2%"
          delta="+0.4%"
          icon={Target}
          color="emerald"
        />
        <MetricCard
          label="Total Cost"
          value="$452.12"
          delta="+8.1%"
          icon={DollarSign}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap size={18} className="text-primary" /> Live Trace Feed
            </h3>
            <span className="text-xs text-slate-500 font-mono">Viewing last 4 traces</span>
          </div>
          <TraceList traces={mockTraces as any} />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <section className="bg-surface/50 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <Activity size={14} className="text-secondary" /> Model Distribution
            </h4>
            <div className="space-y-4">
              {[
                { name: 'gpt-4-turbo', usage: '62%', color: 'bg-primary' },
                { name: 'claude-3-opus', usage: '28%', color: 'bg-blue-500' },
                { name: 'llama-3-70b', usage: '10%', color: 'bg-emerald-500' },
              ].map(model => (
                <div key={model.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{model.name}</span>
                    <span className="text-slate-500">{model.usage}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${model.color} rounded-full`} style={{ width: model.usage }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-3xl border border-primary/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />
            <h4 className="text-lg font-black text-white mb-2">Jordy Pro</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Unlock advanced auto-healing and custom evaluators for enterprise workflows.
            </p>
            <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-100 transition shadow-lg shadow-white/10">
              Upgrade Now
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}