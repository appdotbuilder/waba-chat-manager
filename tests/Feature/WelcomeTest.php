<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that welcome page loads successfully.
     */
    public function test_welcome_page_loads(): void
    {
        $response = $this->get(route('welcome'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('welcome')
        );
    }

    /**
     * Test welcome page shows correct content for guests.
     */
    public function test_welcome_page_shows_guest_content(): void
    {
        $response = $this->get(route('welcome'));

        $response->assertInertia(fn ($page) => 
            $page->where('auth.user', null)
        );
    }

    /**
     * Test welcome page shows correct content for authenticated users.
     */
    public function test_welcome_page_shows_authenticated_content(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('welcome'));

        $response->assertInertia(fn ($page) => 
            $page->where('auth.user.name', $user->name)
                ->where('auth.user.email', $user->email)
        );
    }
}