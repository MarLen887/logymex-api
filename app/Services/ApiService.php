<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ApiService
{
    protected $baseUrl;

    public function __construct()
    {
        // Esto tomará la URL de su archivo .env (API_URL)
        $this->baseUrl = env('API_URL', 'http://127.0.0.1:8000/api');
    }

    public function getUsers()
    {
        return Http::withToken(session('api_token'))->get("{$this->baseUrl}/users");
    }

    public function createUser(array $data)
    {
        return Http::withToken(session('api_token'))->post("{$this->baseUrl}/users", $data);
    }

    public function updateUser(int $id, array $data)
    {
        return Http::withToken(session('api_token'))->put("{$this->baseUrl}/users/{$id}", $data);
    }

    public function deleteUser(int $id)
    {
        return Http::withToken(session('api_token'))->delete("{$this->baseUrl}/users/{$id}");
    }
}