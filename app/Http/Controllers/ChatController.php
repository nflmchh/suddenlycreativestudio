<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\Lead;
use App\Services\ChatAssistant;
use App\Services\PushNotifier;
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

        $offerHandoff = false;

        try {
            $result = $assistant->reply($data['message'], $data['history'] ?? []);
            $reply = $result['text'];
            $offerHandoff = $result['offer_handoff'];
        } catch (\Throwable $e) {
            Log::error('Chat assistant failed: '.$e->getMessage());
            $reply = 'Maaf, lagi ada gangguan koneksi di sini. Coba lagi sebentar ya, atau langsung chat WhatsApp kami.';
        }

        $conversation->messages()->create(['role' => 'assistant', 'content' => $reply]);
        $conversation->touch();

        return response()->json(['reply' => $reply, 'offer_handoff' => $offerHandoff]);
    }

    public function lead(Request $request, PushNotifier $notifier)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'whatsapp' => ['required', 'string', 'max:50'],
        ]);

        $conversation = ChatConversation::forSession($request->session()->getId());

        $lead = Lead::create([
            'chat_conversation_id' => $conversation->id,
            'name' => $data['name'],
            'whatsapp' => $data['whatsapp'],
        ]);

        $notifier->notifyAdmins(
            'Lead baru dari Yorii 🎉',
            "{$lead->name} — {$lead->whatsapp} minta disambungkan ke tim.",
            route('admin.leads.index')
        );

        return response()->json(['ok' => true]);
    }
}
