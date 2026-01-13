<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('end');
        });

        // Migrate data from 'confirmed' to 'status'
        DB::table('bookings')->where('confirmed', true)->update(['status' => 'confirmed']);

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('confirmed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->boolean('confirmed')->default(false)->after('end');
        });

        // Migrate data back
        DB::table('bookings')->where('status', 'confirmed')->update(['confirmed' => true]);

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
