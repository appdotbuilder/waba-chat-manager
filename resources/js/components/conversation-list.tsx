import React from 'react';
import { Link } from '@inertiajs/react';
// Using simple date formatting instead of date-fns to avoid external dependency

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

interface ConversationListProps {
    conversations: Conversation[];
    selectedConversationId?: number;
}

export function ConversationList({ conversations, selectedConversationId }: ConversationListProps) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            
            if (diffInMinutes < 1) return 'now';
            if (diffInMinutes < 60) return `${diffInMinutes}m`;
            if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
            return `${Math.floor(diffInMinutes / 1440)}d`;
        } catch {
            return '';
        }
    };

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-sm text-center">Start a conversation or wait for customers to message you.</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto">
            {conversations.map((conversation) => {
                const isSelected = selectedConversationId === conversation.id;
                const contact = conversation.contact;
                const lastMessage = conversation.last_message;

                return (
                    <Link
                        key={conversation.id}
                        href={route('chat', { conversation: conversation.id })}
                        className={`block hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                            isSelected ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                        }`}
                    >
                        <div className="p-4">
                            <div className="flex items-center space-x-3">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {contact.profile_picture ? (
                                        <img
                                            src={contact.profile_picture}
                                            alt={contact.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                                            {getInitials(contact.name)}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {contact.name}
                                            </h3>
                                            {conversation.is_pinned && (
                                                <span className="text-yellow-500" title="Pinned">📌</span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {conversation.last_message_at && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatTime(conversation.last_message_at)}
                                                </span>
                                            )}
                                            {conversation.unread_count > 0 && (
                                                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                                    {conversation.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phone number */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        {contact.phone_number}
                                    </p>

                                    {/* Last message preview */}
                                    {lastMessage && (
                                        <div className="flex items-center space-x-1">
                                            {lastMessage.direction === 'outbound' && (
                                                <span className="text-gray-400 text-xs">
                                                    {lastMessage.status === 'read' ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                                {lastMessage.content}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}