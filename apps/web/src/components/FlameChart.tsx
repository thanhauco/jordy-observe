"use client";

import React from 'react';

interface Span {
    id: string;
    name: string;
    span_type: string;
    start_time: string;
    end_time?: string;
    latency_ms?: number;
    parent_span_id?: string;
    children?: Span[];
}

interface FlameChartProps {
    trace: {
        start_time: string;
        end_time?: string;
        latency_ms?: number;
        spans: Span[];
    };
}

const typeColorMap: Record<string, string> = {
    llm: 'bg-primary border-primary/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    retrieval: 'bg-blue-500 border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    tool: 'bg-amber-500 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    chain: 'bg-slate-600 border-slate-500/40 shadow-[0_0_15px_rgba(71,85,105,0.3)]',
    agent: 'bg-emerald-500 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    custom: 'bg-indigo-500 border-indigo-400/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
};

const FlameChart: React.FC<FlameChartProps> = ({ trace }) => {
    const totalDuration = trace.latency_ms || 1;
    const traceStartTime = new Date(trace.start_time).getTime();

    const renderSpan = (span: Span, depth: number = 0) => {
        const spanStart = new Date(span.start_time).getTime();
        const relativeStart = ((spanStart - traceStartTime) / totalDuration) * 100;
        const width = Math.max(((span.latency_ms || 0) / totalDuration) * 100, 0.5);

        return (
            <React.Fragment key={span.id}>
                <div
                    className="relative h-10 mb-2 group transition-all duration-500"
                    style={{ paddingLeft: `${relativeStart}%`, width: `${width}%` }}
                >
                    <div
                        className={`h-full rounded-2xl border flex items-center px-4 text-[10px] font-black italic uppercase tracking-widest text-white truncate cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 active:scale-100 transition-all duration-300 ${typeColorMap[span.span_type] || typeColorMap.custom}`}
                    >
                        <span className="truncate">{span.name}</span>
                        <span className="ml-auto opacity-60 text-[8px] pl-2">{span.latency_ms?.toFixed(0)}MS</span>
                    </div>
                </div>
                {span.children?.map(child => renderSpan(child, depth + 1))}
            </React.Fragment>
        );
    };

    const buildTree = (spans: Span[]) => {
        const map = new Map<string, Span & { children: Span[] }>();
        const roots: Span[] = [];

        spans.forEach(s => map.set(s.id, { ...s, children: [] }));

        spans.forEach(s => {
            const node = map.get(s.id)!;
            if (s.parent_span_id && map.has(s.parent_span_id)) {
                map.get(s.parent_span_id)!.children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    const roots = buildTree(trace.spans);

    return (
        <div className="glass-3d p-10 rounded-[48px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Neural Waterfall</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Async execution flow visualization</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Wall Time</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{totalDuration.toFixed(1)}ms</p>
                </div>
            </div>

            <div className="relative min-h-[400px] overflow-visible preserve-3d">
                {/* Timing markers */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    {[0, 25, 50, 75, 100].map(p => (
                        <div
                            key={p}
                            className="absolute h-full border-l border-slate-800/50"
                            style={{ left: `${p}%` }}
                        >
                            <span className="absolute -bottom-8 left-0 text-[9px] font-black text-slate-600 uppercase tracking-tighter">
                                {((p / 100) * totalDuration).toFixed(0)}ms
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pt-4 relative z-10 pb-12">
                    {roots.map(root => renderSpan(root))}
                </div>
            </div>
        </div>
    );
};

export default FlameChart;
