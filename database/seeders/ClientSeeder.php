<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ClientSeeder extends Seeder
{
    /**
     * Migrates the brand logos that used to be hardcoded in the landing
     * page (public/assets/img/brands/*) into the new Client CRUD, so
     * switching to it doesn't wipe the "Dipercaya Oleh" section.
     */
    public function run(): void
    {
        $brands = [
            ['file' => 'kemendikbud.jpg', 'name' => 'Kementerian Pendidikan dan Kebudayaan'],
            ['file' => 'ibox.jpg', 'name' => 'iBox'],
            ['file' => 'redbox.png', 'name' => 'RedBox Event'],
            ['file' => 'pln.png', 'name' => 'PLN'],
            ['file' => 'telkomsel.webp', 'name' => 'Telkomsel'],
            ['file' => 'coklat-kita.jpg', 'name' => 'Coklat Kita'],
            ['file' => 'xlsmart.png', 'name' => 'XLSMART'],
        ];

        $nextOrder = 1;

        foreach ($brands as $brand) {
            $sourcePath = public_path('assets/img/brands/'.$brand['file']);

            if (! is_file($sourcePath) || Client::where('name', $brand['name'])->exists()) {
                continue;
            }

            $destination = 'clients/'.$brand['file'];
            Storage::disk('public')->put($destination, file_get_contents($sourcePath));

            Client::create([
                'name' => $brand['name'],
                'logo_path' => $destination,
                'sort_order' => $nextOrder++,
            ]);
        }
    }
}
