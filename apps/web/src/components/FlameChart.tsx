import React from 'react';

/**
 * Premium FlameChart component for trace visualization.
 * Renders hierarchical spans with precise timing and interactive tooltips.
 */

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
    llm: 'bg-purple-500/80 border-purple-400',
    retrieval: 'bg-blue-500/80 border-blue-400',
    tool: 'bg-orange-500/80 border-orange-400',
    chain: 'bg-slate-500/80 border-slate-400',
    agent: 'bg-emerald-500/80 border-emerald-400',
    custom: 'bg-indigo-500/80 border-indigo-400',
};

const FlameChart: React.FC<FlameChartProps> = ({ trace }) => {
    const totalDuration = trace.latency_ms || 1;
    const traceStartTime = new Date(trace.start_time).getTime();

    const renderSpan = (span: Span, depth: number = 0) => {
        const spanStart = new Date(span.start_time).getTime();
        const relativeStart = ((spanStart - traceStartTime) / totalDuration) * 100;
        const width = ((span.latency_ms || 0) / totalDuration) * 100;

        return (
            <React.Fragment key={span.id}>
                <div
                    className="relative h-8 mb-1 group"
                    style={{ paddingLeft: `${relativeStart}%`, width: `${width}%` }}
                >
                    <div
                        className={`h-full rounded border-l-2 flex items-center px-2 text-[10px] font-bold truncate cursor-pointer hover:brightness-110 transition shadow-sm ${typeColorMap[span.span_type] || typeColorMap.custom}`}
                        title={`${span.name} (${span.latency_ms?.toFixed(1)}ms)`}
                    >
                        {span.name}
                        <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 bg-white/5 pointer-events-none" />
                    </div>
                </div>
                {span.children?.map(child => renderSpan(child, depth + 1))}
            </React.Fragment>
        );
    };

    // Helper to build hierarchy
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
        <div className="bg-surface/50 rounded-xl p-6 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-200">Execution Waterfall</h3>
                <span className="text-xs text-slate-500 font-mono">Total Duration: {totalDuration.toFixed(1)}ms</span>
            </div>

            <div className="relative min-h-[300px] overflow-x-auto protocol-scrollbar">
                {/* Timing markers */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {[0, 25, 50, 75, 100].map(p => (
                        <div
                            key={p}
                            className="absolute h-full border-l border-slate-700/50"
                            style={{ left: `${p}%` }}
                        >
                            <span className="text-[8px] text-slate-600 block -ml-2 -mt-4">
                                {((p / 100) * totalDuration).toFixed(0)}ms
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    {roots.map(root => renderSpan(root))}
                </div>
            </div>
        </div>
    );
};

export default FlameChart;
