import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, TrendingUp, Users, ArrowRight, Search, Menu } from 'lucide-react';
import { fetchStats } from '../../api/client';

export function PremiumAdminView() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats().then(setStats).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-10 text-slate-400">Loading Command Center...</div>;

    return (
        <div className="min-h-screen bg-[#0F1117] text-slate-100 font-sans">
            {/* Top Navigation */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0F1117]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="font-bold text-white">V</span>
                    </div>
                    <span className="font-semibold tracking-tight text-lg">Value OS <span className="text-xs text-slate-500 font-mono ml-2">ADMIN</span></span>
                </div>
                <div className="flex-1 max-w-md mx-8 relative">
                    <Search className="absolute left-3 top-2.5 text-slate-600" size={16} />
                    <input
                        type="text"
                        placeholder="Search transactions, policies, or entities..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs font-mono text-emerald-400">SYSTEM OPERATIONAL</span>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-semibold mb-1">System Overview</h1>
                    <p className="text-slate-400 text-sm">Real-time monitoring of value flow and policy enforcement.</p>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <KpiCard
                        title="Total Value Issued"
                        value={`$${stats?.totalIssued.toLocaleString()}`}
                        change="+12.5%"
                        icon={<TrendingUp size={20} className="text-indigo-400" />}
                    />
                    <KpiCard
                        title="Total Redemptions"
                        value={`$${stats?.totalRedeemed.toLocaleString()}`}
                        change="Lifetime"
                        icon={<Activity size={20} className="text-emerald-400" />}
                    />
                    <KpiCard
                        title="Active Policies"
                        value={stats?.policyBlockCount + 4} // Demo mock offset
                        change="4 Blocking"
                        icon={<ShieldAlert size={20} className="text-amber-400" />}
                        alert={stats?.policyBlockCount > 0}
                    />
                    <KpiCard
                        title="Total Volume"
                        value={stats?.txCount_24h}
                        change="Transactions"
                        icon={<Users size={20} className="text-blue-400" />}
                    />
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Activity Feed */}
                    <div className="lg:col-span-2 bg-[#161922] border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-slate-200">Live Ledger Feed</h3>
                            <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                View Full Ledger <ArrowRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition group border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">
                                                {i % 2 === 0 ? 'Mint Operation' : 'Redemption Event'}
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono">TX_8A29...3F91</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-mono text-slate-200">
                                            {i % 2 === 0 ? '+1,000.00' : '-250.00'} SKY
                                        </div>
                                        <div className="text-xs text-slate-500">Just now</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions / System Health */}
                    <div className="space-y-6">
                        <div className="bg-[#161922] border border-white/5 rounded-2xl p-6">
                            <h3 className="font-semibold text-slate-200 mb-4">Infrastructure Health</h3>
                            <div className="space-y-4">
                                <HealthBar label="Ledger Latency" value={98} color="bg-emerald-500" text="12ms" />
                                <HealthBar label="Policy Engine" value={100} color="bg-indigo-500" text="Active" />
                                <HealthBar label="API Throughput" value={45} color="bg-blue-500" text="450 req/s" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-2">Platform Update</h3>
                            <p className="text-sm text-indigo-200 mb-4">
                                Value OS v2.1 includes enhanced Settlement Gates for cross-border brands.
                            </p>
                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition">
                                View Changelog
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function KpiCard({ title, value, change, icon, alert }: any) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`bg-[#161922] border ${alert ? 'border-red-500/30 bg-red-900/10' : 'border-white/5'} p-5 rounded-2xl`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-white/5`}>{icon}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${alert ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {change}
                </span>
            </div>
            <div className="text-slate-500 text-xs mb-1">{title}</div>
            <div className="text-2xl font-bold text-slate-100">{value}</div>
        </motion.div>
    );
}

function HealthBar({ label, value, color, text }: any) {
    return (
        <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{label}</span>
                <span className="text-slate-200">{text}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}
