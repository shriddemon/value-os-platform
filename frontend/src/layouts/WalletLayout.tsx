import React from 'react';
import { Outlet } from 'react-router-dom';

export const WalletLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-md mx-auto min-h-screen bg-black shadow-2xl relative overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};
