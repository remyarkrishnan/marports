<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPageController;
use App\Http\Controllers\Admin\AdminRegistrationController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\SummitController;
use Illuminate\Support\Facades\Route;

// Public Summit Pages
Route::get('/', [SummitController::class, 'index'])->name('home');
Route::post('/register', [SummitController::class, 'register'])->name('register');

// CMS Authentication
Route::get('/cms/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/cms/login', [AdminAuthController::class, 'login'])->name('admin.login.submit');
Route::post('/cms/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// Aliases for /admin and standard /login
Route::redirect('/admin', '/cms');
Route::redirect('/admin/login', '/cms/login');
Route::get('/login', fn () => redirect()->route('admin.login'))->name('login');

// CMS Protected Routes
Route::middleware('auth')->prefix('cms')->name('admin.')->group(function () {
    // Dashboard Overview
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Registrations Management
    Route::get('/registrations', [AdminRegistrationController::class, 'index'])->name('registrations');
    Route::post('/registrations', [AdminRegistrationController::class, 'store'])->name('registrations.store');
    Route::put('/registrations/{registration}/status', [AdminRegistrationController::class, 'updateStatus'])->name('registrations.status');
    Route::delete('/registrations/{registration}', [AdminRegistrationController::class, 'destroy'])->name('registrations.destroy');
    Route::get('/registrations-export', [AdminRegistrationController::class, 'export'])->name('registrations.export');

    // Website Pages & Studio
    Route::get('/pages', [AdminPageController::class, 'index'])->name('pages');
    Route::put('/pages/{page}', [AdminPageController::class, 'update'])->name('pages.update');
    Route::post('/pages/{page}/toggle-status', [AdminPageController::class, 'toggleStatus'])->name('pages.toggle_status');
    Route::get('/studio/{page}', [AdminPageController::class, 'studio'])->name('pages.studio');
    Route::post('/studio/{page}', [AdminPageController::class, 'saveStudio'])->name('pages.studio.save');

    // System Settings & Profile
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings');
    Route::put('/settings/profile', [AdminSettingController::class, 'updateProfile'])->name('settings.profile');
    Route::put('/settings/password', [AdminSettingController::class, 'updatePassword'])->name('settings.password');
    Route::post('/settings/users', [AdminSettingController::class, 'storeStaffUser'])->name('settings.users.store');
    Route::delete('/settings/users/{user}', [AdminSettingController::class, 'destroyStaffUser'])->name('settings.users.destroy');
    Route::put('/settings/event', [AdminSettingController::class, 'updateEventSettings'])->name('settings.event');
});
