import { getApiUrl } from '../config';

export async function fetchStats() {
    const res = await fetch(getApiUrl('/api/v1/vcredits/stats'));
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}

export async function fetchIssuers() {
    const res = await fetch(getApiUrl('/api/v1/vcredits/issuers'));
    if (!res.ok) throw new Error('Failed to fetch issuers');
    return res.json();
}

export async function fetchTransactions() {
    const res = await fetch(getApiUrl('/api/v1/vcredits/transactions'));
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
}
