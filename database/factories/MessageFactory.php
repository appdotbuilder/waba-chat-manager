<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Message>
     */
    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $direction = $this->faker->randomElement(['inbound', 'outbound']);
        $sentAt = $this->faker->dateTimeBetween('-1 month', 'now');
        
        return [
            'conversation_id' => Conversation::factory(),
            'whatsapp_message_id' => 'wamid.' . $this->faker->uuid(),
            'direction' => $direction,
            'type' => 'text',
            'content' => $this->faker->sentence(),
            'metadata' => null,
            'status' => $direction === 'outbound' ? $this->faker->randomElement(['sent', 'delivered', 'read']) : 'read',
            'sent_at' => $sentAt,
            'delivered_at' => $direction === 'outbound' ? $this->faker->dateTimeBetween($sentAt, 'now') : null,
            'read_at' => $direction === 'outbound' ? $this->faker->dateTimeBetween($sentAt, 'now') : $sentAt,
        ];
    }

    /**
     * Indicate that the message is inbound (from contact).
     */
    public function inbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => 'inbound',
            'status' => 'read',
            'delivered_at' => null,
            'read_at' => $this->faker->dateTimeBetween($attributes['sent_at'] ?? '-1 hour', 'now'),
        ]);
    }

    /**
     * Indicate that the message is outbound (from user).
     */
    public function outbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => 'outbound',
            'status' => $this->faker->randomElement(['sent', 'delivered', 'read']),
        ]);
    }

    /**
     * Indicate that the message is an image.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'image',
            'content' => null,
            'metadata' => [
                'url' => $this->faker->imageUrl(640, 480),
                'caption' => $this->faker->optional()->sentence(),
                'mime_type' => 'image/jpeg',
                'size' => $this->faker->numberBetween(100000, 2000000),
            ],
        ]);
    }

    /**
     * Indicate that the message is an audio.
     */
    public function audio(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'audio',
            'content' => null,
            'metadata' => [
                'url' => $this->faker->url(),
                'duration' => $this->faker->numberBetween(5, 120),
                'mime_type' => 'audio/ogg',
                'size' => $this->faker->numberBetween(50000, 500000),
            ],
        ]);
    }

    /**
     * Indicate that the message is a document.
     */
    public function document(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'document',
            'content' => null,
            'metadata' => [
                'url' => $this->faker->url(),
                'filename' => $this->faker->word() . '.pdf',
                'mime_type' => 'application/pdf',
                'size' => $this->faker->numberBetween(100000, 5000000),
            ],
        ]);
    }

    /**
     * Indicate that the message is unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'read_at' => null,
        ]);
    }
}