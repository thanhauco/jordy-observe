"use client";

import React, { useState } from 'react';
import {
    ShieldCheck,
    FlaskConical,
    Play,
    RefreshCcw,
    ChevronRight,
    Activity,
    Zap,
    Target,
    BarChart3,
    ListRestart,
    Plus,
    ArrowUpRight,
    Microscope,
    Cpu
} from 'lucide-react';

export default function EvaluationsPage() {
    const [activeTab, setActiveTab] = useState('active');

    const mockRuns = [
        { id: 'run_01', name: 'Legal Grounding Test', dataset: 'Golden Set v4', status: 'completed', score: '94.2%', date: '2h ago' },
        { id: 'run_02', name: 'Summarization Drift Check', dataset: 'Edge Cases v8', status: 'running', score: '...', date: 'Just now' },
        { id: 'run_03', name: 'PII Redaction Scan', dataset: 'Production Logs', status: 'failed', score: '0.0%', date: '4h ago' },
    ];

    return (
        <div className="space-y-12 pb-24 relative overflow-visible">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/20 backdrop-blur-md">
                            <Microscope size={20} className="text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quality Assurance Pipeline</span>
                            <span className="text-[10px] text-primary font-black uppercase italic tracking-widest">Neural Evaluation Studio</span>
                        </div>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Neural <span className="text-primary text-glow italic">Factory</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 font-black transition-all hover:text-white uppercase text-[10px] tracking-[0.2em] italic">
                        <RefreshCcw size={18} /> Sync Evaluators
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-white text-black font-black transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase text-[10px] tracking-[0.2em] italic">
                        <Plus size={18} /> New Batch Run
                    </button>
                </div>
            </header>

            {/* Global Status Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 perspective-1000">
                {[
                    { label: 'Active Runs', value: '14', icon: Activity, color: 'primary' },
                    { label: 'Avg Quality', value: '92.4%', icon: ShieldCheck, color: 'emerald' },
                    { label: 'Neural Cost', value: '$420', icon: Zap, color: 'yellow' },
                    { label: 'Top Drift', value: '-1.4%', icon: Target, color: 'red' },
                ].map((stat, i) => (
                    <div key={i} className="glass-3d p-6 rounded-[32px] flex items-center gap-5 group">
                        <div className={`p-4 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/20 group-hover:rotate-12 transition-transform`}>
                            <stat.icon className={`text-${stat.color === 'primary' ? 'primary' : stat.color + '-400'}`} size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-xl font-black text-white italic uppercase tracking-tighter">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 perspective-1000">
                {/* Main Run Feed */}
                <div className="lg:col-span-8 flex flex-col gap-8 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] italic transition-colors ${activeTab === 'active' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Active Batch
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] italic transition-colors ${activeTab === 'history' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    History
                                </button>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Swarms Active</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {mockRuns.map((run) => (
                                <div key={run.id} className="group relative flex items-center justify-between p-8 bg-slate-900/40 rounded-[32px] border border-white/5 hover:border-primary/30 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer shadow-xl active:scale-[0.99] overflow-hidden">
                                    {/* Progress Sparkle */}
                                    {run.status === 'running' && (
                                        <div className="absolute top-0 right-0 w-32 h-full bg-primary/5 blur-2xl -mr-16 animate-pulse" />
                                    )}

                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:rotate-6 ${run.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                run.status === 'running' ? 'bg-primary/10 border-primary/20 text-primary' :
                                                    'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                            {run.status === 'running' ? <Cpu size={28} className="animate-spin duration-1000" /> : <FlaskConical size={28} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <h5 className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors">{run.name}</h5>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{run.dataset} • {run.date}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12 relative z-10">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 font-mono">Run Score</span>
                                            <span className={`text-xl font-black italic tracking-tighter ${run.score === '...' ? 'text-slate-700' : 'text-white'}`}>{run.score}</span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all group-hover:scale-110">
                                            <ChevronRight size={24} className="text-slate-600 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button className="text-[10px] font-black text-slate-600 hover:text-primary transition uppercase tracking-[0.3em] italic flex items-center gap-4 group">
                                View Complete History <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="lg:col-span-4 flex flex-col gap-10 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden flex flex-col items-center text-center group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
                        <div className="p-6 bg-slate-900 rounded-[32px] border border-white/5 mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                            <BarChart3 size={42} className="text-primary" />
                        </div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Global Quality <br /><span className="text-primary tracking-normal">Benchmarks</span></h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 px-4">
                            Your models are performing 14% better than the industry average for legal extraction tasks.
                        </p>
                        <button className="w-full py-5 bg-white text-black font-black rounded-[24px] uppercase text-[11px] tracking-[0.3em] italic shadow-2xl shadow-white/10 hover:opacity-90 transition-all">
                            Compare Ecosystem
                        </button>
                    </div>

                    <div className="glass-3d p-10 rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent relative overflow-hidden group">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4 flex items-center gap-3">
                            <ListRestart size={22} className="text-indigo-400" /> Auto-Scheduler
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-8">
                            Triggers a full batch evaluation automatically on every CI/CD deployment or prompt commit to staging.
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-6 bg-emerald-500/20 rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)] translate-x-6" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic tracking-tight">System Armed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
