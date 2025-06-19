interface TraceCardProps {
    id: string;
    name: string;
    status: string;
    latency: number;
}

export default function TraceCard({ id, name, status, latency }: TraceCardProps) {
    return (
        <a href={`/traces/${id}`} className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
            <div className="flex justify-between items-center">
                <span className="text-white font-medium">{name}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                    status === "SUCCESS" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>{status}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{latency}ms</p>
        </a>
    );
}
