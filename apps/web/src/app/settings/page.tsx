"use client";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            
            <div className="glass-morphism p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Webhooks</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">GitHub Webhook URL</label>
                        <input type="text" 
                               className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                               placeholder="https://api.jordy.dev/webhooks/github" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Webhook Secret</label>
                        <input type="password" 
                               className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                               value="••••••••••••" readOnly />
                    </div>
                </div>
            </div>
            
            <div className="glass-morphism p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">API Keys</h2>
                <code className="block p-4 bg-black/50 rounded-lg text-green-400">
                    demo-api-key
                </code>
            </div>
        </div>
    );
}
