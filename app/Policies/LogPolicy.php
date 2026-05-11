<?php
// app/Policies/LogPolicy.php

namespace App\Policies;

use App\Models\Log;
use App\Models\User;

class LogPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // Todos los autenticados ven la lista (filtrada por rol en el controlador)
    }

    public function view(User $user, Log $log): bool
    {
        if ($user->hasFullAccess()) return true;
        return $log->operator_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Log $log): bool
    {
        return $user->hasFullAccess();
    }

    public function delete(User $user, Log $log): bool
    {
        return $user->isDirector();
    }
}