"use client";

import React from 'react';
import { ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface GroundingScoreProps {
    score: number; // 0 to 1
    citationsFound: number;
    totalClaims: number;
}

const GroundingScore: React.FC<GroundingScoreProps> = ({ score, citationsFound, totalClaims }) => {
    const isHealthy = score > 0.8;
    const isCritical = score < 0.4;

    const percentage = Math.round(score * 100);

    return (
        <div className="bg-surface/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Self-Correction / Grounding</h4>
                {isHealthy ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={12} /> VERIFIED
                    </div>
                ) : (
                    <div className={`flex items-center gap-1.5 font-bold text-[10px] px-2 py-0.5 rounded-full ${isCritical ? 'text-red-400 bg-red-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                        <ShieldAlert size={12} /> {isCritical ? 'CRITICAL DRIFT' : 'LOW CONFIDENCE'}
                    </div>
                )}
            </div>

            <div className="flex items-end gap-3 mb-4">
                <span className={`text-4xl font-black tracking-tight ${isHealthy ? 'text-emerald-400' : isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
                    {percentage}%
                </span>
                <span className="text-slate-500 text-xs font-medium mb-1.5">faithfulness score</span>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                    className={`h-full transition-all duration-1000 ease-out ${isHealthy ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : isCritical ? 'bg-red-400' : 'bg-yellow-400'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-500 mb-1">Citations</p>
                    <p className="text-white">{citationsFound} / {totalClaims}</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-500 mb-1">Drift Level</p>
                    <p className="text-white">{percentage > 90 ? 'None' : percentage > 70 ? 'Minimal' : 'Significant'}</p>
                </div>
            </div>

            <div className="mt-6 flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] text-blue-300 leading-relaxed">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p>Grounding checks compare the LLM response against the retrieved vector context to ensure no out-of-bounds claims were made.</p>
            </div>
        </div>
    );
};

export default GroundingScore; ''')
