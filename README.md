# LOGYMEX API

**Software de Logística — LOGYMEX Ambiental**
**Equipo:** Los Ingenieros de Temu | **Versión:** 1.0 | **Stack:** Laravel 11 + Sanctum

---

## Descripción

API RESTful desarrollada en Laravel 11 para la gestión integral de operaciones logísticas de residuos peligrosos de LOGYMEX Ambiental. Permite registrar bitácoras digitales de traslado, controlar inventario de residuos, gestionar flota vehicular, administrar personal y exportar reportes en PDF y Excel. Compatible con clientes web (Laravel Blade) y móvil (Flutter).

---

## Requisitos

| Herramienta        | Versión mínima |
|--------------------|----------------|
| PHP                | 8.2+           |
| Composer           | 2.x            |
| MySQL              | 8.0+           |
| Laravel            | 11.x           |
| Laravel Sanctum    | 4.x            |
| Laragon (Windows)  | 6.x (recomendado) |

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/los-ingenieros-de-temu/logymex-api.git
cd logymex-api

# 2. Instalar dependencias PHP
composer install

# 3. Copiar y configurar variables de entorno
cp .env.example .env
php artisan key:generate

# 4. Configurar base de datos en .env
#    DB_DATABASE=logymex_db
#    DB_USERNAME=root
#    DB_PASSWORD=

# 5. Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# 6. Crear enlace simbólico de almacenamiento
php artisan storage:link

# 7. Iniciar servidor local (Laragon o artisan serve)
php artisan serve
```

> **Laragon:** Crear la base de datos `logymex_db` desde HeidiSQL o phpMyAdmin antes de migrar.

---

## Variables de Entorno (.env)

```env
APP_NAME="LOGYMEX API"
APP_URL=http://logymex-api.test

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=logymex_db
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=local
```

---

## Roles del Sistema

| Rol               | Código            | Descripción                                            |
|-------------------|-------------------|--------------------------------------------------------|
| Director General  | `director`        | Acceso total. Gestiona documentos oficiales.           |
| Jefe de Logística | `jefe_logistica`  | Acceso total en vistas. Sin gestión de documentos.     |
| Operador          | `operador`        | Crea bitácoras y consulta su propia unidad asignada.   |

---

## Autenticación

El sistema **no usa correo electrónico**. El login se realiza con:

- `telefono` — identificador único del usuario
- `nombre` — nombre del usuario
- `apellidos` — apellidos del usuario
- `password` — contraseña

Se utiliza **Laravel Sanctum** para generación de tokens por dispositivo (Bearer Token).

### Ejemplo de login

```http
POST /api/login
Content-Type: application/json

{
  "telefono": "2221000001",
  "nombre": "Heriberto",
  "apellidos": "Robles Rivera",
  "password": "Director2026!",
  "device_name": "flutter_app"
}
```

Todas las peticiones protegidas requieren el header:

```http
Authorization: Bearer {token}
```

---

## Módulos

| Módulo       | Ruta base          | Descripción                               |
|--------------|--------------------|-------------------------------------------|
| Auth         | `/api/`            | Login, logout, perfil actual              |
| Bitácoras    | `/api/logs`        | Núcleo del sistema. Registros de traslado |
| Inventario   | `/api/inventory`   | Entradas y salidas de residuos            |
| Unidades     | `/api/units`       | Flota vehicular y estatus operativo       |
| Clientes     | `/api/clients`     | Hospitales y clientes frecuentes          |
| Documentos   | `/api/documents`   | Permisos y actas gubernamentales          |
| Personal     | `/api/users`       | CRUD de usuarios del sistema              |
| Reportes     | `/api/reports`     | Exportación PDF y Excel                   |

---

## Endpoints — Resumen Rápido

```
POST   /api/login                              Login público
POST   /api/logout                             Cerrar sesión
GET    /api/me                                 Usuario autenticado

