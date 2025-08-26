import React, { useEffect, useRef } from 'react';
// Using simple date formatting instead of date-fns to avoid external dependency

interface MessageData {
    id: number;
    content: string | null;
    type: string;
    direction: 'inbound' | 'outbound';
    status: string;
    sent_at: string;
    metadata?: Record<string, unknown>;
}

interface MessageListProps {
    messages: MessageData[];
}

export function MessageList({ messages }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDateHeader = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const shouldShowDateHeader = (currentMessage: MessageData, previousMessage?: MessageData) => {
        if (!previousMessage) return true;
        
        const currentDate = new Date(currentMessage.sent_at).toDateString();
        const previousDate = new Date(previousMessage.sent_at).toDateString();
        
        return currentDate !== previousDate;
    };

    const renderMessageContent = (message: MessageData) => {
        if (message.type === 'text') {
            return (
                <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                </p>
            );
        }

        // Handle media messages
        const mediaIcons = {
            image: '📷',
            audio: '🎵',
            video: '🎥',
            document: '📄',
            sticker: '😊',
            location: '📍'
        };

        return (
            <div className="flex items-center space-x-2">
                <span className="text-lg">
                    {mediaIcons[message.type as keyof typeof mediaIcons] || '📎'}
                </span>
                <span className="text-sm">
                    {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                    {message.metadata && typeof message.metadata === 'object' && 
                     'filename' in message.metadata && 
                     typeof message.metadata.filename === 'string' && 
                     ` - ${message.metadata.filename}`}
                </span>
            </div>
        );
    };

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                <p className="text-sm text-center">Send your first message to begin the conversation.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
                const previousMessage = index > 0 ? messages[index - 1] : undefined;
                const showDateHeader = shouldShowDateHeader(message, previousMessage);
                const isOutbound = message.direction === 'outbound';

                return (
                    <div key={message.id}>
                        {/* Date header */}
                        {showDateHeader && (
                            <div className="flex justify-center mb-4">
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                                    {formatDateHeader(message.sent_at)}
                                </span>
                            </div>
                        )}

                        {/* Message */}
                        <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                    isOutbound
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                            >
                                {renderMessageContent(message)}
                                
                                {/* Time and status */}
                                <div className={`flex items-center justify-end space-x-1 mt-2 ${
                                    isOutbound ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    <span className="text-xs">
                                        {formatMessageTime(message.sent_at)}
                                    </span>
                                    {isOutbound && (
                                        <span className="text-xs">
                                            {message.status === 'read' ? '✓✓' : 
                                             message.status === 'delivered' ? '✓✓' : '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}