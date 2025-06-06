"use client";

export default function RagInsights({ spanId }: { spanId: string }) {
    const mockDocs = [
        { content: "Apple Inc. stock is currently trading at $180...", score: 0.92 },
        { content: "Market analysis shows AAPL up 2% today...", score: 0.85 },
        { content: "Recent earnings report exceeded expectations...", score: 0.78 },
    ];

    return (
        <div className="glass-morphism p-6">
            <h2 className="text-xl font-bold text-white mb-4">RAG Insights</h2>
            <div className="space-y-3">
                {mockDocs.map((doc, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs">Document {i + 1}</span>
                            <span className="text-green-400 text-sm font-medium">{(doc.score * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-white text-sm">{doc.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
