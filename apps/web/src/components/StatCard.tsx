interface StatCardProps {
    label: string;
    value: string | number;
    color?: string;
}

export default function StatCard({ label, value, color = "white" }: StatCardProps) {
    return (
        <div className="glass-morphism p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className={`text-3xl font-bold text-${color}`}>{value}</p>
        </div>
    );
}
