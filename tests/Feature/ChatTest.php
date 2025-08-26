<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that authenticated users can access the chat interface.
     */
    public function test_authenticated_user_can_access_chat(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('chat'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('chat')
                ->has('conversations')
        );
    }

    /**
     * Test that guests cannot access the chat interface.
     */
    public function test_guest_cannot_access_chat(): void
    {
        $response = $this->get(route('chat'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test that conversations are loaded correctly.
     */
    public function test_conversations_are_loaded_correctly(): void
    {
        $user = User::factory()->create();
        
        $contact = Contact::factory()->create([
            'user_id' => $user->id,
            'name' => 'Test Contact',
            'phone_number' => '+6281234567890',
        ]);

        $conversation = Conversation::factory()->create([
            'user_id' => $user->id,
            'contact_id' => $contact->id,
            'unread_count' => 2,
        ]);

        Message::factory()->create([
            'conversation_id' => $conversation->id,
            'content' => 'Hello there!',
            'direction' => 'inbound',
        ]);

        $response = $this->actingAs($user)->get(route('chat'));

        $response->assertInertia(fn ($page) => 
            $page->has('conversations', 1)
                ->where('conversations.0.contact.name', 'Test Contact')
                ->where('conversations.0.unread_count', 2)
        );
    }

    /**
     * Test that messages are loaded for selected conversation.
     */
    public function test_messages_are_loaded_for_selected_conversation(): void
    {
        $user = User::factory()->create();
        
        $contact = Contact::factory()->create(['user_id' => $user->id]);
        $conversation = Conversation::factory()->create([
            'user_id' => $user->id,
            'contact_id' => $contact->id,
        ]);

        Message::factory()->create([
            'conversation_id' => $conversation->id,
            'content' => 'Test message',
            'direction' => 'inbound',
        ]);

        $response = $this->actingAs($user)
            ->get(route('chat', ['conversation' => $conversation->id]));

        $response->assertInertia(fn ($page) => 
            $page->has('selectedConversation')
                ->has('selectedConversation.messages', 1)
                ->where('selectedConversation.messages.0.content', 'Test message')
        );
    }

    /**
     * Test that users can only access their own conversations.
     */
    public function test_users_can_only_access_own_conversations(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $contact = Contact::factory()->create(['user_id' => $user2->id]);
        $conversation = Conversation::factory()->create([
            'user_id' => $user2->id,
            'contact_id' => $contact->id,
        ]);

        $response = $this->actingAs($user1)
            ->get(route('chat', ['conversation' => $conversation->id]));

        $response->assertStatus(404);
    }

    /**
     * Test sending a message.
     */
    public function test_user_can_send_message(): void
    {
        $user = User::factory()->create();
        
        $contact = Contact::factory()->create(['user_id' => $user->id]);
        $conversation = Conversation::factory()->create([
            'user_id' => $user->id,
            'contact_id' => $contact->id,
        ]);

        $response = $this->actingAs($user)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'content' => 'Hello from test!',
            'type' => 'text',
        ]);

        $response->assertRedirect(route('chat', ['conversation' => $conversation->id]));

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'content' => 'Hello from test!',
            'direction' => 'outbound',
            'type' => 'text',
        ]);
    }

    /**
     * Test that conversation is updated when message is sent.
     */
    public function test_conversation_updated_when_message_sent(): void
    {
        $user = User::factory()->create();
        
        $contact = Contact::factory()->create(['user_id' => $user->id]);
        $conversation = Conversation::factory()->create([
            'user_id' => $user->id,
            'contact_id' => $contact->id,
            'last_message_at' => now()->subHour(),
        ]);

        $oldLastMessage = $conversation->last_message_at;

        $this->actingAs($user)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'content' => 'New message!',
            'type' => 'text',
        ]);

        $conversation->refresh();
        $contact->refresh();

        $this->assertTrue($conversation->last_message_at->isAfter($oldLastMessage));
        $this->assertTrue($contact->last_message_at->isAfter($oldLastMessage));
    }

    /**
     * Test message validation.
     */
    public function test_message_validation(): void
    {
        $user = User::factory()->create();
        
        $contact = Contact::factory()->create(['user_id' => $user->id]);
        $conversation = Conversation::factory()->create([
            'user_id' => $user->id,
            'contact_id' => $contact->id,
        ]);

        // Test empty content
        $response = $this->actingAs($user)->post(route('messages.store'), [
            'conversation_id' => $conversation->id,
            'content' => '',
        ]);

        $response->assertSessionHasErrors(['content']);

        // Test invalid conversation
        $response = $this->actingAs($user)->post(route('messages.store'), [
            'conversation_id' => 99999,
            'content' => 'Test message',
        ]);

        $response->assertSessionHasErrors(['conversation_id']);
    }
}