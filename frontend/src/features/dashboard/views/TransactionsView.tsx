import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Filter } from 'lucide-react';
import { getApiUrl } from '../../../config';

export function TransactionsView() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('/api/v1/vcredits/transactions'));
            const data = await res.json();
            setTransactions(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        // Poll for updates every 5s for "Real-Time" feel
        const interval = setInterval(fetchTransactions, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Ledger Activity</h2>
                    <p className="text-slate-500">Real-time view of all asset movements.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
                        <Filter size={16} /> Filter
                    </button>
                    <button
                        onClick={fetchTransactions}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-violet-700 shadow-lg shadow-violet-200"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx, i) => (
                            <motion.tr
                                key={tx.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-slate-50/50 transition cursor-pointer"
                            >
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                    {tx.id.substring(0, 18)}...
                                </td>
                                <td className="px-6 py-4">
                                    {tx.type === 'MINT' ? (
                                        <span className="flex items-center gap-2 text-violet-600 font-bold text-xs bg-violet-50 px-2 py-1 rounded w-fit">
                                            <ArrowUpRight size={14} /> MINT
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded w-fit">
                                            <ArrowDownLeft size={14} /> REDEMPTION
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700">
                                    {/* Mock Asset Name if not joined yet */}
                                    {tx.ledgerEntries?.[0]?.creditDefId || 'Unknown Asset'}
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                                    {/* Sum of positive amounts */}
                                    {tx.ledgerEntries?.reduce((acc: number, e: any) => acc + (e.direction === 'CREDIT' ? Number(e.amount) : 0), 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        COMPLETED
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(tx.createdAt).toLocaleString()}
                                </td>
                            </motion.tr>
                        ))}

                        {transactions.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No transactions found yet. Launch a campaign to see activity!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
