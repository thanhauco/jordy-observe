interface DatasetItem {
    id: string;
    input: Record<string, any>;
    expectedOutput: Record<string, any>;
}

export default function DatasetTable({ items }: { items: DatasetItem[] }) {
    return (
        <table className="w-full">
            <thead>
                <tr className="text-left text-gray-400 text-sm">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Input</th>
                    <th className="pb-2">Expected Output</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.id} className="border-t border-white/10">
                        <td className="py-2 text-white text-sm">{item.id.slice(0, 8)}</td>
                        <td className="py-2 text-gray-400 text-sm">{JSON.stringify(item.input).slice(0, 50)}</td>
                        <td className="py-2 text-gray-400 text-sm">{JSON.stringify(item.expectedOutput).slice(0, 50)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
