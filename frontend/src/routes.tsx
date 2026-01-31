import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { PremiumUserApp } from './apps/PremiumUserApp';
import { PremiumIssuerView } from './features/dashboard/PremiumIssuerView';
import { DashboardLayout } from './layouts/DashboardLayout';
import { WalletLayout } from './layouts/WalletLayout';
import { LandingPage } from './pages/LandingPage';
import { IssuerOnboardingWizard } from './features/onboarding/IssuerOnboardingWizard';
import { TransactionsView } from './features/dashboard/views/TransactionsView';
import { PolicyEngineView } from './features/dashboard/views/PolicyEngineView';
import { ComplianceView } from './features/dashboard/views/ComplianceView';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    // ...
    {
        path: '/wallet',
        element: <WalletLayout />,
        children: [
            {
                index: true,
                element: <PremiumUserApp walletId="demo" />,
            }
        ]
    },
    {
        path: '/issuer/onboarding',
        element: <IssuerOnboardingWizard />
    },
    {
        path: '/issuer',
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <PremiumIssuerView issuerId="demo" />,
            },
            {
                path: 'transactions',
                element: <TransactionsView />,
            },
            {
                path: 'policy',
                element: <PolicyEngineView />,
            },
            {
                path: 'compliance',
                element: <ComplianceView />,
            },
            {
                path: 'merchants',
                // Reusing TransactionsView or placeholder for now, or just alert
                element: <div className="p-10 text-center font-bold text-slate-400">Merchant Network Management</div>
            }
        ]
    }
]);
