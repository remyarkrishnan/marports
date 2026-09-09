<?php

namespace Tests\Feature;

use App\Models\Sponsor;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SponsorManagementTest extends TestCase
{
    use DatabaseTransactions;

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

        $response = $this->actingAs($user)->post(route('admin.sponsors.store'), [
            'type' => 'Diamond Sponsor',
            'name' => 'Global Maritime Logistics',
            'description' => 'World class logistics provider',
            'website_url' => 'https://example.com',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.sponsors'));
        $this->assertDatabaseHas('sponsors', [
            'name' => 'Global Maritime Logistics',
            'type' => 'Diamond Sponsor',
            'sort_order' => 1,
            'is_active' => 1,
        ]);
    }

    public function test_admin_can_update_sponsor(): void
    {
        $user = User::first() ?? User::factory()->create();
        $sponsor = Sponsor::first();

        $response = $this->actingAs($user)->post(route('admin.sponsors.update', $sponsor), [
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
        $sponsor = Sponsor::first();
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

        $response = $this->actingAs($user)->delete(route('admin.sponsors.destroy', $sponsor));

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
}
