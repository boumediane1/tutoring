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
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('bbb_meeting_id')->nullable();
            $table->string('bbb_attendee_password')->nullable();
            $table->string('bbb_moderator_password')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['bbb_meeting_id', 'bbb_attendee_password', 'bbb_moderator_password']);
        });
    }
};
