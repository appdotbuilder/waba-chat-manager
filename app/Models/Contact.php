<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\Contact
 *
 * @property int $id
 * @property int $user_id
 * @property string $phone_number
 * @property string|null $name
 * @property string|null $profile_picture
 * @property \Illuminate\Support\Carbon|null $last_message_at
 * @property bool $is_blocked
 * @property array|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Conversation> $conversations
 * @property-read \App\Models\Conversation|null $conversation
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Contact newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Contact newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Contact query()
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereIsBlocked($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereLastMessageAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereProfilePicture($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Contact whereUserId($value)
 * @method static \Database\Factories\ContactFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Contact extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'phone_number',
        'name',
        'profile_picture',
        'last_message_at',
        'is_blocked',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_message_at' => 'datetime',
        'is_blocked' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the contact.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all conversations for this contact.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * Get the conversation between the user and this contact.
     */
    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class)->where('user_id', $this->user_id);
    }

    /**
     * Get the display name for this contact.
     *
     * @return string
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name ?: $this->phone_number;
    }

    /**
     * Scope a query to only include active (non-blocked) contacts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_blocked', false);
    }
}