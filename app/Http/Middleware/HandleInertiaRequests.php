<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge(
                    $user->only([
                        'id',
                        'name',
                        'email',
                        'phone',
                        'address',
                        'city',
                        'state',
                        'country',
                        'photo_profile',
                        'email_verified_at',
                        'created_at',
                        'google_id',
                    ]),
                    [
                        'favorite_count' => $user->favorites()->count(),
                        'canAccessDashboard' => $user->can('dashboard'),
                        'isPreferenceStored' => $user->hasPreference(),
                    ]
                ) : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
        ];
    }
}
