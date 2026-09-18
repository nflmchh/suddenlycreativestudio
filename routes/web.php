<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\PasswordController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\ChatController;
use App\Models\Client;
use App\Models\Event;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $events = Event::published()->ordered()->with('media')->get();
    $clients = Client::ordered()->get();
    $settings = SiteSetting::current();

    return view('landing', compact('events', 'clients', 'settings'));
});

Route::post('/chat', [ChatController::class, 'send'])->middleware('throttle:20,1')->name('chat.send');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

        Route::get('/', [EventController::class, 'index'])->name('dashboard');
        Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
        Route::post('/events', [EventController::class, 'store'])->name('events.store');
        Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
        Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
        Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
        Route::delete('/media/{media}', [EventController::class, 'destroyMedia'])->name('media.destroy');
        Route::post('/media/{media}/poster', [EventController::class, 'regeneratePoster'])->name('media.poster');

        Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
        Route::put('/clients/{client}', [ClientController::class, 'update'])->name('clients.update');
        Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

        Route::get('/settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('/settings', [SiteSettingController::class, 'update'])->name('settings.update');

        Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    });
});
