<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Main Menu'); // Main Menu, Conference Topics Sub Menu, Awards Sub Menu, Global Header Menu
            $table->string('menu_label');
            $table->string('route_path')->default('/');
            $table->text('meta_description')->nullable();
            $table->json('content_blocks')->nullable();
            $table->string('status')->default('published'); // published, draft
            $table->string('last_edited_by')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_pages');
    }
};
