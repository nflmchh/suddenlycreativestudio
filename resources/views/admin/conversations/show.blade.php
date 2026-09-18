@extends('admin.layout')

@section('title', 'Detail Percakapan')

@section('content')
    <div class="admin-card">
        <h1>Detail Percakapan</h1>
        <p class="hint">
            Dimulai {{ $conversation->created_at->translatedFormat('d M Y, H:i') }} &middot;
            {{ $conversation->messages->count() }} pesan
        </p>

        <div class="conversation-thread">
            @forelse ($conversation->messages as $message)
                <div class="suci-bubble suci-bubble-{{ $message->role }}" style="align-self:{{ $message->role === 'user' ? 'flex-end' : 'flex-start' }};">
                    {{ $message->content }}
                </div>
            @empty
                <p>Belum ada pesan di percakapan ini.</p>
            @endforelse
        </div>

        <div class="form-actions" style="margin-top:16px;">
            <a href="{{ route('admin.conversations.index') }}" class="btn btn-glass">Kembali</a>
        </div>
    </div>
@endsection
