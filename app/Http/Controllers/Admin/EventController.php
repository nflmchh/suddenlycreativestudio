<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventMedia;
use App\Services\ImageWatermarker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::withCount('media')->ordered()->get();

        return view('admin.events.index', compact('events'));
    }

    public function create()
    {
        $categories = config('portfolio.categories');

        return view('admin.events.create', compact('categories'));
    }

    public function store(Request $request, ImageWatermarker $watermarker)
    {
        $data = $this->validateEvent($request);

        $event = Event::create([
            'title' => $data['title'],
            'category' => $data['category'],
            'client' => $data['client'] ?? null,
            'demo_url' => $data['demo_url'] ?? null,
            'description' => $data['description'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_published' => $request->boolean('is_published'),
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store("events/{$event->id}/cover", 'public');
            $watermarker->apply(Storage::disk('public')->path($path));
            $event->update(['cover_image' => $path]);
        }

        $this->storeImages($request, $event, $watermarker);
        $this->storeVideos($request, $event);

        if ($request->expectsJson()) {
            return response()->json(['redirect' => route('admin.dashboard')]);
        }

        return redirect()->route('admin.dashboard')->with('status', 'Event berhasil dibuat.');
    }

    public function edit(Event $event)
    {
        $categories = config('portfolio.categories');
        $event->load('media');

        return view('admin.events.edit', compact('event', 'categories'));
    }

    public function update(Request $request, Event $event, ImageWatermarker $watermarker)
    {
        $data = $this->validateEvent($request);

        $event->update([
            'title' => $data['title'],
            'category' => $data['category'],
            'client' => $data['client'] ?? null,
            'demo_url' => $data['demo_url'] ?? null,
            'description' => $data['description'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_published' => $request->boolean('is_published'),
        ]);

        if ($request->hasFile('cover_image')) {
            if ($event->cover_image) {
                Storage::disk('public')->delete($event->cover_image);
            }
            $path = $request->file('cover_image')->store("events/{$event->id}/cover", 'public');
            $watermarker->apply(Storage::disk('public')->path($path));
            $event->update(['cover_image' => $path]);
        }

        $this->storeImages($request, $event, $watermarker);
        $this->storeVideos($request, $event);

        if ($request->expectsJson()) {
            return response()->json(['redirect' => route('admin.events.edit', $event)]);
        }

        return redirect()->route('admin.events.edit', $event)->with('status', 'Event berhasil diperbarui.');
    }

    public function destroy(Event $event)
    {
        foreach ($event->media as $media) {
            $this->deleteMediaFiles($media);
        }

        if ($event->cover_image) {
            Storage::disk('public')->delete($event->cover_image);
        }

        $event->delete();

        return redirect()->route('admin.dashboard')->with('status', 'Event dihapus.');
    }

    public function destroyMedia(EventMedia $media)
    {
        $event = $media->event;
        $this->deleteMediaFiles($media);
        $media->delete();

        return redirect()->route('admin.events.edit', $event)->with('status', 'Media dihapus.');
    }

    public function regeneratePoster(Request $request, EventMedia $media)
    {
        abort_unless($media->isVideo(), 422);

        if ($request->hasFile('poster_image')) {
            $request->validate([
                'poster_image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:8192'],
            ]);
            $path = $request->file('poster_image')->store("events/{$media->event_id}/posters", 'public');
        } else {
            $request->validate([
                'poster' => ['required', 'string', 'starts_with:data:image'],
            ]);
            $path = $this->savePosterFromDataUrl($request->input('poster'), $media->event_id);
        }

        if (! $path) {
            return response()->json(['message' => 'Gagal memproses thumbnail. Coba lagi.'], 422);
        }

        if ($media->poster_path) {
            Storage::disk('public')->delete($media->poster_path);
        }

        $media->update(['poster_path' => $path]);

        return response()->json(['poster_url' => asset('storage/'.$path)]);
    }

    protected function validateEvent(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(array_keys(config('portfolio.categories')))],
            'client' => ['nullable', 'string', 'max:255'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'cover_image' => ['nullable', 'mimes:jpg,jpeg,png', 'max:8192'],
            'images.*' => ['nullable', 'mimes:jpg,jpeg,png', 'max:8192'],
            'videos.*' => ['nullable', 'mimetypes:video/mp4,video/quicktime,video/webm', 'max:61440'],
        ]);
    }

    protected function storeImages(Request $request, Event $event, ImageWatermarker $watermarker): void
    {
        $nextOrder = $event->media()->max('sort_order') + 1;

        foreach ($request->file('images', []) as $file) {
            $path = $file->store("events/{$event->id}/images", 'public');
            $watermarker->apply(Storage::disk('public')->path($path));

            $event->media()->create([
                'type' => 'image',
                'file_path' => $path,
                'original_filename' => $file->getClientOriginalName(),
                'sort_order' => $nextOrder++,
            ]);
        }
    }

    protected function storeVideos(Request $request, Event $event): void
    {
        $nextOrder = $event->media()->max('sort_order') + 1;
        $posters = $request->input('video_posters', []);

        foreach ($request->file('videos', []) as $i => $file) {
            $path = $file->store("events/{$event->id}/videos", 'public');

            $posterPath = null;
            if (! empty($posters[$i]) && Str::startsWith($posters[$i], 'data:image')) {
                $posterPath = $this->savePosterFromDataUrl($posters[$i], $event->id);
            }

            $event->media()->create([
                'type' => 'video',
                'file_path' => $path,
                'original_filename' => $file->getClientOriginalName(),
                'poster_path' => $posterPath,
                'sort_order' => $nextOrder++,
            ]);
        }
    }

    protected function savePosterFromDataUrl(string $dataUrl, int $eventId): ?string
    {
        if (! preg_match('/^data:image\/(\w+);base64,(.+)$/', $dataUrl, $matches)) {
            return null;
        }

        $extension = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
        $binary = base64_decode($matches[2]);

        if ($binary === false) {
            return null;
        }

        $path = "events/{$eventId}/posters/".Str::random(20).'.'.$extension;
        Storage::disk('public')->put($path, $binary);

        return $path;
    }

    protected function deleteMediaFiles(EventMedia $media): void
    {
        Storage::disk('public')->delete($media->file_path);

        if ($media->poster_path) {
            Storage::disk('public')->delete($media->poster_path);
        }
    }
}
