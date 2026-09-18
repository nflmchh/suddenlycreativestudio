<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::ordered()->get();

        return view('admin.clients.index', compact('clients'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'logos' => ['required', 'array', 'min:1'],
            'logos.*' => ['image', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
        ]);

        $nextOrder = (int) Client::max('sort_order') + 1;

        foreach ($request->file('logos', []) as $file) {
            $path = $file->store('clients', 'public');
            $name = Str::of($file->getClientOriginalName())
                ->before('.')
                ->replace(['-', '_'], ' ')
                ->title();

            Client::create([
                'name' => (string) $name ?: 'Client',
                'logo_path' => $path,
                'sort_order' => $nextOrder++,
            ]);
        }

        return redirect()->route('admin.clients.index')->with('status', 'Logo client berhasil ditambahkan.');
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $client->update([
            'name' => $data['name'],
            'sort_order' => $data['sort_order'] ?? $client->sort_order,
        ]);

        return redirect()->route('admin.clients.index')->with('status', 'Client diperbarui.');
    }

    public function destroy(Client $client)
    {
        Storage::disk('public')->delete($client->logo_path);
        $client->delete();

        return redirect()->route('admin.clients.index')->with('status', 'Client dihapus.');
    }
}
