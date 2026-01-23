import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../api/client';

export const TransactionsView: React.FC = () => {
    const [txs, setTxs] = useState<any[]>([]);

    useEffect(() => {
        fetchTransactions().then(setTxs);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Global Ledger</h3>
                <span className="text-xs font-mono text-gray-400">LIVE FEED</span>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {txs.map(tx => (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-mono text-xs text-gray-400">{tx.id.split('-')[0]}...</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'MINT' ? 'bg-green-100 text-green-700' :
                                        tx.type === 'BURN' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {tx.type}
                                </span>
                            </td>
                            <td className="px-6 py-4">{tx.status}</td>
                            <td className="px-6 py-4 text-gray-400">{new Date(tx.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                    {txs.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-400">No transactions found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
