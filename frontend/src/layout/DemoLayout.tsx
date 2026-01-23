import { useState, useEffect } from 'react';
import { AppShell } from './AppShell'; // Admin still uses shell structure? No, PremiumAdmin has custom layout.
import { PremiumAdminView } from '../features/dashboard/PremiumAdminView';
import { PremiumIssuerView } from '../features/dashboard/PremiumIssuerView';
import { PremiumBrandView } from '../features/dashboard/PremiumBrandView';
import { PremiumUserApp } from '../apps/PremiumUserApp';

import { getApiUrl } from '../config';

// ... imports

export function DemoLayout() {
    const [view, setView] = useState<'admin' | 'issuer' | 'brand' | 'user'>('admin');
    const [ids, setIds] = useState<any>(null);

    useEffect(() => {
        fetch(getApiUrl('/api/v1/vcredits/demo/ids'))
            .then(res => res.json())
            .then(setIds)
            .catch(console.error);
    }, []);

    const renderContent = () => {
        if (!ids) return <div className="p-10 text-center animate-pulse text-white">Initializing Value OS...</div>;

        switch (view) {
            case 'admin':
                return <PremiumAdminView />;
            case 'issuer':
                return <PremiumIssuerView issuerId={ids.issuerId} />;
            case 'brand':
                return <PremiumBrandView brandId={ids.brandId} />;
            case 'user':
                return <PremiumUserApp walletId={ids.walletId} />;
            default:
                return <div>Unknown View</div>;
        }
    };

    return (
        <div>
            {/* Global Persona Switcher */}
            <div className="fixed top-0 left-0 right-0 h-12 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-4 shadow-2xl">
                <div className="text-gray-400 font-mono text-xs hidden md:block">
                    ValueOS Demo Environment
                </div>
                <div className="flex bg-gray-800 rounded p-1 gap-1">
                    <button
                        onClick={() => setView('admin')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${view === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        ADMIN
                    </button>
                    <button
                        onClick={() => setView('issuer')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${view === 'issuer' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        ISSUER
                    </button>
                    <button
                        onClick={() => setView('brand')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${view === 'brand' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        BRAND
                    </button>
                    <button
                        onClick={() => setView('user')}
                        className={`px-3 py-1 rounded text-xs font-bold transition ${view === 'user' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        CONSUMER APP
                    </button>
                </div>
                <div className="text-gray-500 font-mono text-xs">
                    v0.1.0-alpha
                </div>
            </div>

            {/* Content Spacer for Fixed Header */}
            <div className="pt-12 min-h-screen bg-gray-50">
                {renderContent()}
            </div>
        </div>
    );
}
