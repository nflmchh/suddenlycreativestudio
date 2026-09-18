<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\PasswordController;
use App\Models\Event;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $events = Event::published()->ordered()->with('media')->get();

    return view('landing', compact('events'));
});

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

        Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    });
});
