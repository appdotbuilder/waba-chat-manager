import React from 'react';
import { ChatLayout } from '@/components/chat-layout';
import { ConversationList } from '@/components/conversation-list';
import { MessageList } from '@/components/message-list';
import { MessageInput } from '@/components/message-input';

interface Contact {
    id: number;
    name: string;
    phone_number: string;
    profile_picture?: string;
}

interface LastMessage {
    content: string;
    type: string;
    direction: 'inbound' | 'outbound';
    sent_at: string;
    status: string;
}

interface Conversation {
    id: number;
    contact: Contact;
    last_message: LastMessage | null;
    unread_count: number;
    is_pinned: boolean;
    last_message_at: string | null;
}

interface MessageData {
    id: number;
    content: string | null;
    type: string;
    direction: 'inbound' | 'outbound';
    status: string;
    sent_at: string;
    metadata?: Record<string, unknown>;
}

interface SelectedConversation {
    id: number;
    contact: Contact;
    messages: MessageData[];
    is_pinned: boolean;
}

interface Props {
    conversations: Conversation[];
    selectedConversation?: SelectedConversation;
    [key: string]: unknown;
}

export default function Chat({ conversations, selectedConversation }: Props) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <ChatLayout>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar - Conversation List */}
                <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                <span>💬</span>
                                <span>WhatsApp Chats</span>
                            </h1>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="Search conversations"
                                >
                                    🔍
                                </button>
                                <button
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="More options"
                                >
                                    ⋮
                                </button>
                            </div>
                        </div>
                        
                        {/* Status indicator */}
                        <div className="flex items-center space-x-2 mt-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                WhatsApp Business API Connected
                            </span>
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-hidden">
                        <ConversationList 
                            conversations={conversations}
                            selectedConversationId={selectedConversation?.id}
                        />
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {selectedConversation.contact.profile_picture ? (
                                            <img
                                                src={selectedConversation.contact.profile_picture}
                                                alt={selectedConversation.contact.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                                                {getInitials(selectedConversation.contact.name)}
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                                <span>{selectedConversation.contact.name}</span>
                                                {selectedConversation.is_pinned && (
                                                    <span className="text-yellow-500" title="Pinned">📌</span>
                                                )}
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {selectedConversation.contact.phone_number}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Voice call"
                                        >
                                            📞
                                        </button>
                                        <button
                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Video call"
                                        >
                                            📹
                                        </button>
                                        <button
                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="More options"
                                        >
                                            ⋮
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden flex flex-col">
                                <MessageList messages={selectedConversation.messages} />
                                
                                {/* Message Input */}
                                <MessageInput conversationId={selectedConversation.id} />
                            </div>
                        </>
                    ) : (
                        /* No conversation selected */
                        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                            <div className="text-center">
                                <div className="text-8xl mb-6">💬</div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                    WhatsApp Business Manager
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                                    Select a conversation from the sidebar to start managing your WhatsApp Business communications, 
                                    or wait for new messages to appear automatically.
                                </p>
                                
                                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-md mx-auto">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h3>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                                        <li className="flex items-center space-x-2">
                                            <span>📱</span>
                                            <span>Connect your WhatsApp Business API</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span>💬</span>
                                            <span>Receive messages from customers</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span>✅</span>
                                            <span>Reply and manage conversations</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ChatLayout>
    );
}