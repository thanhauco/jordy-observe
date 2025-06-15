export function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ");
}

export function formatLatency(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
}
