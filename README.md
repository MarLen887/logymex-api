# LOGYMEX Ambiental - API Engine ♻️

## Descripción del Proyecto
Este repositorio contiene el núcleo lógico (Backend) del sistema de gestión para **LOGYMEX Ambiental**. La solución está diseñada para automatizar la trazabilidad de residuos peligrosos, el control de la flota vehicular y la generación de bitácoras operativas, cumpliendo con estándares de seguridad y normativas ambientales vigentes.

**Tecnologías principales:**
* **Framework:** NestJS (Node.js) con TypeScript.
* **Base de Datos:** PostgreSQL.
* **ORM:** TypeORM.
* **Seguridad:** Passport.js, JWT (JSON Web Tokens) y Bcrypt para hashing de credenciales.
* **Documentación:** Swagger (OpenAPI).

---

## Requisitos Previos
Antes de iniciar la instalación, asegúrese de tener instalado lo siguiente:
1.  **Node.js** (Versión 18 o superior).
2.  **PostgreSQL** (Versión 14 o superior).
3.  **DBeaver** o cualquier gestor de bases de datos compatible con Postgres.

---

## Guía de Instalación (Paso a Paso)

Siga estas instrucciones detalladas para poner en marcha el servidor en su entorno local:

### 1. Clonar el Repositorio
```bash
git clone [https://github.com/tu-usuario/logymex-api.git](https://github.com/tu-usuario/logymex-api.git)
cd logymex-api

# Instalación de dependencias
npm install

# Configuración del entorno
cp .env.example .env

# Ejecución en modo desarrollo
npm run start:dev

#Acceso a la Documentación (Swagger)
#Una vez que el servidor esté corriendo, puede interactuar con la API y conocer todos los endpoints disponibles ingresando desde su navegador a:
http://localhost:3000/api/docs

#Preparación de la Base de Datos
#Abra su gestor de base de datos (DBeaver).
#Cree una nueva base de datos con el nombre exacto: logymex_db.
#Nota: No es necesario crear las tablas manualmente. Gracias a synchronize: true en TypeORM, NestJS generará el esquema automáticamente al iniciar.

## Estructura del Proyecto
#El proyecto sigue una arquitectura modular basada en **Features** (Módulos):

*   **`src/auth/`**: Gestión de usuarios, roles y autenticación.
*   **`src/waste/`**: Módulo principal para el registro y trazabilidad de residuos.
*   **`src/units/`**: Administración de la flota vehicular.
*   **`src/shared/`**: Componentes reutilizables (guards, interceptores, DTOs comunes).

## Documentación de la API (Swagger)
#Una vez iniciado el servidor, puede acceder a la documentación interactiva de la API en la siguiente URL:

[http://localhost:3000/api](http://localhost:3000/api)

#Aquí podrá probar cada endpoint, ver los modelos de datos y entender los flujos de autenticación.

##Flujo de Trabajo para el Equipo:

#Autenticación: Use el endpoint POST /auth/login con un usuario registrado para obtener su Bearer Token.

#Protección: Las rutas de Residuos, Flota y Bitácoras requieren el token en el encabezado de la petición (Authorization: Bearer <token>).

#Validación: Todos los datos enviados son validados mediante DTOs. Asegúrese de respetar los tipos de datos (number, string) definidos en la documentación.