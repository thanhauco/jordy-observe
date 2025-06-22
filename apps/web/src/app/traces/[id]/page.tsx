"use client";

import React, { useState } from 'react';
import FlameChart from '@/components/FlameChart';
import EvaluationCard from '@/components/EvaluationCard';
import { ArrowLeft, Clock, Zap, DollarSign, Database, Tag, ChevronDown, ChevronRight } from 'lucide-react';

export default function TraceDetail({ params }: { params: { id: string } }) {
    const [selectedSpan, setSelectedSpan] = useState<any>(null);

    // Mock data for a "deep" implementation
    const mockTrace = {
        id: params.id,
        name: "RAG Agent - Legal Assistant",
        status: "completed",
        start_time: "2024-03-25T10:00:00Z",
        end_time: "2024-03-25T10:00:02.450Z",
        latency_ms: 2450,
        total_tokens: 1850,
        total_cost_usd: 0.0037,
        input: { query: "Summary of contract obligations for Section 4.5" },
        output: { text: "Section 4.5 specifies that the vendor must provide monthly audit reports..." },
        spans: [
            {
                id: "s1", name: "Agent Loop", span_type: "agent",
                start_time: "2024-03-25T10:00:00Z", end_time: "2024-03-25T10:00:02.450Z",
                latency_ms: 2450, input: { q: "..." }, output: { res: "..." }
            },
            {
                id: "s2", name: "Embedding Search", span_type: "retrieval", parent_span_id: "s1",
                start_time: "2024-03-25T10:00:00.100Z", end_time: "2024-03-25T10:00:00.600Z",
                latency_ms: 500, attributes: { k: 5, index: "legal_docs" }
            },
            {
                id: "s3", name: "Cross-Encoder Rerank", span_type: "retrieval", parent_span_id: "s1",
                start_time: "2024-03-25T10:00:00.650Z", end_time: "2024-03-25T10:00:01.050Z",
                latency_ms: 400
            },
            {
                id: "s4", name: "GPT-4 Reasoning", span_type: "llm", parent_span_id: "s1",
                start_time: "2024-03-25T10:00:01.200Z", end_time: "2024-03-25T10:00:02.450Z",
                latency_ms: 1250, model: "gpt-4-turbo", prompt_tokens: 1200, completion_tokens: 250
            }
        ]
    };

    const mockEvals = [
        {
            id: "e1", evaluator_type: "hallucination", score: 0.98,
            explanation: "No factual claims outside the provided context were found.",
            created_at: "..."
        },
        {
            id: "e2", evaluator_type: "relevance", score: 0.85,
            explanation: "The response directly addresses the contract clause requested.",
            created_at: "..."
        }
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <nav className="flex items-center gap-4 text-slate-400 mb-6">
                <a href="/" className="hover:text-white transition flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Dashboard
                </a>
                <span className="text-slate-700">/</span>
                <span className="text-white text-sm font-medium">Trace {params.id.slice(0, 8)}</span>
            </nav>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">{mockTrace.name}</h1>
                    <div className="flex items-center gap-5 mt-4">
                        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                            <Clock size={14} className="text-primary" />
                            <span className="text-sm font-semibold">{mockTrace.latency_ms}ms</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                            <Zap size={14} className="text-yellow-400" />
                            <span className="text-sm font-semibold">{mockTrace.total_tokens} tokens</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                            <DollarSign size={14} className="text-emerald-400" />
                            <span className="text-sm font-semibold">${mockTrace.total_cost_usd}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition font-medium">
                        Debug in Playground
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 transition">
                        Export to Dataset
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">

                {/* Trace Waterfall & Info */}
                <div className="xl:col-span-2 space-y-8">
                    <FlameChart trace={mockTrace as any} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-surface p-6 rounded-2xl border border-slate-800 shadow-xl">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                                <Database size={18} className="text-primary" />
                                <h3 className="font-bold">Input Payload</h3>
                            </div>
                            <pre className="text-[11px] font-mono text-slate-300 bg-black/40 p-4 rounded-xl max-h-64 overflow-y-auto protocol-scrollbar">
                                {JSON.stringify(mockTrace.input, null, 2)}
                            </pre>
                        </div>

                        <div className="bg-surface p-6 rounded-2xl border border-slate-800 shadow-xl">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                                <Target size={18} className="text-secondary" />
                                <h3 className="font-bold">Output Response</h3>
                            </div>
                            <pre className="text-[11px] font-mono text-slate-300 bg-black/40 p-4 rounded-xl max-h-64 overflow-y-auto protocol-scrollbar">
                                {JSON.stringify(mockTrace.output, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Evaluations & Metadata */}
                <div className="space-y-8">
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            <CheckCircle size={14} /> Evaluation Results
                        </h3>
                        <div className="space-y-4">
                            {mockEvals.map(ev => (
                                <EvaluationCard key={ev.id} evaluation={ev as any} />
                            ))}
                        </div>
                    </section>

                    <section className="bg-surface/30 p-6 rounded-2xl border border-dashed border-slate-800">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">System Metadata</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Environment', value: 'production' },
                                { label: 'Caller', value: 'legal-assistant-v2' },
                                { label: 'Region', value: 'aws-us-east-1' },
                                { label: 'SDK Version', value: 'jordy-python-0.1.2' }
                            ].map(item => (
                                <div key={item.label} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">{item.label}</span>
                                    <span className="text-slate-200 font-mono bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-700/50">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
