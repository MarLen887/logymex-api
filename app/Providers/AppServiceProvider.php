<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Log;
use App\Policies\LogPolicy;
use Illuminate\Support\Facades\Gate;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Log::class, LogPolicy::class);
    }
}
