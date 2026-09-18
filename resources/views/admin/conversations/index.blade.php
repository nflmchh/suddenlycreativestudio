@extends('admin.layout')

@section('title', 'Percakapan Suci')

@section('content')
    <div class="admin-card">
        <div class="window-bar">
            <div class="traffic-lights">
                <span class="red"></span><span class="yellow"></span><span class="green"></span>
            </div>
            <span class="title">Percakapan Suci dengan Pengunjung</span>
        </div>
        <div class="admin-card-body">
            <p class="hint">Daftar semua sesi chat antara pengunjung website dan Suci, diurutkan dari yang paling baru.</p>

            @if ($conversations->isEmpty())
                <p>Belum ada percakapan.</p>
            @else
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Mulai</th>
                            <th>Terakhir Aktif</th>
                            <th>Jumlah Pesan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($conversations as $conversation)
                            <tr>
                                <td>{{ $conversation->created_at->translatedFormat('d M Y, H:i') }}</td>
                                <td>{{ $conversation->updated_at->diffForHumans() }}</td>
                                <td>{{ $conversation->messages_count }}</td>
                                <td>
                                    <a href="{{ route('admin.conversations.show', $conversation) }}" class="btn btn-glass btn-sm">Lihat</a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <div style="margin-top:16px;">
                    {{ $conversations->links() }}
                </div>
            @endif
        </div>
    </div>
@endsection
