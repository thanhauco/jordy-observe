"use client";

import React, { useState } from "react";
import {
    Database,
    Search,
    Plus,
    Tag,
    ChevronRight,
    Calendar,
    CloudUpload,
    Layers,
    Sparkles,
    ShieldCheck,
    BrainCircuit,
    ArrowUpRight
} from "lucide-react";

export default function DatasetsPage() {
    const [datasets, setDatasets] = useState([
        { id: "ds_01", name: "Golden Response Set", type: "RAG Evaluation", itemCount: 1420, drift: "-2.4%", date: "June 24, 2025" },
        { id: "ds_02", name: "Legal Edge Cases", type: "Security", itemCount: 85, drift: "+1.2%", date: "June 25, 2025" },
        { id: "ds_03", name: "CodeGen v4 Benchmarks", type: "Logic", itemCount: 2500, drift: "-0.5%", date: "June 26, 2025" },
        { id: "ds_04", name: "PII Redaction Testbed", type: "Privacy", itemCount: 120, drift: "0.0%", date: "June 27, 2025" },
    ]);
    const [selectedId, setSelectedId] = useState("ds_01");

    return (
        <div className="space-y-12 pb-24 relative overflow-visible">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/20 backdrop-blur-md">
                            <Database size={20} className="text-emerald-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Assets</span>
                            <span className="text-[10px] text-primary font-black uppercase italic tracking-widest">Ground Truth Repository</span>
                        </div>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Neural <span className="text-primary text-glow italic">Vault</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 font-black transition-all hover:text-white uppercase text-[10px] tracking-[0.2em] italic">
                        <CloudUpload size={18} /> Bulk Ingest
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-white text-black font-black transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase text-[10px] tracking-[0.2em] italic">
                        <Plus size={18} /> New Dataset
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 perspective-1000">
                {/* Left: Dataset Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-8 preserve-3d">
                    <div className="glass-3d p-8 rounded-[48px] overflow-hidden group">
                        <div className="flex items-center gap-3 mb-8 px-2">
                            <Search className="text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search Vault..."
                                className="bg-transparent border-none text-xs font-black text-white italic uppercase tracking-widest focus:outline-none placeholder:text-slate-700 w-full"
                            />
                        </div>

                        <div className="space-y-4">
                            {datasets.map((ds) => (
                                <div
                                    key={ds.id}
                                    onClick={() => setSelectedId(ds.id)}
                                    className={`p-6 rounded-[32px] cursor-pointer transition-all duration-300 border relative overflow-hidden group/card ${selectedId === ds.id
                                            ? "bg-primary/20 border-primary/30 shadow-2xl shadow-primary/10"
                                            : "bg-slate-900/40 border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{ds.type}</span>
                                            <h4 className={`text-sm font-black italic uppercase tracking-tighter transition-colors ${selectedId === ds.id ? 'text-white' : 'text-slate-400 group-hover/card:text-slate-200'}`}>{ds.name}</h4>
                                        </div>
                                        <span className={`text-[9px] font-black italic transition-colors ${ds.drift.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
                                            DRIFT: {ds.drift}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg border ${selectedId === ds.id ? 'bg-primary/20 border-primary/20' : 'bg-slate-800 border-white/5'}`}>
                                                <Layers size={14} className={selectedId === ds.id ? 'text-primary' : 'text-slate-500'} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{ds.itemCount.toLocaleString()} Samples</span>
                                        </div>
                                        <ChevronRight size={16} className={`transition-all duration-300 ${selectedId === ds.id ? 'text-primary translate-x-0' : 'text-slate-800 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-3d p-10 rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col justify-center items-center text-center group">
                        <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                            <Sparkles size={32} className="text-indigo-400" />
                        </div>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Automated Mining</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 px-4">
                            Let AI scan your production traces to automatically extract "Golden" response patterns.
                        </p>
                        <button className="px-8 py-3 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-700 transition shadow-xl shadow-black/20">Initialize Mining</button>
                    </div>
                </div>

                {/* Right: Dataset Content Hub */}
                <div className="lg:col-span-8 flex flex-col gap-10 preserve-3d">
                    <div className="glass-3d p-12 rounded-[56px] relative overflow-hidden flex flex-col min-h-[700px]">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] pointer-events-none" />

                        <div className="flex items-start justify-between mb-16 px-2">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest italic border border-white/5">Namespace: {selectedId}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] italic">Verified Ground Truth</span>
                                </div>
                                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                                    {datasets.find(d => d.id === selectedId)?.name}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium tracking-tight">Enterprise dataset for end-to-end regression testing and fine-tuning loops.</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Last Synchronized</span>
                                <span className="flex items-center gap-2 text-white font-black italic uppercase tracking-tighter text-sm">
                                    <Calendar size={14} className="text-primary" /> {datasets.find(d => d.id === selectedId)?.date}
                                </span>
                            </div>
                        </div>

                        {/* High-End Empty State / Table Placeholder */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-black/20 rounded-[40px] border border-white/5 relative group/empty overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />

                            <div className="relative z-10">
                                <div className="w-24 h-24 rounded-[32px] bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-2xl group-hover/empty:scale-110 transition-transform duration-700 mx-auto">
                                    <BrainCircuit size={48} className="text-primary animate-pulse" />
                                </div>
                                <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Dataset Visualizer</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-10">
                                    Enable **Neural Preview** to render input/output pairs for this dataset in high-frequency matrix view.
                                </p>
                                <button className="px-10 py-5 bg-gradient-to-br from-primary to-indigo-600 text-white font-black rounded-[24px] uppercase text-[11px] tracking-[0.3em] italic shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                                    Unlock Data View
                                </button>
                            </div>
                        </div>

                        {/* Analytics Footer */}
                        <div className="mt-12 grid grid-cols-3 gap-8">
                            <div className="flex flex-col gap-2 p-6 bg-slate-900/40 rounded-[28px] border border-white/5">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Quality Score</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-white italic uppercase tracking-tighter">94.2%</span>
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-6 bg-slate-900/40 rounded-[28px] border border-white/5">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Growth</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-white italic uppercase tracking-tighter">+12%</span>
                                    <ArrowUpRight size={14} className="text-primary" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-6 bg-slate-900/40 rounded-[28px] border border-white/5">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Entropy</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-white italic uppercase tracking-tighter">0.42</span>
                                    <Tag size={14} className="text-indigo-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