GET    /api/logs                               Listar bitácoras
POST   /api/logs                               Crear bitácora
GET    /api/logs/{id}                          Ver bitácora
PUT    /api/logs/{id}                          Editar bitácora (director/jefe)
DELETE /api/logs/{id}                          Eliminar (solo director)
POST   /api/logs/sync                          Sincronización offline (batch)
POST   /api/logs/{id}/files                    Subir evidencias fotográficas
GET    /api/logs/{id}/files/{fid}/download     Descargar evidencia
DELETE /api/logs/{id}/files/{fid}              Eliminar evidencia

GET    /api/inventory                          Listado inventario
GET    /api/inventory/resumen                  Resumen por clasificación
POST   /api/inventory                          Registrar movimiento
GET    /api/inventory/{id}                     Ver movimiento
PUT    /api/inventory/{id}                     Editar movimiento

GET    /api/units                              Listar unidades
POST   /api/units                              Crear unidad (director/jefe)
PUT    /api/units/{id}                         Editar unidad (director/jefe)
PATCH  /api/units/{id}/estatus                 Cambiar estatus operativo
DELETE /api/units/{id}                         Eliminar unidad (director/jefe)

GET    /api/clients                            Listar clientes
POST   /api/clients                            Crear cliente (director/jefe)
PUT    /api/clients/{id}                       Editar cliente (director/jefe)
DELETE /api/clients/{id}                       Eliminar cliente (director/jefe)

GET    /api/documents                          Listar documentos (director/jefe)
POST   /api/documents                          Subir documento (solo director)
GET    /api/documents/{id}/download            Descargar documento
DELETE /api/documents/{id}                     Eliminar (solo director)

GET    /api/users                              Listar personal (director/jefe)
POST   /api/users                              Alta de personal (director/jefe)
PUT    /api/users/{id}                         Editar usuario (director/jefe)
DELETE /api/users/{id}                         Baja lógica (director/jefe)

GET    /api/reports/dashboard                  Panel estadístico (director/jefe)
GET    /api/reports/logs/export/excel          Exportar bitácoras Excel
GET    /api/reports/logs/export/pdf            Exportar bitácoras PDF
GET    /api/reports/inventory/export/excel     Exportar inventario Excel
```

---

## Estructura del Proyecto

```
logymex-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    ← Controladores REST
│   │   ├── Requests/           ← Validaciones (Form Requests)
│   │   ├── Resources/          ← Transformadores JSON
│   │   └── Middleware/
│   │       └── CheckRole.php   ← Autorización por rol
│   ├── Models/                 ← Modelos Eloquent
│   ├── Policies/               ← Políticas de autorización
│   └── Exports/                ← Exportaciones Excel
├── database/
│   ├── migrations/             ← Esquema de base de datos
│   └── seeders/                ← Datos iniciales
├── resources/views/reports/    ← Plantillas Blade para PDF
└── routes/
    └── api.php                 ← Definición de rutas
```

---

## Comandos Útiles

```bash
# Ver todas las rutas de la API
php artisan route:list --path=api

# Refrescar migraciones y datos de prueba
php artisan migrate:fresh --seed

# Verificar estado de la aplicación
php artisan about
```

---

## Usuarios de Prueba (Seeders)

| Rol               | Teléfono     | Contraseña      |
|-------------------|--------------|-----------------|
| Director General  | 2221000001   | `Director2026!` |
| Jefe de Logística | 2221000002   | `Jefe2026!`     |
| Operador          | 2221000003   | `Op2026!`       |

---

## Paquetes Principales

| Paquete                    | Uso                          |
|----------------------------|------------------------------|
| `laravel/sanctum`          | Autenticación por tokens     |
| `barryvdh/laravel-dompdf`  | Generación de PDF            |
| `maatwebsite/excel`        | Exportación Excel            |

---

## Notas de Cumplimiento Normativo

Las clasificaciones de residuos siguen las normas:
- **NOM-087-ECOL-SSA1-2002** — Residuos Peligrosos Biológico-Infecciosos (RPBI)
- **NOM-052-SEMARNAT-2005** — Residuos Peligrosos (CRETI)

---

*LOGYMEX Ambiental — Los Ingenieros de Temu | Laravel 11 + Sanctum | v1.0*