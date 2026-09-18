<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\PageView;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index()
    {
        $totalViews = PageView::count();
        $uniqueVisitors = PageView::distinct('session_id')->count('session_id');

        $todayViews = PageView::whereDate('created_at', today())->count();
        $weekViews = PageView::where('created_at', '>=', now()->subDays(7))->count();
        $monthViews = PageView::where('created_at', '>=', now()->subDays(30))->count();

        $totalConversations = ChatConversation::count();
        $conversationsToday = ChatConversation::whereDate('created_at', today())->count();

        // Daily view counts for the last 14 days, filled with zeros for days
        // with no visits so the chart has no gaps.
        $days = collect(range(13, 0))->map(fn ($i) => today()->subDays($i));

        $rawCounts = PageView::selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('created_at', '>=', today()->subDays(13))
            ->groupBy('day')
            ->pluck('total', 'day');

        $dailyViews = $days->map(function (Carbon $day) use ($rawCounts) {
            $key = $day->toDateString();

            return [
                'label' => $day->translatedFormat('d M'),
                'value' => (int) ($rawCounts[$key] ?? 0),
            ];
        });

        $topPaths = PageView::select('path', DB::raw('COUNT(*) as total'))
            ->groupBy('path')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return view('admin.stats.index', compact(
            'totalViews',
            'uniqueVisitors',
            'todayViews',
            'weekViews',
            'monthViews',
            'totalConversations',
            'conversationsToday',
            'dailyViews',
            'topPaths'
        ));
    }
}
