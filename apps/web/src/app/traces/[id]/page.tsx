"use client";

import React, { useState } from 'react';
import FlameChart from '@/components/FlameChart';
import EvaluationCard from '@/components/EvaluationCard';
import {
    ArrowLeft,
    Clock,
    Zap,
    DollarSign,
    Database,
    ArrowUpRight,
    ShieldCheck,
    Cpu,
    Activity,
    Code,
    Layers,
    Terminal,
    BrainCircuit
} from 'lucide-react';
import Link from 'next/link';

export default function TraceDetail({ params }: { params: { id: string } }) {
    const [selectedSpan, setSelectedSpan] = useState<any>(null);

    const mockTrace = {
        id: params.id,
        name: "RAG Agent - Legal Assistant",
        status: "completed",
        start_time: "2024-03-25T10:00:00Z",
        end_time: "2024-03-25T10:00:02.450Z",
        latency_ms: 2450,
        total_tokens: 18524,
        total_cost_usd: 0.0372,
        input: {
            query: "Summary of contract obligations for Section 4.5",
            context_id: "ctx_982x_legal_corp"
        },
        output: {
            text: "Section 4.5 specifies that the vendor must provide monthly audit reports...",
            confidence: 0.984,
            source_docs: ["contract_v4_final.pdf", "compliance_policy_2024.md"]
        },
        spans: [
            {
                id: "s1", name: "Autonomous Agent Engine", span_type: "agent",
                start_time: "2024-03-25T10:00:00Z", end_time: "2024-03-25T10:00:02.450Z",
                latency_ms: 2450, input: { q: "..." }, output: { res: "..." }
            },
            {
                id: "s2", name: "Qdrant Semantic Search", span_type: "retrieval", parent_span_id: "s1",
                start_time: "2024-03-25T10:00:00.100Z", end_time: "2024-03-25T10:00:00.600Z",
                latency_ms: 500, attributes: { k: 12, collection: "legal_corpus_v8" }
            },
            {
                id: "s3", name: "Rerank & Pruning", span_type: "retrieval", parent_span_id: "s1",
                start_time: "2024-03-25T10:00:00.650Z", end_time: "2024-03-25T10:00:01.050Z",
                latency_ms: 400
            },
            {
                id: "s4", name: "GPT-4o Inference Loop", span_type: "llm", parent_span_id: "s1",
                start_time: "2024-03-25T10:00:01.200Z", end_time: "2024-03-25T10:00:02.450Z",
                latency_ms: 1250, model: "gpt-4o", prompt_tokens: 14200, completion_tokens: 4324
            }
        ]
    };

    const mockEvals = [
        {
            id: "e1", evaluator_type: "hallucination", score: 0.98,
            explanation: "No factual claims outside the provided context were found via cross-verification.",
            created_at: new Date().toISOString()
        },
        {
            id: "e2", evaluator_type: "relevance", score: 0.92,
            explanation: "The response precisely targets Section 4.5 as requested in the user prompt.",
            created_at: new Date().toISOString()
        }
    ];

    return (
        <div className="space-y-12 pb-24 relative overflow-visible">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <nav className="flex items-center gap-4 text-slate-500 mb-2">
                        <Link href="/traces" className="hover:text-primary transition flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic">
                            <ArrowLeft size={16} /> All Observations
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Span Inspector</span>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 backdrop-blur-md">
                            <Layers size={24} className="text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active Trace</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID: {params.id}</span>
                            </div>
                            <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-tight">
                                Trace <span className="text-primary text-glow italic">Insight</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 font-black transition-all hover:text-white uppercase text-[10px] tracking-[0.2em] italic">
                        <Code size={16} /> Debug Trace
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-white text-black font-black transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 uppercase text-[10px] tracking-[0.2em] italic">
                        <ArrowUpRight size={18} /> Export Dataset
                    </button>
                </div>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 perspective-1000">
                {[
                    { label: 'Latency', value: '2.45s', icon: Clock, color: 'primary' },
                    { label: 'Token Count', value: '18.5K', icon: BrainCircuit, color: 'blue' },
                    { label: 'Resource Cost', value: '$0.037', icon: DollarSign, color: 'emerald' },
                    { label: 'Status', value: 'Healthy', icon: ShieldCheck, color: 'emerald' },
                ].map((stat, i) => (
                    <div key={i} className="glass-3d p-6 rounded-[32px] flex items-center gap-5 group">
                        <div className={`p-4 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/20 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`text-${stat.color === 'primary' ? 'primary' : stat.color + '-400'}`} size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-xl font-black text-white italic uppercase tracking-tighter">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 perspective-1000">
                {/* Waterfall & IO Hub */}
                <div className="lg:col-span-8 flex flex-col gap-8 preserve-3d">
                    <FlameChart trace={mockTrace as any} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                    <Terminal size={20} className="text-primary" /> Input Payload
                                </h3>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">JSON/UTF-8</div>
                            </div>
                            <div className="bg-black/40 rounded-[32px] p-6 border border-white/5 relative overflow-hidden min-h-[300px]">
                                <pre className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                                    {JSON.stringify(mockTrace.input, null, 4)}
                                </pre>
                            </div>
                        </div>

                        <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                    <Activity size={20} className="text-secondary" /> Model Response
                                </h3>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Chunk</div>
                            </div>
                            <div className="bg-black/40 rounded-[32px] p-6 border border-white/5 relative overflow-hidden min-h-[300px]">
                                <pre className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                                    {JSON.stringify(mockTrace.output, null, 4)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="lg:col-span-4 flex flex-col gap-8 preserve-3d">
                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <ShieldCheck size={24} className="text-emerald-400" /> Evaluations
                            </h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Run Logic</button>
                        </div>

                        <div className="space-y-6">
                            {mockEvals.map((evalItem) => (
                                <div key={evalItem.id} className="p-6 bg-slate-900/40 rounded-[32px] border border-white/5 space-y-4 group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{evalItem.evaluator_type}</span>
                                        <span className="text-lg font-black text-emerald-400 italic">{(evalItem.score * 100).toFixed(0)}%</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic group-hover:text-slate-300 transition-colors">
                                        "{evalItem.explanation}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4 flex items-center gap-3">
                            <Cpu size={24} className="text-indigo-400" /> Node Trace
                        </h4>
                        <div className="space-y-4 pt-4">
                            {[
                                { label: 'Compute Engine', value: 'V100-Swarms' },
                                { label: 'SDK Context', value: 'v2.4.0-Production' },
                                { label: 'Memory Hook', value: 'Redis-Cluster-7' },
                                { label: 'Auto-Healing', value: 'ENABLED' },
                            ].map((meta, i) => (
                                <div key={i} className="flex justify-between items-center bg-black/20 px-5 py-4 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-colors">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{meta.label}</span>
                                    <span className="text-[11px] font-black text-white italic uppercase tracking-widest">{meta.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
