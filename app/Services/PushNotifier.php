<?php

namespace App\Services;

use App\Models\PushSubscription;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushNotifier
{
    public function notifyAdmins(string $title, string $body, string $url = '/admin'): void
    {
        $publicKey = config('services.webpush.public_key');
        $privateKey = config('services.webpush.private_key');

        if (! $publicKey || ! $privateKey) {
            return;
        }

        $subscriptions = PushSubscription::all();

        if ($subscriptions->isEmpty()) {
            return;
        }

        try {
            $webPush = new WebPush([
                'VAPID' => [
                    'subject' => config('services.webpush.subject'),
                    'publicKey' => $publicKey,
                    'privateKey' => $privateKey,
                ],
            ]);

            $payload = json_encode(['title' => $title, 'body' => $body, 'url' => $url]);

            foreach ($subscriptions as $sub) {
                $webPush->queueNotification(
                    Subscription::create([
                        'endpoint' => $sub->endpoint,
                        'publicKey' => $sub->public_key,
                        'authToken' => $sub->auth_token,
                    ]),
                    $payload
                );
            }

            foreach ($webPush->flush() as $report) {
                if (! $report->isSuccess()) {
                    Log::warning('Push notification failed: '.$report->getReason());

                    if ($report->isSubscriptionExpired()) {
                        PushSubscription::where('endpoint', $report->getEndpoint())->delete();
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::error('PushNotifier failed: '.$e->getMessage());
        }
    }
}
