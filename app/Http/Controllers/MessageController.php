<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Store a newly created message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'content' => 'required|string|max:4096',
            'type' => 'in:text,image,audio,video,document,sticker,location',
        ]);

        $user = $request->user();
        
        // Verify user owns this conversation
        $conversation = Conversation::where('user_id', $user->id)
            ->findOrFail($request->conversation_id);

        // Create the message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'whatsapp_message_id' => 'msg_' . uniqid(), // Simulate WhatsApp message ID
            'direction' => 'outbound',
            'type' => $request->type ?? 'text',
            'content' => $request->content,
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        // Update conversation
        $conversation->update([
            'last_message_at' => $message->sent_at,
        ]);

        // Update contact's last message time
        $conversation->contact->update([
            'last_message_at' => $message->sent_at,
        ]);

        // Simulate message delivery after a short delay (in real app, this would be handled by webhooks)
        $message->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        return redirect()->route('chat', ['conversation' => $conversation->id]);
    }


}