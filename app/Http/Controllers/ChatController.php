<?php

namespace App\Http\Controllers;

use App\Services\ChatAssistant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function send(Request $request, ChatAssistant $assistant)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['nullable', 'array', 'max:24'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:1000'],
        ]);

        try {
            $reply = $assistant->reply($data['message'], $data['history'] ?? []);
        } catch (\Throwable $e) {
            Log::error('Chat assistant failed: '.$e->getMessage());

            return response()->json([
                'reply' => 'Maaf, lagi ada gangguan koneksi di sini. Coba lagi sebentar ya, atau langsung chat WhatsApp kami.',
            ], 200);
        }

        return response()->json(['reply' => $reply]);
    }
}
