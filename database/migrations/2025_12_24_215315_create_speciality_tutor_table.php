<?php

use App\Models\Speciality;
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
        Schema::create('speciality_tutor', function (Blueprint $table) {
            $table->foreignIdFor(Speciality::class)->constrained();
            $table->foreignIdFor(Tutor::class)->constrained();
            $table->primary(['speciality_id', 'tutor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speciality_tutor');
    }
};
