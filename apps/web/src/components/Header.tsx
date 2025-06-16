export default function Header({ title }: { title: string }) {
    return (
        <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30">
                    New Trace
                </button>
            </div>
        </header>
    );
}
