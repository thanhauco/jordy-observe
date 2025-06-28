"use client";

import React from 'react';
import { CreditCard, TrendingDown, Zap, PieChart } from 'lucide-react';

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
        <div className="bg-surface/40 rounded-3xl border border-slate-800 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2 italic">
                        <CreditCard className="text-primary" size={24} /> Financial Observability
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Real-time LLM token utilization & cost efficiency.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Total Project Spend</p>
                    <p className="text-3xl font-black text-white italic">${totalSpend.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-6">
                {data.map((item) => (
                    <div key={item.model} className="group">
                        <div className="flex justify-between items-center mb-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">{item.model}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-bold">
                                <span className="text-slate-500">{item.requests.toLocaleString()} REQS</span>
                                <span className="text-white">${item.cost.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-2.5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800/50">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 flex flex-col items-center text-center">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl mb-3 border border-emerald-500/20">
                        <TrendingDown size={20} className="text-emerald-400" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Model Optimization</p>
                    <p className="text-xs font-medium text-slate-300">Semantic caching saved <span className="text-emerald-400 font-bold">$124.50</span> this month.</p>
                </div>
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 flex flex-col items-center text-center">
                    <div className="p-2.5 bg-primary/10 rounded-xl mb-3 border border-primary/20">
                        <Zap size={20} className="text-primary" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Resource Efficiency</p>
                    <p className="text-xs font-medium text-slate-300">P95 Cost per 1K Tokens: <span className="text-primary font-bold">$0.045</span></p>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdown; ''')
