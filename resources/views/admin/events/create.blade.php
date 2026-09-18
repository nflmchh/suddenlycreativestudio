@extends('admin.layout')

@section('title', 'Tambah Event')

@section('content')
    <div class="admin-card">
        <div class="window-bar">
            <div class="traffic-lights">
                <span class="red"></span><span class="yellow"></span><span class="green"></span>
            </div>
            <span class="title">Tambah Event</span>
        </div>
        <div class="admin-card-body">
            <form method="POST" action="{{ route('admin.events.store') }}" enctype="multipart/form-data" id="eventForm">
                @csrf
                @include('admin.events._form', ['event' => null])

                <div class="upload-progress" id="uploadProgress" style="display:none;">
                    <div class="upload-progress-bar" id="uploadProgressBar"></div>
                    <p class="hint" id="uploadProgressLabel">Menyiapkan...</p>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="ph ph-check"></i> Simpan Event
                    </button>
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-glass">Batal</a>
                </div>
            </form>
        </div>
    </div>
@endsection
