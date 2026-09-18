<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::with('conversation')->orderByDesc('created_at')->paginate(20);

        return view('admin.leads.index', compact('leads'));
    }
}
