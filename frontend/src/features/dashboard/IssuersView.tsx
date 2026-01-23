import React, { useEffect, useState } from 'react';
import { fetchIssuers } from '../../api/client';

export const IssuersView: React.FC = () => {
    const [issuers, setIssuers] = useState<any[]>([]);

    useEffect(() => {
        fetchIssuers().then(setIssuers);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Brand Platform</h2>
                    <p className="text-sm text-gray-500">Manage registered loyalty issuers</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg shadow-blue-900/20">
                    + Onboard Brand
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issuers.map(issuer => (
                    <div key={issuer.id} className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                {issuer.name[0]}
                            </div>
                            <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">Active</span>
                        </div>
                        <h3 className="font-bold text-gray-800">{issuer.name}</h3>
                        <div className="text-xs text-gray-400 font-mono mb-4">{issuer.slug}</div>

                        <div className="space-y-2">
                            {issuer.creditDefs?.map((def: any) => (
                                <div key={def.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                    <span className="font-medium text-gray-600">{def.name}</span>
                                    <span className="font-mono text-xs bg-gray-200 px-1 rounded">{def.symbol}</span>
                                </div>
                            ))}
                            {(!issuer.creditDefs || issuer.creditDefs.length === 0) && (
                                <div className="text-xs text-gray-400 italic">No tokens defined</div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                            <button className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 rounded transition">
                                View Audit Log
                            </button>
                            <button className="flex-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 rounded transition">
                                Suspend
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
