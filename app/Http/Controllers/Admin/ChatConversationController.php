<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;

class ChatConversationController extends Controller
{
    public function index()
    {
        $conversations = ChatConversation::withCount('messages')
            ->whereHas('messages')
            ->orderByDesc('updated_at')
            ->paginate(20);

        return view('admin.conversations.index', compact('conversations'));
    }

    public function show(ChatConversation $conversation)
    {
        $conversation->load('messages');

        return view('admin.conversations.show', compact('conversation'));
    }
}
