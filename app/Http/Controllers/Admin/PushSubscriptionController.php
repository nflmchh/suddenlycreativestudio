<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function publicKey()
    {
        return response()->json(['publicKey' => config('services.webpush.public_key')]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string'],
            'keys.p256dh' => ['required', 'string'],
            'keys.auth' => ['required', 'string'],
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint' => $data['endpoint']],
            [
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
            ]
        );

        return response()->json(['ok' => true]);
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'endpoint' => ['required', 'string'],
        ]);

        PushSubscription::where('endpoint', $data['endpoint'])->delete();

        return response()->json(['ok' => true]);
    }
}
