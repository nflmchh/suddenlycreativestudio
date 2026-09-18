@extends('admin.layout')

@section('title', 'Leads')

@section('content')
    <div class="admin-card">
        <h1>Leads dari Suci</h1>
        <p class="hint">Pengunjung yang minta disambungkan ke tim internal lewat chat Suci. Kalau notifikasi aktif, kamu dapat notif tiap ada yang baru masuk.</p>

        @if ($leads->isEmpty())
            <p>Belum ada lead masuk.</p>
        @else
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>WhatsApp</th>
                        <th>Waktu</th>
                        <th>Percakapan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($leads as $lead)
                        <tr>
                            <td>{{ $lead->name }}</td>
                            <td>
                                <a href="{{ $lead->whatsappLink() }}" target="_blank" rel="noopener" class="link">
                                    <i class="ph ph-whatsapp-logo"></i> {{ $lead->whatsapp }}
                                </a>
                            </td>
                            <td>{{ $lead->created_at->translatedFormat('d M Y, H:i') }}</td>
                            <td>
                                @if ($lead->conversation)
                                    <a href="{{ route('admin.conversations.show', $lead->conversation) }}" class="btn btn-glass btn-sm">Lihat Chat</a>
                                @else
                                    —
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <div style="margin-top:16px;">
                {{ $leads->links() }}
            </div>
        @endif
    </div>
@endsection
