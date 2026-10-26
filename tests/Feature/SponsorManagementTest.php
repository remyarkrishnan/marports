<?php

namespace Tests\Feature;

use App\Http\Controllers\Admin\AdminSponsorController;
use App\Models\Sponsor;
use App\Models\SponsorCategory;
use App\Models\User;
use Database\Seeders\ConferenceSessionSponsorSeeder;
use Database\Seeders\StrategicPartnerSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SponsorManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_sponsors_list(): void
    {
        $user = User::first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.sponsors'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Sponsors')
            ->has('sponsors')
            ->has('metrics')
        );
    }

    public function test_admin_can_create_sponsor(): void
    {
        $user = User::first() ?? User::factory()->create();

        $response = $this->actingAs($user)->from(route('admin.sponsors'))->post(route('admin.sponsors.store'), [
            'type' => 'Strategic Partner',
            'name' => 'Global Maritime Logistics',
            'description' => 'World class logistics provider',
            'website_url' => 'https://example.com',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.sponsors'));
        $this->assertDatabaseHas('sponsors', [
            'name' => 'Global Maritime Logistics',
            'type' => 'Strategic Partner',
            'sort_order' => 1,
            'is_active' => 1,
        ]);
    }

    public function test_admin_can_update_sponsor(): void
    {
        $user = User::first() ?? User::factory()->create();
        $sponsor = Sponsor::first() ?? Sponsor::create([
            'name' => 'Initial Name Ltd',
            'type' => 'Strategic Partner',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->from(route('admin.sponsors'))->post(route('admin.sponsors.update', $sponsor), [
            'type' => 'Updated Category',
            'name' => 'Updated Name Ltd',
            'description' => 'Updated description test',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.sponsors'));
        $this->assertDatabaseHas('sponsors', [
            'id' => $sponsor->id,
            'name' => 'Updated Name Ltd',
            'type' => 'Updated Category',
            'sort_order' => 10,
        ]);
    }

    public function test_admin_can_toggle_sponsor_active_status(): void
    {
        $user = User::first() ?? User::factory()->create();
        $sponsor = Sponsor::first() ?? Sponsor::create([
            'name' => 'Toggle Name Ltd',
            'type' => 'Strategic Partner',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $initialStatus = $sponsor->is_active;

        $response = $this->actingAs($user)->post(route('admin.sponsors.toggle_active', $sponsor));

        $response->assertRedirect();
        $this->assertDatabaseHas('sponsors', [
            'id' => $sponsor->id,
            'is_active' => ! $initialStatus,
        ]);
    }

    public function test_admin_can_delete_sponsor(): void
    {
        $user = User::first() ?? User::factory()->create();
        $sponsor = Sponsor::create([
            'type' => 'Temp Sponsor',
            'name' => 'To Be Deleted Ltd',
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->from(route('admin.sponsors'))->delete(route('admin.sponsors.destroy', $sponsor));

        $response->assertRedirect(route('admin.sponsors'));
        $this->assertDatabaseMissing('sponsors', [
            'id' => $sponsor->id,
        ]);
    }

    public function test_home_page_supplies_grouped_sponsors(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('sponsors')
        );
    }

    public function test_strategic_partner_seeder_creates_or_updates_partner_at_sort_order_one(): void
    {
        // Simulate existing sponsor at order 1 (like on live before seeder runs)
        Sponsor::create([
            'name' => 'AS Gold Sponsor',
            'type' => 'Gold Sponsor',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->seed(StrategicPartnerSeeder::class);

        $strategic = Sponsor::where('name', 'Directorate General of Maritime Administration')->first();
        $this->assertNotNull($strategic);
        $this->assertEquals(1, $strategic->sort_order);
        $this->assertEquals('Strategic Partner', $strategic->type);

        $asGold = Sponsor::where('name', 'AS Gold Sponsor')->first();
        $this->assertEquals(2, $asGold->sort_order);
    }

    public function test_conference_session_sponsor_seeder_creates_sponsor_at_sort_order_four(): void
    {
        $this->seed(ConferenceSessionSponsorSeeder::class);

        $sponsor = Sponsor::where('name', 'Sankri Maritime Solutions Pvt Ltd')->first();
        $this->assertNotNull($sponsor);
        $this->assertEquals(4, $sponsor->sort_order);
        $this->assertEquals('Conference Session Sponsor', $sponsor->type);
        $this->assertStringContainsString('sankri-maritime-logo.svg', $sponsor->logo);
    }

    public function test_conference_session_sponsor_category_resolves_to_row_four(): void
    {
        $order = AdminSponsorController::resolveSortOrderForType('Conference Session Sponsor');
        $this->assertEquals(4, $order);
    }

    public function test_admin_can_create_category_with_new_row_and_pushes_down_subsequent_rows(): void
    {
        $user = User::first() ?? User::factory()->create();

        SponsorCategory::firstOrCreate(['name' => 'Strategic Partner'], ['sort_order' => 1]);
        SponsorCategory::firstOrCreate(['name' => 'Gold Sponsor'], ['sort_order' => 2]);
        Sponsor::create(['name' => 'Gold Co', 'type' => 'Gold Sponsor', 'sort_order' => 2, 'is_active' => true]);

        $response = $this->actingAs($user)->post(route('admin.sponsors.categories.store'), [
            'name' => 'Platinum Sponsor',
            'placement_mode' => 'new_row',
            'target_row' => 2,
            'description' => 'Top tier between Strategic and Gold',
        ]);

        $response->assertRedirect();

        // Platinum should be in row 2
        $this->assertDatabaseHas('sponsor_categories', [
            'name' => 'Platinum Sponsor',
            'sort_order' => 2,
        ]);

        // Gold Sponsor category and its sponsors should be pushed down to row 3
        $this->assertDatabaseHas('sponsor_categories', [
            'name' => 'Gold Sponsor',
            'sort_order' => 3,
        ]);
        $this->assertDatabaseHas('sponsors', [
            'name' => 'Gold Co',
            'sort_order' => 3,
        ]);

        // Strategic Partner should remain at row 1
        $this->assertDatabaseHas('sponsor_categories', [
            'name' => 'Strategic Partner',
            'sort_order' => 1,
        ]);
    }

    public function test_admin_can_create_category_sharing_existing_row_without_pushing_rows(): void
    {
        $user = User::first() ?? User::factory()->create();

        SponsorCategory::firstOrCreate(['name' => 'Lunch & Coffee Sponsor'], ['sort_order' => 4]);
        SponsorCategory::firstOrCreate(['name' => 'Table Top Sponsor'], ['sort_order' => 5]);

        $response = $this->actingAs($user)->post(route('admin.sponsors.categories.store'), [
            'name' => 'Beverage Partner',
            'placement_mode' => 'existing_row',
            'target_row' => 4,
        ]);

        $response->assertRedirect();

        // Both should share row 4
        $this->assertDatabaseHas('sponsor_categories', [
            'name' => 'Lunch & Coffee Sponsor',
            'sort_order' => 4,
        ]);
        $this->assertDatabaseHas('sponsor_categories', [
            'name' => 'Beverage Partner',
            'sort_order' => 4,
        ]);

        // Row 5 should NOT be pushed
        $this->assertDatabaseHas('sponsor_categories', [
            'name' => 'Table Top Sponsor',
            'sort_order' => 5,
        ]);
    }

    public function test_admin_cannot_delete_category_with_sponsors(): void
    {
        $user = User::first() ?? User::factory()->create();

        $cat = SponsorCategory::create(['name' => 'Active Category', 'sort_order' => 3]);
        Sponsor::create(['name' => 'Sponsor In Cat', 'type' => 'Active Category', 'sort_order' => 3, 'is_active' => true]);

        $response = $this->actingAs($user)->delete(route('admin.sponsors.categories.destroy', $cat));

        $response->assertRedirect();
        $this->assertDatabaseHas('sponsor_categories', [
            'id' => $cat->id,
            'name' => 'Active Category',
        ]);
    }
}
