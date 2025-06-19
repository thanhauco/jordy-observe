interface SpanDetailProps {
    span: {
        id: string;
        name: string;
        type: string;
        input?: Record<string, any>;
        output?: Record<string, any>;
        latency: number;
    };
}

export default function SpanDetail({ span }: SpanDetailProps) {
    return (
        <div className="glass-morphism p-6">
            <h3 className="text-lg font-bold text-white mb-4">{span.name}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-400 text-xs">Type</p>
                    <p className="text-white">{span.type}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Latency</p>
                    <p className="text-white">{span.latency}ms</p>
                </div>
            </div>
            {span.input && (
                <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-1">Input</p>
                    <pre className="bg-black/50 p-3 rounded text-green-400 text-xs overflow-auto">
                        {JSON.stringify(span.input, null, 2)}
                    </pre>
                </div>
            )}
            {span.output && (
                <div>
                    <p className="text-gray-400 text-xs mb-1">Output</p>
                    <pre className="bg-black/50 p-3 rounded text-blue-400 text-xs overflow-auto">
                        {JSON.stringify(span.output, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
