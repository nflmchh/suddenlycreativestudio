@extends('admin.layout')

@section('title', 'Edit Event')

@section('content')
    <div class="admin-card">
        <div class="window-bar">
            <div class="traffic-lights">
                <span class="red"></span><span class="yellow"></span><span class="green"></span>
            </div>
            <span class="title">Edit Event: {{ $event->title }}</span>
        </div>
        <div class="admin-card-body">
            <form method="POST" action="{{ route('admin.events.update', $event) }}" enctype="multipart/form-data" id="eventForm">
                @csrf
                @method('PUT')
                @include('admin.events._form', ['event' => $event])

                <div class="upload-progress" id="uploadProgress" style="display:none;">
                    <div class="upload-progress-bar" id="uploadProgressBar"></div>
                    <p class="hint" id="uploadProgressLabel">Menyiapkan...</p>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="ph ph-check"></i> Simpan Perubahan
                    </button>
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-glass">Kembali</a>
                </div>
            </form>
        </div>
    </div>
@endsection
