import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        💬 WhatsApp Business Manager
                    </h1>
                    <p className="text-green-100 mb-4">
                        Manage your WhatsApp Business API conversations efficiently and professionally.
                    </p>
                    <Link
                        href={route('chat')}
                        className="inline-flex items-center px-4 py-2 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                    >
                        Open Chat Interface →
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Conversations</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">💬</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Messages Today</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📨</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">94%</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⚡</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href={route('chat')}
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="text-xl">💬</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Open Chat</span>
                        </Link>

                        <button 
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            disabled
                        >
                            <span className="text-xl">📊</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Analytics</span>
                        </button>

                        <button 
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            disabled
                        >
                            <span className="text-xl">⚙️</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
                        </button>

                        <button 
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            disabled
                        >
                            <span className="text-xl">👥</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Contacts</span>
                        </button>
                    </div>
                </div>

                {/* API Status */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">WhatsApp API Status</h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Connected and receiving messages</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Last sync: 2 minutes ago</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}