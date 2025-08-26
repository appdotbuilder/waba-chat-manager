<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('phone_number')->unique();
            $table->string('name')->nullable();
            $table->string('profile_picture')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->boolean('is_blocked')->default(false);
            $table->json('metadata')->nullable()->comment('Store additional contact info');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'phone_number']);
            $table->index(['user_id', 'last_message_at']);
            $table->index('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};