"use client";

import React from 'react';
import { BookOpen, Link as LinkIcon, ExternalLink, Hash } from 'lucide-react';

interface Source {
    id: string;
    title: string;
    content: string;
    score: number;
    url?: string;
}

interface RagInsightsProps {
    sources: Source[];
    query: string;
}

const RagInsights: React.FC<RagInsightsProps> = ({ sources, query }) => {
    return (
        <div className="bg-surface/30 rounded-3xl border border-slate-800 p-8 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <BookOpen className="text-primary" size={24} /> RAG Attribution
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Grounded sources for this response.</p>
                </div>
                <div className="bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {sources.length} Context Chunks
                </div>
            </div>

            <div className="space-y-4">
                {sources.map((source, index) => (
                    <div
                        key={source.id}
                        className="group relative bg-slate-900/40 border border-slate-800 hover:border-primary/30 rounded-2xl p-5 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                    #{index + 1}
                                </div>
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                                    {source.title}
                                </h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                                    SCORE: {(source.score * 100).toFixed(1)}%
                                </span>
                                {source.url && (
                                    <a href={source.url} className="text-slate-500 hover:text-primary transition">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                            {source.content}
                        </p>

                        <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                <Hash size={12} /> View in Dataset
                            </button>
                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider transition">
                                <LinkIcon size={12} /> Copy Reference
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                    <BookOpen size={14} />
                    <span>Information retrieved based on query: "{query}"</span>
                </div>
            </div>
        </div>
    );
};

export default RagInsights;
