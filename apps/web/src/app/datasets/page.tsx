"use client";

import { useState } from "react";

export default function DatasetsPage() {
    const [datasets, setDatasets] = useState([
        { id: "1", name: "Golden Set", itemCount: 150 },
        { id: "2", name: "Edge Cases", itemCount: 45 },
    ]);
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Datasets</h1>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-morphism p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Your Datasets</h2>
                    <div className="space-y-2">
                        {datasets.map((ds) => (
                            <div key={ds.id} 
                                 onClick={() => setSelectedDatasetId(ds.id)}
                                 className={`p-4 rounded-lg cursor-pointer transition ${
                                     selectedDatasetId === ds.id ? "bg-primary/20 border border-primary" : "bg-white/5 hover:bg-white/10"
                                 }`}>
                                <p className="text-white font-medium">{ds.name}</p>
                                <p className="text-gray-400 text-sm">{ds.itemCount} items</p>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition">
                        + Create Dataset
                    </button>
                </div>
                
                <div className="glass-morphism p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Dataset Items</h2>
                    {selectedDatasetId ? (
                        <p className="text-gray-400">Select a dataset to view items</p>
                    ) : (
                        <p className="text-gray-400">No dataset selected</p>
                    )}
                </div>
            </div>
        </div>
    );
}
