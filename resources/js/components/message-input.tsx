import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface MessageInputProps {
    conversationId: number;
}

export function MessageInput({ conversationId }: MessageInputProps) {
    const [message, setMessage] = useState('');
    
    const { setData, post, processing } = useForm({
        conversation_id: conversationId,
        content: '',
        type: 'text'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!message.trim() || processing) return;

        setData({
            conversation_id: conversationId,
            content: message.trim(),
            type: 'text'
        });

        post(route('messages.store'), {
            onSuccess: () => {
                setMessage('');
            },
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                {/* Message input */}
                <div className="flex-1">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={processing}
                        style={{
                            minHeight: '40px',
                            maxHeight: '120px',
                            height: 'auto'
                        }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!message.trim() || processing}
                    className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm"
                    title="Send message"
                >
                    {processing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <span className="text-lg">📤</span>
                    )}
                </button>

                {/* Optional: Media upload button */}
                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Attach media (coming soon)"
                    disabled
                >
                    <span className="text-lg">📎</span>
                </button>
            </form>
        </div>
    );
}