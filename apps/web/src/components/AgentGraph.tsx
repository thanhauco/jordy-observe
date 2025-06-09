"use client";

import React from 'react';
import { Network, ArrowRight, User, Cpu, AlertCircle } from 'lucide-react';

interface Node {
    id: string;
    label: string;
    type: string;
    status: 'completed' | 'failed' | 'running';
}

interface Edge {
    from: string;
    to: string;
    label: string;
}

interface AgentGraphProps {
    nodes: Node[];
    edges: Edge[];
}

const AgentGraph: React.FC<AgentGraphProps> = ({ nodes, edges }) => {
    return (
        <div className="bg-surface p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <Network className="text-indigo-400" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Agent Delegation Graph</h3>
                    <p className="text-xs text-slate-500 font-medium">Visualization of multi-agent task nesting.</p>
                </div>
            </div>

            <div className="space-y-6 relative">
                {/* Simplified Tree Visualization for Demo */}
                {nodes.map((node, index) => {
                    const parentEdge = edges.find(e => e.to === node.id);
                    const isChild = !!parentEdge;

                    return (
                        <div
                            key={node.id}
                            className={`flex items-center gap-4 ${isChild ? 'ml-12 relative' : ''}`}
                        >
                            {isChild && (
                                <div className="absolute -left-6 top-1/2 -translate-y-full w-6 h-12 border-l border-b border-slate-700 rounded-bl-xl" />
                            )}

                            <div className={`
                flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 min-w-[240px]
                ${node.status === 'failed' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500 text-slate-300'}
              `}>
                                <div className={`p-2 rounded-lg ${node.type === 'manager' ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-400'}`}>
                                    {node.type === 'manager' ? <User size={16} /> : <Cpu size={16} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">{node.type}</p>
                                    <p className="text-sm font-bold text-white">{node.label}</p>
                                </div>
                                {node.status === 'failed' && <AlertCircle size={16} className="animate-pulse" />}
                                {node.status === 'completed' && <ArrowRight size={14} className="text-slate-600" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentGraph; ''')
