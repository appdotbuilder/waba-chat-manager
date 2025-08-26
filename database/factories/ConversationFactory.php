<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Conversation>
     */
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'contact_id' => Contact::factory(),
            'last_message_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'unread_count' => $this->faker->numberBetween(0, 5),
            'is_archived' => false,
            'is_pinned' => false,
        ];
    }

    /**
     * Indicate that the conversation is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_archived' => true,
        ]);
    }

    /**
     * Indicate that the conversation is pinned.
     */
    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => true,
        ]);
    }

    /**
     * Indicate that the conversation has unread messages.
     */
    public function withUnreadMessages(): static
    {
        return $this->state(fn (array $attributes) => [
            'unread_count' => $this->faker->numberBetween(1, 10),
        ]);
    }

    /**
     * Indicate that the conversation has no unread messages.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'unread_count' => 0,
        ]);
    }
}