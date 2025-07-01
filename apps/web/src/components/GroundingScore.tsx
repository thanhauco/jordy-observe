"use client";

import React from 'react';
import { ShieldCheck, ShieldAlert, Info, Microscope } from 'lucide-react';

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
        <div className="glass-3d p-10 rounded-[48px] overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1 pl-1">Neural Verification</h4>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Trust & Grounding</h3>
                </div>
                {isHealthy ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 italic tracking-widest uppercase">
                        <ShieldCheck size={14} /> Certified
                    </div>
                ) : (
                    <div className={`flex items-center gap-2 font-black text-[10px] px-4 py-2 rounded-2xl border shadow-xl italic tracking-widest uppercase ${isCritical ? 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'}`}>
                        <ShieldAlert size={14} /> {isCritical ? 'High Risk' : 'Warnings'}
                    </div>
                )}
            </div>

            <div className="flex items-end gap-4 mb-8">
                <span className={`text-7xl font-black tracking-tighter italic leading-none ${isHealthy ? 'text-emerald-400 text-glow' : isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
                    {percentage}%
                </span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Confidence Level</span>
            </div>

            <div className="h-4 bg-slate-900/80 rounded-full overflow-hidden mb-10 border border-white/5 p-[2px]">
                <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)] ${isHealthy ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isCritical ? 'bg-red-500' : 'bg-yellow-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs font-bold mb-8">
                <div className="bg-slate-900/40 p-5 rounded-[28px] border border-white/5 flex flex-col justify-center gap-1 group-hover:scale-105 transition-transform duration-500">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Citations</p>
                    <p className="text-white text-lg font-black italic uppercase tracking-tighter">{citationsFound} <span className="text-slate-600">/ {totalClaims}</span></p>
                </div>
                <div className="bg-slate-900/40 p-5 rounded-[28px] border border-white/5 flex flex-col justify-center gap-1 group-hover:scale-105 transition-transform duration-500">
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Hallucination</p>
                    <p className="text-white text-lg font-black italic uppercase tracking-tighter">{percentage > 90 ? 'None' : percentage > 70 ? 'Low' : 'Drift detected'}</p>
                </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-primary/5 border border-primary/10 rounded-[28px] text-[11px] text-primary/80 leading-relaxed font-medium italic">
                <Microscope size={18} className="shrink-0 mt-0.5" />
                <p>Grounding checks compare the LLM response against the retrieved vector context to ensure no out-of-bounds claims were made in this specific session.</p>
            </div>
        </div>
    );
};

export default GroundingScore;
