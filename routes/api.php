<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\ReportController;

// ─── Prefijo: /api ────────────────────────────────────────────────────────

// ── Públicas (sin autenticación) ──────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);

// ── Protegidas con Sanctum ────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // ── BITÁCORAS (todos los roles autenticados) ──────────────────
    Route::get('/logs',              [LogController::class, 'index']);
    Route::post('/logs',             [LogController::class, 'store']);
    Route::get('/logs/{log}',        [LogController::class, 'show']);
    Route::post('/logs/sync',        [LogController::class, 'syncOffline']); // Offline sync
    // Solo director/jefe editan; solo director elimina (se valida dentro del controlador)
    Route::put('/logs/{log}',        [LogController::class, 'update']);
    Route::delete('/logs/{log}',     [LogController::class, 'destroy']);

    // ── EVIDENCIAS vinculadas a bitácoras ─────────────────────────
    Route::post('/logs/{log}/files',                            [FileController::class, 'store']);
    Route::get('/logs/{log}/files/{file}/download',             [FileController::class, 'download']);
    Route::delete('/logs/{log}/files/{file}',                   [FileController::class, 'destroy']);

    // ── INVENTARIO ────────────────────────────────────────────────
    Route::get('/inventory',          [InventoryController::class, 'index']);
    Route::get('/inventory/resumen',  [InventoryController::class, 'resumen']);
    Route::post('/inventory',         [InventoryController::class, 'store']);
    Route::get('/inventory/{inventoryItem}',    [InventoryController::class, 'show']);
    Route::put('/inventory/{inventoryItem}',    [InventoryController::class, 'update']);

    // ── UNIDADES (flota vehicular) ────────────────────────────────
    Route::get('/units',                        [UnitController::class, 'index']);
    Route::get('/units/{unit}',                 [UnitController::class, 'show']);
    // Solo director/jefe pueden modificar unidades
    Route::middleware('role:director,jefe_logistica')->group(function () {
        Route::post('/units',                   [UnitController::class, 'store']);
        Route::put('/units/{unit}',             [UnitController::class, 'update']);
        Route::patch('/units/{unit}/estatus',   [UnitController::class, 'updateEstatus']);
        Route::delete('/units/{unit}',          [UnitController::class, 'destroy']);
    });

    // ── CLIENTES ──────────────────────────────────────────────────
    Route::get('/clients',           [ClientController::class, 'index']);
    Route::get('/clients/{client}',  [ClientController::class, 'show']);
    Route::middleware('role:director,jefe_logistica')->group(function () {
        Route::post('/clients',          [ClientController::class, 'store']);
        Route::put('/clients/{client}',  [ClientController::class, 'update']);
        Route::delete('/clients/{client}', [ClientController::class, 'destroy']);
    });

    // ── DOCUMENTOS OFICIALES ──────────────────────────────────────
    Route::middleware('role:director,jefe_logistica')->group(function () {
        Route::get('/documents',             [DocumentController::class, 'index']);
        Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    });
    // Solo director sube y elimina (validado también dentro del controlador)
    Route::middleware('role:director')->group(function () {
        Route::post('/documents',            [DocumentController::class, 'store']);
        Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    });

    // ── USUARIOS / PERSONAL ───────────────────────────────────────
    Route::middleware('role:director,jefe_logistica')->group(function () {
        Route::get('/users',          [UserController::class, 'index']);
        Route::get('/users/{user}',   [UserController::class, 'show']);
        Route::post('/users',         [UserController::class, 'store']);
        Route::put('/users/{user}',   [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // ── REPORTES (solo directivos) ────────────────────────────────
    Route::middleware('role:director,jefe_logistica')->group(function () {
        Route::get('/reports/dashboard',              [ReportController::class, 'dashboard']);
        Route::get('/reports/logs/export/excel',      [ReportController::class, 'exportLogsExcel']);
        Route::get('/reports/logs/export/pdf',        [ReportController::class, 'exportLogsPdf']);
        Route::get('/reports/inventory/export/excel', [ReportController::class, 'exportInventoryExcel']);
    });

});

