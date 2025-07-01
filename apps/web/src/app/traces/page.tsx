"use client";

import React, { useState } from 'react';
import TraceList from '@/components/TraceList';
import {
    Search,
    Filter,
    ArrowRight,
    Sparkles,
    Calendar,
    ChevronDown,
    Database,
    ArrowUpRight
} from 'lucide-react';

export default function TraceExplorer() {
    const [searchQuery, setSearchQuery] = useState("");

    const mockTraces = [
        { id: 't_c982', name: 'Legal Clause Extraction', status: 'completed', latency_ms: 2450, total_cost_usd: 0.0042, start_time: new Date().toISOString() },
        { id: 't_a112', name: 'Financial Risk Agent', status: 'completed', latency_ms: 1820, total_cost_usd: 0.0031, start_time: new Date().toISOString() },
        { id: 't_b445', name: 'PII Detection Loop', status: 'failed', latency_ms: 450, total_cost_usd: 0.0008, start_time: new Date().toISOString() },
        { id: 't_d001', name: 'Customer Support Bot', status: 'completed', latency_ms: 1240, total_cost_usd: 0.0024, start_time: new Date().toISOString() },
        { id: 't_e556', name: 'Code Generation V4', status: 'completed', latency_ms: 3200, total_cost_usd: 0.0056, start_time: new Date().toISOString() },
        { id: 't_f778', name: 'Document Summarizer', status: 'completed', latency_ms: 980, total_cost_usd: 0.0015, start_time: new Date().toISOString() },
    ];

    return (
        <div className="space-y-12 pb-24 relative overflow-visible">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/20 backdrop-blur-md">
                            <Database size={20} className="text-indigo-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Historical Analysis</span>
                            <span className="text-[10px] text-primary font-black uppercase italic tracking-widest">Global Trace Index</span>
                        </div>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Trace <span className="text-primary text-glow italic">Explorer</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all">
                        <Calendar size={16} /> Last 7 Days <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] italic shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Sparkles size={16} /> Semantic Search
                    </button>
                </div>
            </header>

            {/* Semantic Search & Filters Glass Container */}
            <div className="glass-3d p-4 rounded-[40px] perspective-1000 relative z-20">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="text-slate-500 group-hover:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by intent, ID, or agent name..."
                            className="w-full bg-slate-900/50 border border-white/5 rounded-[28px] py-6 pl-16 pr-8 text-white font-bold italic placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-slate-800/80 hover:bg-slate-700 px-8 py-4 rounded-[28px] flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest transition-all border border-white/5">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Main List Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 perspective-1000">
                {/* Results Info Bar */}
                <div className="lg:col-span-12 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Matches: <span className="text-white italic">1,402</span></span>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Storage: <span className="text-emerald-400 italic">2.4 TB</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Sort By:</span>
                        <button className="text-[11px] font-black text-primary uppercase tracking-[0.2em] italic flex items-center gap-1">Latest First <ChevronDown size={14} /></button>
                    </div>
                </div>

                {/* Trace List with 3D Background */}
                <div className="lg:col-span-12 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/5 blur-[100px] pointer-events-none" />
                        <TraceList traces={mockTraces} />

                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-white/5">
                                {[1, 2, 3, 4, 5].map(p => (
                                    <button key={p} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${p === 1 ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>{p}</button>
                                ))}
                                <span className="px-2 text-slate-700 font-bold">...</span>
                                <button className="w-10 h-10 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-black text-xs transition-all flex items-center justify-center">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experimental Features CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-8">
                <div className="glass-3d p-10 rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent group">
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Intent clustering</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                        Our neural engine found 12 recurring agent failure themes in your last 1,000 traces. Group by intent to debug faster.
                    </p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                        Analyze Clusters <ArrowUpRight size={14} />
                    </button>
                </div>

                <div className="glass-3d p-10 rounded-[48px] bg-gradient-to-br from-emerald-600/10 to-transparent flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
                        <ArrowUpRight className="text-emerald-400 group-hover:rotate-45 transition-transform" size={32} />
                    </div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Export Data Stream</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Connect to ClickHouse or BigQuery</p>
                </div>
            </div>
        </div>
    );
}
