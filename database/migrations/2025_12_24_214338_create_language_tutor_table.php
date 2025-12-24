<?php

use App\Models\Language;
use App\Models\Tutor;
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
        Schema::create('language_tutor', function (Blueprint $table) {
            $table->foreignIdFor(Language::class)->constrained();
            $table->foreignIdFor(Tutor::class)->constrained();
            $table->primary(['language_id', 'tutor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('language_tutor');
    }
};
