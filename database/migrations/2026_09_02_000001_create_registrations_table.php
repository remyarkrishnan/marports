<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('delegate'); // delegate, speaker, sponsor, awards
            $table->string('full_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('organization')->nullable();
            $table->string('designation')->nullable();
            $table->string('industry')->nullable();
            $table->string('pass_tier')->nullable(); // Standard, VIP Executive, Startup Pitch, Sponsor Tier
            $table->text('message')->nullable();
            $table->string('status')->default('confirmed');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
