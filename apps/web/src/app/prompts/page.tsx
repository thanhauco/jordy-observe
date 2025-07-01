"use client";

import React, { useState } from 'react';
import {
    Code,
    ChevronRight,
    Save,
    Play,
    History,
    GitBranch,
    Terminal,
    Cpu,
    Zap,
    Layers,
    Sparkles,
    ShieldCheck,
    Brain
} from 'lucide-react';

export default function PromptsPage() {
    const [selectedPrompt, setSelectedPrompt] = useState('legal_extractor_v4');
    const [code, setCode] = useState(`{{ context }}\n\nExtract all legal obligations from the above document following Section {{ section }}.\n\nFormat: JSON\nAttributes: [clause, obligation_type, risk_level]`);

    const prompts = [
        { id: 'legal_extractor_v4', name: 'Legal Extractor', version: 'v4', status: 'production', latency: '420ms' },
        { id: 'risk_analyzer_prod', name: 'Risk Analyzer', version: 'v12', status: 'staging', latency: '850ms' },
        { id: 'summary_engine_v1', name: 'Summary Engine', version: 'v1', status: 'production', latency: '120ms' },
        { id: 'sentiment_neural', name: 'Sentiment Hook', version: 'v7', status: 'archived', latency: '45ms' },
    ];

    return (
        <div className="space-y-12 pb-24 relative overflow-visible">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/20 backdrop-blur-md">
                            <Brain size={20} className="text-amber-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Logic IDE</span>
                            <span className="text-[10px] text-primary font-black uppercase italic tracking-widest">Logic & Template Studio</span>
                        </div>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Neural <span className="text-primary text-glow italic">Logic</span>
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 font-black transition-all hover:text-white uppercase text-[10px] tracking-[0.2em] italic">
                        <History size={18} /> Revisions
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-primary text-white font-black transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase text-[10px] tracking-[0.2em] italic">
                        <Save size={18} /> Deploy Version
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 perspective-1000">
                {/* Left: Prompt Catalog */}
                <div className="lg:col-span-3 flex flex-col gap-6 preserve-3d">
                    <div className="glass-3d p-6 rounded-[40px] overflow-hidden">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-2">Prompt Library</h4>
                        <div className="space-y-3">
                            {prompts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPrompt(p.id)}
                                    className={`p-5 rounded-[24px] cursor-pointer transition-all duration-300 border ${selectedPrompt === p.id
                                        ? "bg-primary/20 border-primary/30 shadow-xl shadow-primary/10"
                                        : "bg-slate-900/40 border-white/5 hover:border-white/10"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${p.status === 'production' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{p.status}</span>
                                        <span className="text-[9px] font-black text-slate-500 italic">{p.version}</span>
                                    </div>
                                    <h5 className={`text-xs font-black italic uppercase tracking-tighter transition-colors ${selectedPrompt === p.id ? 'text-white' : 'text-slate-400'}`}>{p.name}</h5>
                                </div>
                            ))}
                            <button className="w-full py-4 border border-dashed border-slate-800 rounded-[24px] text-slate-500 text-[9px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all">
                                + Initial Logic
                            </button>
                        </div>
                    </div>

                    <div className="glass-3d p-8 rounded-[40px] bg-primary/5 group">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Optimizer</h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6 italic">
                            AI suggested a 14% latency reduction by removing redundant chain-of-thought tokens.
                        </p>
                        <button className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.2em]">Apply Fix <Zap size={12} /></button>
                    </div>
                </div>

                {/* Center: The Studio */}
                <div className="lg:col-span-6 flex flex-col gap-8 preserve-3d">
                    <div className="glass-3d p-4 rounded-[40px] overflow-hidden relative min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5">
                                    <Terminal size={18} className="text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">{selectedPrompt}</h3>
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Live Template Editor</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/80 rounded-2xl border border-white/5">
                                <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-white transition uppercase tracking-widest"><Play size={14} /> Run Test</button>
                                <div className="w-[1px] h-4 bg-slate-800" />
                                <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-white transition uppercase tracking-widest"><GitBranch size={16} /> Fork</button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 bg-black/40 relative">
                            <textarea
                                className="w-full h-full bg-transparent border-none text-slate-300 font-mono text-sm leading-relaxed focus:outline-none resize-none protocol-scrollbar"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <div className="absolute bottom-10 right-10">
                                <div className="flex items-center gap-4 px-6 py-4 bg-primary/10 rounded-[32px] border border-primary/20 backdrop-blur-md shadow-2xl">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">Est. Latency</span>
                                        <span className="text-xs font-black text-white italic tracking-tighter">~420ms</span>
                                    </div>
                                    <div className="w-[1px] h-6 bg-primary/20" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">Confidence</span>
                                        <span className="text-xs font-black text-white italic tracking-tighter">High</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="glass-3d p-8 rounded-[40px] flex items-center gap-6 group">
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                <Sparkles size={24} className="text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Few-Shot Mining</span>
                                <span className="text-xs font-black text-white italic uppercase tracking-tighter">Add 12 Golden Samples</span>
                            </div>
                        </div>
                        <div className="glass-3d p-8 rounded-[40px] flex items-center gap-6 group">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} className="text-emerald-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Unit Testing</span>
                                <span className="text-xs font-black text-white italic uppercase tracking-tighter">8/8 Gates Passed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Variables & Context */}
                <div className="lg:col-span-3 flex flex-col gap-8 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] overflow-hidden flex flex-col min-h-[400px]">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                            <Layers size={22} className="text-primary" /> Context
                        </h4>
                        <div className="space-y-6">
                            <div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Variable: {"{{ context }}"}</span>
                                <div className="mt-2 p-4 bg-slate-900/60 rounded-2xl border border-white/5 text-[10px] text-slate-400 italic">
                                    Legal document text from OCR layer...
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Variable: {"{{ section }}"}</span>
                                <div className="mt-2 p-4 bg-slate-900/60 rounded-2xl border border-white/5 text-[10px] text-slate-400 italic">
                                    Section identifier (e.g. 4.5)
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto space-y-4 pt-12">
                            <button className="w-full py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic text-white hover:bg-slate-700 transition">Manage Schemas</button>
                        </div>
                    </div>

                    <div className="glass-3d p-10 rounded-[48px] bg-gradient-to-br from-indigo-500/20 to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -mr-16 -mt-16" />
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Auto-Heal <br /><span className="text-indigo-400">Beta</span></h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-8">
                            Autonomous model switching and temperature tuning based on real-time P95 feedback.
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] translate-x-6" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
