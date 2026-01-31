import React from 'react';
import { AppShell } from '../layout/AppShell';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
    return (
        <AppShell>
            <Outlet />
        </AppShell>
    );
};
