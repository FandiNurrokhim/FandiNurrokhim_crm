<?php

namespace Database\Seeders;

use App\Models\Deal;
use App\Models\Lead;
use App\Models\User;
use App\Models\Product;
use App\Models\Approval;
use App\Models\Customer;
use App\Models\DealProduct;
use App\Models\CustomerService;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat role
        $this->call(RolePermissionSeeder::class);

        // Buat Manager
        $manager = User::factory()->create([
            'name' => 'Manager Demo',
            'email' => 'manager@test.com',
            'password' => bcrypt('password'),
        ]);
        $manager->assignRole("Manager");

        // $this->call(TestDataSeeder::class);
        $this->call(MenuSeeder::class);


        // Buat beberapa Sales
        $salesUsers = User::factory(5)->create()->each(function ($user) {
            $user->assignRole("Sales");
        });

        // === Data lain (produk, leads, customers, deals) ===
        $products = Product::factory(10)->create();

        $salesUsers->each(function ($salesUser) use ($products) {
            $leads = Lead::factory(5)->create(['owner_id' => $salesUser->id]);
            $customers = Customer::factory(3)->create(['owner_id' => $salesUser->id]);

            $deals = Deal::factory(5)->create([
                'owner_id' => $salesUser->id,
                'lead_id' => $leads->random()->id,
                'customer_id' => $customers->random()->id,
            ]);

            $deals->each(function ($deal) use ($products, $salesUser) {
                $product = $products->random();

                DealProduct::factory()->create([
                    'deal_id' => $deal->id,
                    'product_id' => $product->id,
                    'negotiated_price' => $product->sell_price,
                    'qty' => 1,
                    'subtotal' => $product->sell_price * 1,
                ]);

                if ($deal->status === 'waiting_approval') {
                    Approval::factory()->create(['deal_id' => $deal->id]);
                }
            });

            $customers->each(function ($customer) use ($products) {
                CustomerService::factory()->create([
                    'customer_id' => $customer->id,
                    'product_id' => $products->random()->id,
                ]);
            });
        });
    }
}
