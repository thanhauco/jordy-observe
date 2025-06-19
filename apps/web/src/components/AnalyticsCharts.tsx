"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function LatencyChart() {
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Avg Latency (ms)',
                data: [1200, 1100, 1350, 980, 1050, 1200, 1150],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="glass-morphism p-6">
            <h3 className="text-lg font-bold text-white mb-4">Latency Trend</h3>
            <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
    );
}

export function SuccessRateChart() {
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Success Rate (%)',
                data: [95, 93, 97, 94, 96, 92, 95],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="glass-morphism p-6">
            <h3 className="text-lg font-bold text-white mb-4">Success Rate</h3>
            <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
    );
}
