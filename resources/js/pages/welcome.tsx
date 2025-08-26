import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: '💬',
            title: 'WhatsApp Integration',
            description: 'Connect your WhatsApp Business API to manage all customer conversations in one place.'
        },
        {
            icon: '⚡',
            title: 'Real-time Messaging',
            description: 'Send and receive messages instantly with live conversation updates.'
        },
        {
            icon: '👥',
            title: 'Multi-User Support',
            description: 'Team collaboration with user authentication and role-based access.'
        },
        {
            icon: '📊',
            title: 'Message Analytics',
            description: 'Track message status, delivery receipts, and conversation insights.'
        }
    ];

    return (
        <>
            <Head title="WhatsApp Business Manager">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-green-50 to-emerald-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                <header className="mb-6 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">💬</span>
                            <span className="text-lg font-semibold">WhatsApp Business Manager</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        Welcome, {auth.user.name}
                                    </span>
                                    <Link
                                        href={route('chat')}
                                        className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                                    >
                                        Open Chat
                                    </Link>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-sm border border-gray-300 px-5 py-1.5 text-sm leading-normal text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-600"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-green-600 px-5 py-2 text-sm leading-normal text-white hover:bg-green-700 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow">
                    <main className="flex w-full max-w-6xl flex-col lg:flex-row lg:gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="mb-8">
                                <h1 className="mb-6 text-5xl font-bold leading-tight">
                                    <span className="text-green-600">WhatsApp Business</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                                        Chat Manager
                                    </span>
                                </h1>
                                <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Streamline your business communications with our powerful WhatsApp Business API management platform. 
                                    Handle customer conversations efficiently and professionally.
                                </p>

                                {!auth.user && (
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3 text-lg font-medium text-white hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Start Free Trial
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-lg border-2 border-green-600 px-8 py-3 text-lg font-medium text-green-600 hover:bg-green-50 transition-all dark:hover:bg-gray-800"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                                {features.map((feature, index) => (
                                    <div key={index} className="text-center lg:text-left">
                                        <div className="flex items-start space-x-4">
                                            <span className="text-3xl">{feature.icon}</span>
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Mock Chat Interface */}
                        <div className="flex-1 mt-12 lg:mt-0 max-w-md">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                {/* Chat Header */}
                                <div className="bg-green-600 p-4 text-white">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            👤
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Customer Support</h3>
                                            <p className="text-green-100 text-sm">Online</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="p-4 space-y-4 h-80 overflow-y-auto bg-green-50 dark:bg-gray-900">
                                    {/* Incoming message */}
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs dark:bg-gray-700">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                Hello! I need help with my order.
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">2:30 PM</span>
                                        </div>
                                    </div>

                                    {/* Outgoing message */}
                                    <div className="flex justify-end">
                                        <div className="bg-green-600 p-3 rounded-lg shadow-sm max-w-xs text-white">
                                            <p className="text-sm">
                                                Hi! I'd be happy to help. Can you please provide your order number?
                                            </p>
                                            <div className="flex items-center justify-end space-x-1 mt-1">
                                                <span className="text-xs text-green-100">2:31 PM</span>
                                                <span className="text-green-100">✓✓</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Incoming message */}
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs dark:bg-gray-700">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                Sure! It's #12345. Thank you!
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">2:32 PM</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Input */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">Type a message...</span>
                                        </div>
                                        <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                                            📤
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        Built for UMKM businesses •{" "}
                        <span className="font-medium text-green-600">Secure</span> •{" "}
                        <span className="font-medium text-green-600">Scalable</span> •{" "}
                        <span className="font-medium text-green-600">Professional</span>
                    </p>
                </footer>
            </div>
        </>
    );
}