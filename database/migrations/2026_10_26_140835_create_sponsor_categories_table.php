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
        Schema::create('sponsor_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->integer('sort_order')->default(1);
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Seed default established categories
        $defaultCategories = [
            ['name' => 'Strategic Partner', 'sort_order' => 1],
            ['name' => 'Gold Sponsor', 'sort_order' => 2],
            ['name' => 'Registration Area Sponsor', 'sort_order' => 3],
            ['name' => 'Badge and Lanyard Sponsor', 'sort_order' => 3],
            ['name' => 'Lunch & Coffee Sponsor', 'sort_order' => 4],
            ['name' => 'Conference Session Sponsor', 'sort_order' => 4],
            ['name' => 'Table Top Sponsor', 'sort_order' => 5],
            ['name' => 'Associate Sponsor', 'sort_order' => 6],
            ['name' => 'Promoting Organisation', 'sort_order' => 7],
        ];

        foreach ($defaultCategories as $cat) {
            DB::table('sponsor_categories')->updateOrInsert(
                ['name' => $cat['name']],
                [
                    'sort_order' => $cat['sort_order'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Also capture any other distinct types already present in sponsors table
        if (Schema::hasTable('sponsors')) {
            $existingSponsors = DB::table('sponsors')
                ->select('type', DB::raw('MIN(sort_order) as min_sort'))
                ->whereNotNull('type')
                ->groupBy('type')
                ->get();

            foreach ($existingSponsors as $s) {
                if (! empty($s->type)) {
                    DB::table('sponsor_categories')->updateOrInsert(
                        ['name' => trim($s->type)],
                        [
                            'sort_order' => (int) ($s->min_sort ?? 1),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsor_categories');
    }
};
