"use client";

import React from 'react';
import MetricCard from '@/components/MetricCard';
import TraceList from '@/components/TraceList';
import CostBreakdown from '@/components/CostBreakdown';
import GroundingScore from '@/components/GroundingScore';
import {
  Activity,
  Clock,
  Zap,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  Binary,
  Compass,
  Cpu,
  Layers
} from 'lucide-react';

export default function Home() {
  const mockTraces = [
    { id: 't_f8a1', name: 'RAG Search', status: 'completed', latency_ms: 1240, total_cost_usd: 0.0024, start_time: new Date().toISOString() },
    { id: 't_f8a2', name: 'Agent Reasoning', status: 'failed', latency_ms: 2450, total_cost_usd: 0.0048, start_time: new Date().toISOString() },
    { id: 't_f8a3', name: 'Summarization', status: 'completed', latency_ms: 850, total_cost_usd: 0.0012, start_time: new Date().toISOString() },
    { id: 't_f8a4', name: 'Embeddings v1', status: 'completed', latency_ms: 320, total_cost_usd: 0.0005, start_time: new Date().toISOString() },
  ];

  const mockCostData = [
    { model: 'gpt-4o', cost: 285.40, requests: 4500, percentage: 65 },
    { model: 'claude-3.5-sonnet', cost: 124.20, requests: 2100, percentage: 35 },
    { model: 'gpt-4o-mini', cost: 42.52, requests: 12842, percentage: 15 },
  ];

  return (
    <div className="space-y-12 pb-24 relative overflow-visible">
      {/* 3D Floating Decoration - Abstract Mesh Vibe */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none animate-float" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl border border-primary/20 backdrop-blur-md">
              <Cpu size={20} className="text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Monitoring</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-black"><ShieldCheck size={12} /> GLOBAL INSTANCE: UP</span>
            </div>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            Observe <span className="text-primary text-glow italic">Dashboard</span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-6 px-6 py-3 bg-slate-900/40 rounded-3xl border border-slate-800 backdrop-blur-md">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Nodes</span>
              <span className="text-sm font-black text-white italic">14 swarms</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global P95</span>
              <span className="text-sm font-black text-white italic">842ms</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-white text-black font-black transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase text-xs tracking-[0.2em] italic">
            <Plus size={18} /> Deploy Agent
          </button>
        </div>
      </header>

      {/* Metrics Grid with Perspective Transforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
        <MetricCard label="Neural Traces" value="1.24M" delta="+24%" icon={Layers} color="primary" />
        <MetricCard label="Sync Latency" value="142ms" delta="-8%" icon={Clock} color="blue" />
        <MetricCard label="Groundedness" value="96.4%" delta="+1.5%" icon={BrainCircuit} color="emerald" />
        <MetricCard label="Daily Burn" value="$142" delta="+4.2%" icon={Binary} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 perspective-1000">
        {/* Main Observation Hub (The Bento Grid Large Card) */}
        <div className="lg:col-span-8 flex flex-col gap-8 preserve-3d">
          <div className="glass-3d p-10 rounded-[48px] overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-black flex items-center gap-3 italic uppercase tracking-tighter text-white">
                  <Zap size={24} className="text-primary animate-pulse" /> Live Observations
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Real-time stream from ingestion gateway</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Connected</span>
              </div>
            </div>

            <TraceList traces={mockTraces as any} />

            <button className="mt-10 w-full py-5 border-2 border-dashed border-slate-800/50 rounded-[32px] text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-3 group">
              Explore Neural Graph <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GroundingScore score={0.96} citationsFound={18} totalClaims={19} />
            <div className="glass-3d p-10 rounded-[48px] flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-xl shadow-indigo-500/5">
                <Compass size={28} className="text-indigo-400" />
              </div>
              <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-3">Vector Discovery</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                Automatically cluster traces by semantic similarity. Identify common failure patterns autonomously.
              </p>
              <button className="mt-auto flex items-center gap-2 text-[10px] font-black text-white hover:text-primary transition uppercase tracking-[0.2em]">
                Run Clustering <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Intelligence (Bento Small Cards) */}
        <div className="lg:col-span-4 flex flex-col gap-8 preserve-3d">
          <CostBreakdown
            data={mockCostData}
            totalSpend={1424.12}
          />

          <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden group flex flex-col h-full min-h-[400px]">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/10 blur-[100px] pointer-events-none" />

            <div className="space-y-2 mb-8">
              <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/20 italic">Elite Access</span>
              <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none pt-2">Jordy <br /><span className="text-secondary">Enterprise</span></h4>
            </div>

            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
              Scale to billions of nodes with guaranteed sub-100ms global ingestion and SOC2/HIPAA compliance out of the box.
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center"><Plus size={12} className="text-emerald-400" /></div>
                Custom SSO Integration
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-300 pb-8">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center"><Plus size={12} className="text-emerald-400" /></div>
                Shared Performance Benchmarks
              </div>
              <button className="w-full py-5 bg-gradient-to-br from-primary to-indigo-600 text-white font-black rounded-[24px] hover:scale-[1.02] active:scale-[0.98] transition shadow-2xl shadow-primary/30 uppercase text-[11px] tracking-[0.2em] italic">
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
