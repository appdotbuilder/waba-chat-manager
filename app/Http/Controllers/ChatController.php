<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display the main chat interface.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get conversations with contacts, ordered by last message time
        $conversations = Conversation::with(['contact', 'lastMessage'])
            ->where('user_id', $user->id)
            ->active()
            ->orderByDesc('is_pinned')
            ->orderByDesc('last_message_at')
            ->get()
            ->map(function ($conversation) {
                $lastMessage = $conversation->lastMessage->first();
                
                return [
                    'id' => $conversation->id,
                    'contact' => [
                        'id' => $conversation->contact->id,
                        'name' => $conversation->contact->display_name,
                        'phone_number' => $conversation->contact->phone_number,
                        'profile_picture' => $conversation->contact->profile_picture,
                    ],
                    'last_message' => $lastMessage ? [
                        'content' => $lastMessage->getPreview(50),
                        'type' => $lastMessage->type,
                        'direction' => $lastMessage->direction,
                        'sent_at' => $lastMessage->sent_at,
                        'status' => $lastMessage->status,
                    ] : null,
                    'unread_count' => $conversation->unread_count,
                    'is_pinned' => $conversation->is_pinned,
                    'last_message_at' => $conversation->last_message_at,
                ];
            });

        // Get selected conversation if specified
        $selectedConversation = null;
        if ($request->has('conversation')) {
            $conversationId = $request->get('conversation');
            $conversation = Conversation::with(['contact', 'messages'])
                ->where('user_id', $user->id)
                ->findOrFail($conversationId);
            
            // Mark conversation as read
            $conversation->markAsRead();
            
            $selectedConversation = [
                'id' => $conversation->id,
                'contact' => [
                    'id' => $conversation->contact->id,
                    'name' => $conversation->contact->display_name,
                    'phone_number' => $conversation->contact->phone_number,
                    'profile_picture' => $conversation->contact->profile_picture,
                ],
                'messages' => $conversation->messages->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'content' => $message->content,
                        'type' => $message->type,
                        'direction' => $message->direction,
                        'status' => $message->status,
                        'sent_at' => $message->sent_at,
                        'metadata' => $message->metadata,
                    ];
                }),
                'is_pinned' => $conversation->is_pinned,
            ];
        }

        return Inertia::render('chat', [
            'conversations' => $conversations,
            'selectedConversation' => $selectedConversation,
        ]);
    }
}