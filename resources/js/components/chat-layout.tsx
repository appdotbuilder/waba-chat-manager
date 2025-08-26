import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface ChatLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function ChatLayout({ children, title = 'WhatsApp Business Chat' }: ChatLayoutProps) {
    return (
        <>
            <Head title={title} />
            <AppShell>{children}</AppShell>
        </>
    );
}