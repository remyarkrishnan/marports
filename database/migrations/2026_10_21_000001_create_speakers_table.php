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
        Schema::create('speakers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('designation')->nullable(); // Title / Designation
            $table->string('company')->nullable(); // Organization / Company
            $table->string('role')->default('Panelist'); // Panelist, Moderator, Keynote Speaker, etc.
            $table->string('image')->nullable();
            $table->longText('bio')->nullable(); // Executive biography
            $table->text('description')->nullable(); // Short description / synopsis
            $table->string('linkedin')->nullable(); // LinkedIn URL
            $table->string('topic')->nullable(); // Session topic or panel focus
            $table->integer('sort_order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speakers');
    }
};
