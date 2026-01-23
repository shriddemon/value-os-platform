import React, { useEffect, useState } from 'react';
import { fetchStats } from '../../api/client';

export const DashboardView: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats()
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8">Loading System Data...</div>;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Value Issued" value={`$${stats?.totalIssued || 0}`} change="Lifetime" />
                <StatCard title="Total Value Redeemed" value={`$${stats?.totalRedeemed || 0}`} change="Lifetime" />
                <StatCard title="Policy Blocks" value={stats?.policyBlockCount || 0} change="Auto-Rejected" alert={stats?.policyBlockCount > 0} />
                <StatCard title="Total Transactions" value={stats?.txCount_24h || 0} change="Audit Log" />
            </div>

            {/* Charts / Ledger Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4">Transaction Volume</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                        [Chart Placeholder: Daily Volume]
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4">Token Distribution</h3>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                        [Pie Chart]
                    </div>
                </div>
            </div>
        </div>
    );
};



export const StatCard: React.FC<{ title: string; value: string; change: string; alert?: boolean }> = ({ title, value, change, alert }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="text-sm text-gray-500 mb-1">{title}</div>
        <div className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-gray-900'}`}>{value}</div>
        <div className={`text-xs mt-2 ${change.includes('+') ? 'text-green-600' : 'text-red-500'}`}>
            {change} from yesterday
        </div>
    </div>
);
