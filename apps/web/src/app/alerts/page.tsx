"use client";

import React, { useState } from 'react';
import {
    Bell,
    Settings,
    Trash2,
    Plus,
    Activity,
    AlertTriangle,
    ShieldAlert,
    Zap,
    ArrowUpRight,
    Target,
    Clock,
    Waves
} from 'lucide-react';

export default function AlertsPage() {
    const [activeAlerts, setActiveAlerts] = useState([
        { id: 'al_01', name: 'Latency Spike (P99)', metric: 'latency_ms', threshold: '> 2500ms', severity: 'critical', status: 'firing', time: '12m ago' },
        { id: 'al_02', name: 'Hallucination Drift', metric: 'grounding_score', threshold: '< 0.85', severity: 'warning', status: 'firing', time: '45m ago' },
        { id: 'al_03', name: 'Budget Limit - Tier 1', metric: 'total_cost_usd', threshold: '> $500', severity: 'info', status: 'resolved', time: '2h ago' },
    ]);

    return (
        <div className="space-y-12 pb-24 relative overflow-visible">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/20 backdrop-blur-md">
                            <Bell size={20} className="text-red-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Real-time Sentinel</span>
                            <span className="text-[10px] text-primary font-black uppercase italic tracking-widest">Metrics & Global Alerts</span>
                        </div>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Neural <span className="text-red-500 text-glow italic">Sentry</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 font-black transition-all hover:text-white uppercase text-[10px] tracking-[0.2em] italic">
                        <Settings size={18} /> Alert Hooks
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-white text-black font-black transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase text-[10px] tracking-[0.2em] italic">
                        <Plus size={18} /> New Watcher
                    </button>
                </div>
            </header>

            {/* Real-time Health Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
                <div className="glass-3d p-10 rounded-[48px] overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Global Latency</h4>
                        <span className="text-xs font-black text-emerald-400 italic">Within Bounds</span>
                    </div>
                    <div className="h-32 flex items-end gap-1 px-2">
                        {[40, 45, 38, 52, 60, 45, 42, 39, 41, 55, 62, 58, 45, 42, 40, 38, 45, 50, 48, 45].map((h, i) => (
                            <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-all duration-300" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <span className="text-lg font-black text-white italic">842ms <span className="text-[10px] font-bold text-slate-500">P99</span></span>
                        <Clock className="text-slate-700" size={18} />
                    </div>
                </div>

                <div className="glass-3d p-10 rounded-[48px] overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 text-red-400">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Hallucination Risk</h4>
                        <span className="text-xs font-black italic">Anomalies Detected</span>
                    </div>
                    <div className="h-32 flex items-end gap-1 px-2">
                        {[20, 22, 25, 28, 30, 45, 68, 85, 92, 78, 45, 30, 25, 22, 20, 18, 22, 25, 28, 30].map((h, i) => (
                            <div key={i} className={`flex-1 rounded-t-sm transition-all duration-300 ${h > 60 ? 'bg-red-500 group-hover:bg-red-400 shadow-[0_-5px_15px_rgba(239,68,68,0.4)]' : 'bg-slate-800'}`} style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <span className="text-lg font-black text-white italic">12.4% <span className="text-[10px] font-bold text-slate-500">Drift</span></span>
                        <Waves className="text-red-500 animate-pulse" size={18} />
                    </div>
                </div>

                <div className="glass-3d p-10 rounded-[48px] overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 text-amber-500">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Compute Burn</h4>
                        <span className="text-xs font-black italic">Trending +14%</span>
                    </div>
                    <div className="h-32 flex items-end gap-1 px-2">
                        {[10, 12, 15, 18, 22, 25, 28, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90].map((h, i) => (
                            <div key={i} className="flex-1 bg-amber-500/20 rounded-t-sm group-hover:bg-amber-500/40 transition-all duration-300" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                        <span className="text-lg font-black text-white italic">$42.82 <span className="text-[10px] font-bold text-slate-500">Hour</span></span>
                        <Zap className="text-amber-500" size={18} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 perspective-1000">
                {/* Active Alerts Firehouse */}
                <div className="lg:col-span-8 flex flex-col gap-8 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <ShieldAlert size={24} className="text-red-500" /> Active Watchers
                            </h3>
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-2xl">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Live Ingesting</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {activeAlerts.map((alert) => (
                                <div key={alert.id} className="group relative flex items-center justify-between p-8 bg-slate-900/40 rounded-[32px] border border-white/5 hover:border-red-500/30 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer shadow-xl active:scale-[0.99] overflow-hidden">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${alert.severity === 'critical' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                                                alert.severity === 'warning' ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' :
                                                    'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                            }`}>
                                            <AlertTriangle size={28} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h5 className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-red-400 transition-colors uppercase">{alert.name}</h5>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{alert.metric} • {alert.threshold}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
                                            <span className={`text-xs font-black italic tracking-widest uppercase ${alert.status === 'firing' ? 'text-red-400 animate-pulse' : 'text-slate-600'}`}>{alert.status}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                                <Settings size={18} />
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-12 w-full py-5 border-2 border-dashed border-slate-800/50 rounded-[32px] text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:border-red-500/50 hover:text-red-400 transition-all flex items-center justify-center gap-3 group">
                            Expand Alert Archive <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="lg:col-span-4 flex flex-col gap-10 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden group">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                            <Target size={22} className="text-primary" /> Guardrails
                        </h4>
                        <div className="space-y-6">
                            {[
                                { name: 'Redaction Lock', status: 'Active', color: 'emerald' },
                                { name: 'Grounding Gate', status: 'Enforcing', color: 'emerald' },
                                { name: 'Cost Hard Cap', status: 'Disabled', color: 'slate' },
                                { name: 'PII Filter V3', status: 'Learning', color: 'blue' },
                            ].map((gate, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/40 rounded-2xl border border-white/5 group-hover:bg-slate-900/60 transition-colors">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{gate.name}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest italic text-${gate.color}-400`}>{gate.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-3d p-10 rounded-[48px] bg-gradient-to-br from-red-600/10 to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl -mr-16 -mt-16" />
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none text-red-400">Threat <br /><span className="text-white">Detection</span></h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-8 italic">
                            "Detected 4 possible prompt-injection attempts in the last 60 minutes from IP block 192.168.x.x."
                        </p>
                        <button className="w-full py-5 bg-red-500 text-white font-black rounded-[24px] uppercase text-[11px] tracking-[0.3em] italic shadow-2xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Review Threats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
