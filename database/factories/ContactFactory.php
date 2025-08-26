<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Contact>
     */
    protected $model = Contact::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'phone_number' => '+62' . $this->faker->numerify('8#########'),
            'name' => $this->faker->name(),
            'profile_picture' => null,
            'last_message_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'is_blocked' => false,
            'metadata' => null,
        ];
    }

    /**
     * Indicate that the contact is blocked.
     */
    public function blocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_blocked' => true,
        ]);
    }

    /**
     * Indicate that the contact has no name (phone number only).
     */
    public function noName(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => null,
        ]);
    }

    /**
     * Indicate that the contact has a recent message.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'last_message_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
        ]);
    }
}