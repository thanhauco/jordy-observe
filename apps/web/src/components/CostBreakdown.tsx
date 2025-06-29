"use client";

import React from 'react';
import { CreditCard, Zap, BarChart3, PieChart } from 'lucide-react';

interface ModelCost {
    model: string;
    cost: number;
    requests: number;
    percentage: number;
}

interface CostBreakdownProps {
    data: ModelCost[];
    totalSpend: number;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ data, totalSpend }) => {
    return (
        <div className="glass-3d p-10 rounded-[48px] overflow-hidden group h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />

            <div className="flex items-center justify-between mb-12">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <CreditCard className="text-primary" size={28} /> Finance <span className="text-primary">Ops</span>
                    </h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 px-1">Neural Resource Utilization</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Burn</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">${totalSpend.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-8 mb-12">
                {data.map((item) => (
                    <div key={item.model} className="group/item">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                <span className="text-xs font-black text-slate-200 uppercase tracking-widest italic">{item.model}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black italic">
                                <span className="text-slate-500 uppercase">{item.requests.toLocaleString()} REQS</span>
                                <span className="text-white bg-slate-800/80 px-2 py-1 rounded-lg border border-white/5 shadow-sm">${item.cost.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-3 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <div
                                className="h-full bg-gradient-to-r from-primary via-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900/60 p-6 rounded-[32px] border border-white/5 flex flex-col items-center text-center group/card hover:border-emerald-500/30 transition-colors">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20 group-hover/card:scale-110 transition-transform">
                        <PieChart size={24} className="text-emerald-400" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Efficiency</p>
                    <p className="text-[11px] font-bold text-slate-300 italic">ROI: <span className="text-emerald-400">+124%</span></p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-[32px] border border-white/5 flex flex-col items-center text-center group/card hover:border-primary/30 transition-colors">
                    <div className="p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20 group-hover/card:scale-110 transition-transform">
                        <BarChart3 size={24} className="text-primary" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">P95 Cost</p>
                    <p className="text-[11px] font-bold text-slate-300 italic">$0.04 <span className="text-primary">/ 1K Tokens</span></p>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdown; ''')
