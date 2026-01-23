import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, PlusCircle, Link, Shield, TrendingUp, Users, ArrowRight, X } from 'lucide-react';

import { getApiUrl } from '../../config';

async function fetchIssuerStats(issuerId: string) {
    const res = await fetch(getApiUrl(`/api/v1/vcredits/issuers/${issuerId}/stats`));
    if (!res.ok) throw new Error('Failed to fetch issuer stats');
    return res.json();
}

export function PremiumIssuerView({ issuerId }: { issuerId: string }) {
    const [stats, setStats] = useState<any>(null);
    const [campaignModalOpen, setCampaignModalOpen] = useState(false);
    const [partnerModalOpen, setPartnerModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Local State for Demo Data
    const [campaigns, setCampaigns] = useState([
        { id: 1, name: 'Summer Flight Bonus', trigger: 'Book 3 Flights', reward: '1,000 pts', status: 'Active', engagement: '1,240 users' },
        { id: 2, name: 'Lounge Access Promo', trigger: 'Spending > $500', reward: '500 pts', status: 'Active', engagement: '850 users' }
    ]);

    const [partners, setPartners] = useState([
        { id: 'b1', name: 'Amazon Store', type: 'Ex-Commerce', integration: 'Pay with Points', impact: 'High', volume: '$45,200', mutualUsers: '12,400', logo: 'A' },
        { id: 'b2', name: 'Starbucks Rewards', type: 'F&B', integration: 'Auto-Conversion', impact: 'Medium', volume: '$12,800', mutualUsers: '8,200', logo: 'S' },
        { id: 'b3', name: 'Uber Integration', type: 'Mobility', integration: 'Trip Credits', impact: 'Medium', volume: '$9,100', mutualUsers: '5,600', logo: 'U' }
    ]);

    useEffect(() => {
        if (!issuerId) return;
        fetchIssuerStats(issuerId).then(setStats).finally(() => setLoading(false));
    }, [issuerId]);

    // Handlers
    async function launchCampaign() {
        if (!issuerId || submitting) return;
        setSubmitting(true);
        try {
            // Hardcoded Demo Mint: 1000 Points to User (Simulation)
            const userWalletId = (await (await fetch(getApiUrl('/api/v1/vcredits/demo/ids'))).json()).walletId;
            const creditDef = (await (await fetch(getApiUrl('/api/v1/vcredits/definitions'))).json()).find((d: any) => d.issuerId === issuerId)
                || (await (await fetch(getApiUrl('/api/v1/vcredits/definitions'))).json())[0];

            if (!creditDef) throw new Error("No Credit Definition Found");

            const name = (document.getElementById('camp_name') as HTMLInputElement)?.value || 'New Campaign';
            const trigger = (document.getElementById('camp_trigger') as HTMLInputElement)?.value || 'Manual Trigger';
            const rewardAmount = parseInt((document.getElementById('camp_reward') as HTMLInputElement)?.value || '1000');

            // 1. Simulate Backend Action
            await fetch(getApiUrl('/api/v1/vcredits/mint'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    issuerId,
                    walletId: userWalletId,
                    creditDefId: creditDef.id,
                    amount: rewardAmount,
                    reason: `Campaign Reward: ${name}`
                })
            });

            // 2. Update UI State
            setCampaigns([...campaigns, {
                id: Date.now(),
                name,
                trigger,
                reward: `${rewardAmount.toLocaleString()} pts`,
                status: 'Active',
                engagement: '0 users (Just Started)'
            }]);

            alert(`✅ Campaign "${name}" Launched!`);
            setCampaignModalOpen(false);
            fetchIssuerStats(issuerId).then(setStats);
        } catch (e) {
            alert("Campaign Creation Failed: " + e);
        } finally {
            setSubmitting(false);
        }
    }

    function addPartner() {
        const name = (document.getElementById('partner_name') as HTMLInputElement)?.value;
        if (!name) return;
        setPartners([...partners, {
            id: `p${Date.now()}`,
            name,
            type: 'Pending Integration',
            integration: 'API Connection',
            impact: 'Low',
            volume: '$0',
            mutualUsers: 'Calculating...',
            logo: name[0]
        }]);
        setPartnerModalOpen(false);
    }

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Asset Manager...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 max-w-7xl mx-auto gap-4">
                <div>
                    <div className="flex items-center gap-2 text-violet-600 font-bold mb-1">
                        <Layers size={20} /> Asset Control
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Issuer Dashboard</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setPartnerModalOpen(true)}
                        className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2"
                    >
                        <Link size={18} /> Add Partner
                    </button>
                    <button
                        onClick={() => setCampaignModalOpen(true)}
                        disabled={submitting}
                        className="bg-violet-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {submitting ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <PlusCircle size={18} />}
                        {submitting ? 'Creating...' : 'Create Campaign'}
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Main Stats & Campaigns */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-3xl border border-violet-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Liquidity Pools</h2>
                                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">$10,000.00</div>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-700">Solvency Check Passed</span>
                                </div>
                            </div>

                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                                <div className="bg-emerald-500 w-[100%] h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="flex justify-between text-xs text-slate-400 font-medium">
                                <span>Backed Liability: 100%</span>
                                <span>Treasury Ratio: 1:1</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Conversion Ratio</h2>
                            <div className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                42.8%
                                <span className="text-sm text-slate-400 ml-2 font-medium">to $VAL</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600 text-sm font-bold bg-blue-50 w-fit px-3 py-1 rounded-lg">
                                <TrendingUp size={14} /> +5.2% this week
                            </div>
                        </motion.div>
                    </div>

                    {/* Active Campaigns Table */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-900">Active Campaigns</h3>
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{campaigns.length} Running</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left max-w-full">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Campaign Name</th>
                                        <th className="px-6 py-4">Trigger</th>
                                        <th className="px-6 py-4">Reward</th>
                                        <th className="px-6 py-4">Engagement</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {campaigns.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">{c.trigger}</td>
                                            <td className="px-6 py-4 text-violet-600 font-bold text-sm">{c.reward}</td>
                                            <td className="px-6 py-4 text-slate-600 text-sm flex items-center gap-2">
                                                <Users size={14} className="text-slate-400" /> {c.engagement}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 inline-flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Col: Partner Ecosystem */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <Link size={18} /> Partner Ecosystem
                            </h3>
                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-slate-300">Live</span>
                        </div>

                        <div className="space-y-3">
                            {partners.map((b) => (
                                <div key={b.id} onClick={() => setSelectedBrand(b)} className="group flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-violet-500/50 cursor-pointer transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-inner">
                                            {b.logo}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold group-hover:text-violet-300 transition">{b.name}</div>
                                            <div className="text-xs text-slate-400">{b.type}</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-600 group-hover:text-white transition group-hover:-rotate-45" />
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setPartnerModalOpen(true)} className="w-full mt-6 py-3 border border-white/20 rounded-xl text-sm font-bold hover:bg-white/10 transition">
                            View All Intregrations
                        </button>
                    </div>

                    {/* Quick Analytics */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Redemption Velocity</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-black text-slate-900">{stats?.velocity24h || 0}</span>
                            <span className="text-sm text-slate-500 mb-1">txs / 24h</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-violet-500 w-[65%] h-full rounded-full" />
                        </div>
                        <div className="mt-4 text-xs text-slate-400">
                            High velocity observed in travel category integrations.
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Brand Analytics Modal */}
            <AnimatePresence>
                {selectedBrand && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
                            <button onClick={() => setSelectedBrand(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 font-bold text-xl">
                                    {selectedBrand.logo}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedBrand.name}</h2>
                                    <p className="text-slate-500">Connected Endpoint • {selectedBrand.type}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-violet-50 rounded-2xl">
                                    <div className="text-xs text-violet-600 font-bold uppercase mb-1">Mutual Value Flow</div>
                                    <div className="text-2xl font-black text-slate-900">{selectedBrand.volume}</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl">
                                    <div className="text-xs text-blue-600 font-bold uppercase mb-1">Shared Users</div>
                                    <div className="text-2xl font-black text-slate-900">{selectedBrand.mutualUsers}</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                <h4 className="font-bold text-sm text-slate-700 mb-3">Top Redemption Categories</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Gift Cards</span> <span className="font-bold">45%</span></div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-violet-500 w-[45%] h-full" /></div>

                                    <div className="flex justify-between text-sm mt-3"><span className="text-slate-500">Direct Purchase</span> <span className="font-bold">30%</span></div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 w-[30%] h-full" /></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* New Campaign Modal */}
            <AnimatePresence>
                {campaignModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
                            <button onClick={() => setCampaignModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    <PlusCircle />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">New Loyalty Campaign</h2>
                                    <p className="text-slate-500">Create a reward rule for your users.</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Campaign Name</label>
                                    <input id="camp_name" type="text" placeholder="e.g. Summer Flight Bonus" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-violet-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Trigger Condition</label>
                                    <input id="camp_trigger" type="text" placeholder="e.g. Book 3 Flights" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-violet-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Reward (Points)</label>
                                    <input id="camp_reward" type="number" placeholder="1000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-violet-500 outline-none" defaultValue={1000} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setCampaignModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
                                <button onClick={launchCampaign} disabled={submitting} className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 shadow-lg shadow-violet-200 flex items-center justify-center gap-2">
                                    {submitting ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : 'Launch Campaign'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Partner Modal */}
            <AnimatePresence>
                {partnerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
                            <button onClick={() => setPartnerModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                                    <Link />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Add Partner Brand</h2>
                                    <p className="text-slate-500">Expand your ecosystem.</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Partner Name</label>
                                    <input id="partner_name" type="text" placeholder="e.g. Lyft" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Integration Type</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>API Connection (Real-time)</option>
                                        <option>Batch File Transfer</option>
                                        <option>Aggregator</option>
                                    </select>
                                </div>
                            </div>

                            <button onClick={addPartner} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                                Send Connection Request
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

function PolicyToggle({ label, active }: any) {
    return (
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <span className={`font-medium ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-violet-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
    );
}
