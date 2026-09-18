@extends('admin.layout')

@section('title', 'Clients')

@section('content')
    <div class="admin-card">
        <h1>Logo Client</h1>
        <p class="hint">Ditampilkan di bagian "Dipercaya Oleh" pada halaman utama. Bisa upload beberapa logo sekaligus.</p>

        <form method="POST" action="{{ route('admin.clients.store') }}" enctype="multipart/form-data" id="clientLogosForm">
            @csrf
            <div class="field">
                <label for="logos">Upload Logo (bisa pilih beberapa sekaligus)</label>
                <input type="file" id="logos" name="logos[]" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple required>
                <p class="hint">Format JPG/PNG/WebP/SVG. WebP dan SVG otomatis dikonversi ke PNG di browser sebelum diupload, supaya aman di server. Nama client otomatis diambil dari nama file, bisa diubah setelah upload.</p>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="ph ph-upload-simple"></i> Upload Logo
                </button>
            </div>
        </form>
    </div>

    <div class="admin-card">
        <h1>Daftar Client</h1>

        @if ($clients->isEmpty())
            <p>Belum ada logo client.</p>
        @else
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Nama</th>
                            <th>Urutan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($clients as $client)
                            <tr>
                                <td>
                                    <img class="thumb" style="width:80px; height:50px; object-fit:contain; background:#fff;" src="{{ asset('storage/'.$client->logo_path) }}" alt="{{ $client->name }}">
                                </td>
                                <td colspan="2">
                                    <form method="POST" action="{{ route('admin.clients.update', $client) }}" style="display:flex; gap:8px; align-items:center;">
                                        @csrf
                                        @method('PUT')
                                        <input type="text" name="name" value="{{ $client->name }}" style="max-width:200px;">
                                        <input type="number" name="sort_order" value="{{ $client->sort_order }}" style="max-width:80px;">
                                        <button type="submit" class="btn btn-glass btn-sm">Simpan</button>
                                    </form>
                                </td>
                                <td>
                                    <form method="POST" action="{{ route('admin.clients.destroy', $client) }}" onsubmit="return confirm('Hapus logo client ini?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-glass btn-sm">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
@endsection
