import { useState, useEffect } from 'react';
import { StatCard } from './DashboardView';

// Internal mock for client-side API call since we haven't updated client.ts yet
async function fetchMyIssuerStats(issuerId: string) {
    const res = await fetch(`http://localhost:3000/api/v1/vcredits/issuers/${issuerId}/stats`);
    if (!res.ok) throw new Error('Failed to fetch issuer stats');
    return res.json();
}

export function IssuerDashboard({ issuerId }: { issuerId: string }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!issuerId) return;
        fetchMyIssuerStats(issuerId)
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [issuerId]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Issuer Data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Issuer Command Center</h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition">
                        + Mint Value
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition">
                        Configure Policy
                    </button>
                    {/* REDEEM BUTTON EXPLICITLY OMITTED */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Outstanding Liability"
                    value={`$${stats?.outstandingLiability || 0}`}
                    change="Net Exposure"
                    alert={stats?.outstandingLiability > 100000}
                />
                <StatCard
                    title="Total Value Issued"
                    value={`$${stats?.totalIssued || 0}`}
                    change="Lifetime"
                />
                <StatCard
                    title="Redemption Velocity"
                    value={stats?.velocity24h || 0}
                    change="Last 24h"
                />
                <StatCard
                    title="Expiring Soon"
                    value={stats?.expiringWithin30Days || 0}
                    change="Next 30 Days"
                    alert={false}
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">Policy Impact Simulator</h3>
                <p className="text-sm text-blue-800 mb-4">
                    Changes to policy affect <strong>future transactions only</strong>.
                    Existing liabilities cannot be retroactively cancelled via policy changes.
                </p>
                <div className="h-2 bg-blue-200 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3"></div>
                </div>
                <div className="flex justify-between text-xs text-blue-600 mt-2">
                    <span>Conservative</span>
                    <span>Aggressive Growth</span>
                </div>
            </div>
        </div>
    );
}
