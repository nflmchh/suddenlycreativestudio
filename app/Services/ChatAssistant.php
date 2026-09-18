<?php

namespace App\Services;

use App\Models\Event;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class ChatAssistant
{
    protected const NAME = 'Suci';

    protected const MAX_HISTORY_TURNS = 12;

    public function reply(string $message, array $history = []): string
    {
        $apiKey = config('services.anthropic.key');

        if (! $apiKey) {
            return 'Maaf, fitur chat lagi belum aktif di sisi kami. Boleh langsung hubungi kami lewat WhatsApp ya, biar cepat dibalas.';
        }

        $messages = $this->buildMessages($message, $history);

        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])
            ->timeout(20)
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => config('services.anthropic.model'),
                'max_tokens' => 400,
                'system' => $this->systemPrompt(),
                'messages' => $messages,
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Anthropic API error: '.$response->status().' '.$response->body());
        }

        $text = collect($response->json('content', []))
            ->where('type', 'text')
            ->pluck('text')
            ->implode("\n");

        return trim($text) ?: 'Maaf, boleh diulang pertanyaannya? Tadi jawabannya kepotong.';
    }

    protected function buildMessages(string $message, array $history): array
    {
        $trimmedHistory = array_slice($history, -self::MAX_HISTORY_TURNS * 2);

        $messages = [];

        foreach ($trimmedHistory as $turn) {
            if (! isset($turn['role'], $turn['content'])) {
                continue;
            }
            if (! in_array($turn['role'], ['user', 'assistant'], true)) {
                continue;
            }

            $messages[] = [
                'role' => $turn['role'],
                'content' => (string) $turn['content'],
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];

        return $messages;
    }

    protected function systemPrompt(): string
    {
        $settings = SiteSetting::current();
        $categories = config('portfolio.categories');

        $portfolioTitles = Event::published()
            ->ordered()
            ->limit(8)
            ->pluck('title', 'category');

        $categoryList = collect($categories)
            ->map(fn ($label, $key) => "- {$label}")
            ->implode("\n");

        $exampleWork = $portfolioTitles->isNotEmpty()
            ? $portfolioTitles->map(function ($title, $cat) use ($categories) {
                $categoryLabel = $categories[$cat] ?? $cat;

                return "- {$title} ({$categoryLabel})";
            })->implode("\n")
            : '- (belum ada data event spesifik, jawab secara umum soal kategori layanan saja)';

        $contactLines = collect([
            $settings->phone ? "- WhatsApp: {$settings->phone}" : null,
            $settings->email ? "- Email: {$settings->email}" : null,
            $settings->instagram_username ? "- Instagram: @{$settings->instagram_username}" : null,
            $settings->address ? "- Alamat studio: {$settings->address}" : null,
        ])->filter()->implode("\n");

        return <<<PROMPT
        Kamu adalah "Suci", asisten virtual di website Suddenly Creative Studio (studio kreatif berbasis di Bandung: visual production, 3D animation, motion design, event production, hingga website & apps).

        KEPRIBADIAN:
        - Kamu ramah, hangat, lugas, dan percaya diri — seperti anggota tim asli yang paham betul bisnis ini, bukan chatbot generik.
        - Bicara natural dalam Bahasa Indonesia santai-profesional (boleh sesekali pakai "kak"/"kamu", hindari kaku formal berlebihan).
        - JANGAN PERNAH bilang kamu adalah AI, model bahasa, atau chatbot. Jangan pakai frasa seperti "sebagai asisten AI". Kamu Suci, titik.
        - Jawaban singkat dan padat (idealnya 2-4 kalimat), seperti chat WhatsApp asli — bukan esai panjang.
        - Kalau ditanya hal di luar topik studio/kreatif (politik, hal pribadi random, dsb), arahkan dengan sopan kembali ke topik layanan studio.
        - Kalau tidak tahu jawaban pasti (misal harga detail, jadwal, ketersediaan), jangan mengarang — ajak lanjut ngobrol lewat WhatsApp supaya dibantu tim langsung.

        LAYANAN YANG DITAWARKAN (5 kategori utama):
        {$categoryList}

        CONTOH KARYA YANG PERNAH DIKERJAKAN:
        {$exampleWork}

        INFO KONTAK (kasih ini kalau relevan/klien mau lanjut serius):
        {$contactLines}

        Tujuanmu: bantu calon klien memahami layanan, kasih gambaran singkat yang meyakinkan, dan dorong mereka lanjut ke WhatsApp kalau sudah tertarik atau butuh detail lebih lanjut (harga, jadwal, dsb).
        PROMPT;
    }
}
