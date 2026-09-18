<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
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

        $conversation = ChatConversation::forSession($request->session()->getId());
        $conversation->messages()->create(['role' => 'user', 'content' => $data['message']]);

        try {
            $reply = $assistant->reply($data['message'], $data['history'] ?? []);
        } catch (\Throwable $e) {
            Log::error('Chat assistant failed: '.$e->getMessage());
            $reply = 'Maaf, lagi ada gangguan koneksi di sini. Coba lagi sebentar ya, atau langsung chat WhatsApp kami.';
        }

        $conversation->messages()->create(['role' => 'assistant', 'content' => $reply]);
        $conversation->touch();

        return response()->json(['reply' => $reply]);
    }
}
