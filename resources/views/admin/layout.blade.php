<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') — Suddenly Creative Studio</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/img/logo-icon.png') }}">
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ @filemtime(public_path('assets/css/style.css')) ?: time() }}">
    <link rel="stylesheet" href="{{ asset('assets/css/admin.css') }}?v={{ @filemtime(public_path('assets/css/admin.css')) ?: time() }}">
</head>
<body class="admin-body">
    <div class="admin-topbar">
        <a href="{{ route('admin.dashboard') }}" class="brand">
            <img src="{{ asset('assets/img/logo-icon.png') }}" alt="">
            Suddenly Admin
        </a>

        <button type="button" class="nav-toggle admin-nav-toggle" id="adminNavToggle" aria-label="Toggle menu">
            <i class="ph ph-list"></i>
        </button>

        <nav class="admin-nav" id="adminNav">
            <a href="{{ route('admin.dashboard') }}">Events</a>
            <a href="{{ route('admin.events.create') }}">Tambah Event</a>
            <a href="{{ route('admin.clients.index') }}">Clients</a>
            <a href="{{ route('admin.leads.index') }}">Leads</a>
            <a href="{{ route('admin.stats.index') }}">Statistik</a>
            <a href="{{ route('admin.conversations.index') }}">Percakapan Yorii</a>
            <a href="{{ route('admin.settings.edit') }}">Kontak</a>
            <a href="{{ route('admin.password.edit') }}">Ganti Password</a>
            <a href="{{ url('/') }}" target="_blank">Lihat Situs</a>
            <button type="button" id="pushToggleBtn" class="btn-glass btn-sm" data-subscribe-url="{{ route('admin.push.subscribe') }}" data-unsubscribe-url="{{ route('admin.push.unsubscribe') }}" data-public-key-url="{{ route('admin.push.public-key') }}">
                <i class="ph ph-bell"></i> Notifikasi
            </button>
            <form method="POST" action="{{ route('admin.logout') }}">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </nav>
    </div>

    <div class="admin-wrap">
        @if (session('status'))
            <div class="admin-status">{{ session('status') }}</div>
        @endif

        <div id="pushStatusBanner" class="admin-status" style="display:none;"></div>

        @if ($errors->any())
            <div class="admin-errors">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </div>

    <script src="{{ asset('assets/js/admin.js') }}?v={{ @filemtime(public_path('assets/js/admin.js')) ?: time() }}"></script>
</body>
</html>
