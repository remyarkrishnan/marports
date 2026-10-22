<?php

namespace Tests\Feature;

use App\Models\Sponsor;
use App\Models\User;
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
            'type' => 'Premier Sponsor',
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
}
