import React from 'react';
import {
    CheckCircle,
    AlertTriangle,
    XOctagon,
    Info,
    Target,
    ShieldAlert,
    Search,
    FileText
} from 'lucide-react';

interface Evaluation {
    id: string;
    evaluator_type: string;
    score: number;
    label?: string;
    explanation?: string;
    created_at: string;
}

const evaluatorConfig: Record<string, { icon: any, color: string, bg: string }> = {
    hallucination: { icon: EyeOff, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    relevance: { icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-400/20' },
    toxicity: { icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-400/20' },
    qa_correctness: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    summarization: { icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-400/20' },
    custom: { icon: Search, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' }
};

// Component for displaying evaluation results with progress bars and sentiment icons
const EvaluationCard: React.FC<{ evaluation: Evaluation }> = ({ evaluation }) => {
    const config = evaluatorConfig[evaluation.evaluator_type] || evaluatorConfig.custom;
    const Icon = config.icon;

    return (
        <div className={`p-5 rounded-xl border relative overflow-hidden transition-all hover:translate-y-[-2px] ${config.bg}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-black/30 ${config.color}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm capitalize">{evaluation.evaluator_type.replace('_', ' ')}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {evaluation.id.slice(0, 8)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xl font-black ${evaluation.score > 0.8 ? 'text-emerald-400' : evaluation.score > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {(evaluation.score * 100).toFixed(0)}%
                    </span>
                    <p className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">Certainty Score</p>
                </div>
            </div>

            {evaluation.explanation && (
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{evaluation.explanation}"
                    </p>
                </div>
            )}

            {/* Visual Indicator */}
            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${evaluation.score > 0.8 ? 'bg-emerald-500' : evaluation.score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${evaluation.score * 100}%` }}
                />
            </div>
        </div>
    );
};

export default EvaluationCard;
