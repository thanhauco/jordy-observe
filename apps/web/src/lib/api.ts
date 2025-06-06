const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "demo-api-key";

export async function fetchTraces() {
    const response = await fetch(`${API_BASE}/traces`, {
        headers: { "X-API-KEY": API_KEY },
    });
    return response.json();
}

export async function fetchDatasets() {
    const response = await fetch(`${API_BASE}/datasets`, {
        headers: { "X-API-KEY": API_KEY },
    });
    return response.json();
}

export async function createDataset(name: string) {
    const response = await fetch(`${API_BASE}/datasets`, {
        method: "POST",
        headers: { "X-API-KEY": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    return response.json();
}
