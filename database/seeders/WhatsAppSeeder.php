<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WhatsAppSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo user
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
        ]);

        // Create contacts with conversations and messages
        $contacts = collect([
            ['name' => 'John Smith', 'phone' => '+6281234567890'],
            ['name' => 'Sarah Johnson', 'phone' => '+6281234567891'],
            ['name' => 'Mike Wilson', 'phone' => '+6281234567892'],
            ['name' => 'Lisa Chen', 'phone' => '+6281234567893'],
            ['name' => 'David Brown', 'phone' => '+6281234567894'],
            ['name' => null, 'phone' => '+6281234567895'], // Contact without name
        ]);

        $contacts->each(function ($contactData) use ($user) {
            $contact = Contact::factory()->create([
                'user_id' => $user->id,
                'name' => $contactData['name'],
                'phone_number' => $contactData['phone'],
                'last_message_at' => now()->subMinutes(random_int(1, 1440)), // Within last 24 hours
            ]);

            $conversation = Conversation::factory()->create([
                'user_id' => $user->id,
                'contact_id' => $contact->id,
                'unread_count' => random_int(0, 5),
                'last_message_at' => $contact->last_message_at,
            ]);

            // Create sample messages for each conversation
            $messageCount = random_int(5, 15);
            $messages = collect();
            
            for ($i = 0; $i < $messageCount; $i++) {
                $direction = random_int(1, 10) <= 6 ? 'inbound' : 'outbound'; // 60% inbound, 40% outbound
                $sentAt = now()->subMinutes(random_int(1, 2880)); // Within last 48 hours
                
                $messageData = [
                    'conversation_id' => $conversation->id,
                    'direction' => $direction,
                    'sent_at' => $sentAt,
                ];

                // Randomly create different types of messages
                $messageType = random_int(1, 10);
                if ($messageType <= 8) {
                    // 80% text messages
                    $messages->push(Message::factory()->create(array_merge($messageData, [
                        'type' => 'text',
                        'content' => $this->getRandomMessage($contact->name ?? 'Contact'),
                    ])));
                } elseif ($messageType === 9) {
                    // 10% image messages
                    $messages->push(Message::factory()->image()->create($messageData));
                } else {
                    // 10% other media
                    $factory = collect(['audio', 'document'])->random();
                    $messages->push(Message::factory()->{$factory}()->create($messageData));
                }
            }

            // Update conversation with latest message time
            $lastMessage = $messages->sortByDesc('sent_at')->first();
            if ($lastMessage) {
                $conversation->update([
                    'last_message_at' => $lastMessage->sent_at,
                ]);
                $contact->update([
                    'last_message_at' => $lastMessage->sent_at,
                ]);
            }
        });

        // Create one pinned conversation
        $pinnedContact = Contact::factory()->create([
            'user_id' => $user->id,
            'name' => 'Important Client',
            'phone_number' => '+6281234567896',
            'last_message_at' => now()->subMinutes(30),
        ]);

        $pinnedConversation = Conversation::factory()->pinned()->create([
            'user_id' => $user->id,
            'contact_id' => $pinnedContact->id,
            'unread_count' => 2,
            'last_message_at' => $pinnedContact->last_message_at,
        ]);

        // Add messages to pinned conversation
        Message::factory()->inbound()->create([
            'conversation_id' => $pinnedConversation->id,
            'content' => 'Hi! Are you available for a quick call?',
            'sent_at' => now()->subMinutes(35),
        ]);

        Message::factory()->inbound()->create([
            'conversation_id' => $pinnedConversation->id,
            'content' => 'We have an urgent matter to discuss.',
            'sent_at' => now()->subMinutes(30),
        ]);
    }

    /**
     * Get a random message based on contact name.
     *
     * @param string $contactName
     * @return string
     */
    protected function getRandomMessage(string $contactName): string
    {
        $messages = [
            "Hello! How are you today?",
            "Thanks for your help earlier.",
            "Are you available for a meeting tomorrow?",
            "Just wanted to check in with you.",
            "Can you send me the document we discussed?",
            "Great job on the presentation!",
            "Let's schedule a call next week.",
            "I have some questions about the project.",
            "Thanks for the quick response.",
            "Hope you have a great weekend!",
            "Can we discuss this in detail?",
            "I'll get back to you shortly.",
            "Perfect, that works for me.",
            "Let me know if you need anything else.",
            "Looking forward to working with you.",
        ];

        return collect($messages)->random();
    }
}