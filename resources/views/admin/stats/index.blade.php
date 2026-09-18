@extends('admin.layout')

@section('title', 'Statistik')

@php
    $maxDaily = max(1, $dailyViews->max('value'));
    $chartW = 760;
    $chartH = 180;
    $gap = 6;
    $barW = ($chartW - $gap * (count($dailyViews) - 1)) / count($dailyViews);
@endphp

@section('content')
    <div class="admin-card">
        <h1>Statistik Kunjungan</h1>
        <p class="hint">Data dihitung sejak fitur ini aktif — kunjungan sebelumnya tidak tercatat.</p>

        <div class="stat-grid">
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($totalViews) }}</span>
                <span class="stat-label">Total Kunjungan</span>
            </div>
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($uniqueVisitors) }}</span>
                <span class="stat-label">Pengunjung Unik</span>
            </div>
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($todayViews) }}</span>
                <span class="stat-label">Hari Ini</span>
            </div>
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($weekViews) }}</span>
                <span class="stat-label">7 Hari Terakhir</span>
            </div>
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($monthViews) }}</span>
                <span class="stat-label">30 Hari Terakhir</span>
            </div>
        </div>

        <h2 style="margin-top:28px;">Kunjungan per Hari (14 Hari Terakhir)</h2>
        <div class="chart-wrap">
            <svg viewBox="0 0 {{ $chartW }} {{ $chartH + 24 }}" class="bar-chart" role="img" aria-label="Grafik kunjungan harian">
                @foreach ($dailyViews as $i => $day)
                    @php
                        $barH = $day['value'] > 0 ? max(3, ($day['value'] / $maxDaily) * $chartH) : 2;
                        $x = $i * ($barW + $gap);
                        $y = $chartH - $barH;
                    @endphp
                    <rect x="{{ $x }}" y="{{ $y }}" width="{{ $barW }}" height="{{ $barH }}" rx="3" fill="var(--y2k-blue)" stroke="var(--y2k-ink)" stroke-width="1.5">
                        <title>{{ $day['label'] }}: {{ $day['value'] }} kunjungan</title>
                    </rect>
                    @if ($i % 2 === 0 || count($dailyViews) <= 10)
                        <text x="{{ $x + $barW / 2 }}" y="{{ $chartH + 16 }}" font-size="9" fill="var(--y2k-ink-muted)" text-anchor="middle">{{ $day['label'] }}</text>
                    @endif
                @endforeach
            </svg>
        </div>
        <details style="margin-top:8px;">
            <summary class="hint" style="cursor:pointer;">Lihat sebagai tabel</summary>
            <table class="admin-table" style="margin-top:8px;">
                <thead><tr><th>Tanggal</th><th>Kunjungan</th></tr></thead>
                <tbody>
                    @foreach ($dailyViews as $day)
                        <tr><td>{{ $day['label'] }}</td><td>{{ $day['value'] }}</td></tr>
                    @endforeach
                </tbody>
            </table>
        </details>
    </div>

    <div class="admin-card">
        <h1>Suci — Chat Assistant</h1>
        <div class="stat-grid">
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($totalConversations) }}</span>
                <span class="stat-label">Total Percakapan</span>
            </div>
            <div class="stat-tile">
                <span class="stat-value">{{ number_format($conversationsToday) }}</span>
                <span class="stat-label">Percakapan Hari Ini</span>
            </div>
        </div>
        <p class="hint">Lihat isi percakapannya di menu <a href="{{ route('admin.conversations.index') }}">Percakapan Suci</a>.</p>
    </div>

    @if ($topPaths->isNotEmpty())
        <div class="admin-card">
            <h1>Halaman Paling Sering Dikunjungi</h1>
            <table class="admin-table">
                <thead>
                    <tr><th>Halaman</th><th>Jumlah Kunjungan</th></tr>
                </thead>
                <tbody>
                    @foreach ($topPaths as $row)
                        <tr>
                            <td>{{ $row->path }}</td>
                            <td>{{ number_format($row->total) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
@endsection
