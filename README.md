# Salud Sin Barreras — Telemedicina

Salud Sin Barreras es una aplicación web para telemedicina: gestión de pacientes, doctores, expedientes clínicos, autenticación de usuarios, búsqueda, generación de PDF de recetas/expedientes y un panel (dashboard) para administrar contenido clínico.

Tecnologías principales: Angular (frontend), TypeScript, RxJS, Node/npm, PHP (backend), MySQL (Base de datos), jsPDF + html2canvas (exportar PDF).

---

## Requisitos

- Node.js 18+ (se recomienda 18/20)
- npm (incluido con Node)
- Angular CLI (opcional: `npm i -g @angular/cli`)
- PHP 7.4+ (se recomienda PHP 8.x)
- MySQL 5.7+ o MariaDB (se recomienda MySQL 8+)
- XAMPP / Apache + MySQL (recomendado para desarrollo en Windows)

Dependencias (frontend / dev):

- `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router` — ^21.2.0
- `@angular/cli` — ^21.2.7 (dev)
- `typescript` — ~5.9.2 (dev)
- `rxjs` — ~7.8.0
- Opcionales: `jspdf`, `html2canvas` (para exportar PDF desde la vista cliente)

Backend (PHP):

- No requiere paquetes Composer por defecto.
- Extensiones PHP recomendadas: `mysqli`, `mbstring`, `json`.

---

## Instalación y ejecución

1. Clonar el repositorio y entrar en la carpeta del proyecto:

```bash
git clone https://github.com/Kodakuxa/Salud-Sin-Barreras.git
cd "Salud sin barreras Telemedicina"
```

2. Configurar el backend (Windows / XAMPP)

PowerShell (ejemplo):

```powershell
# Copiar los archivos PHP al htdocs de XAMPP
Copy-Item -Path .\backend\* -Destination "C:\xampp\htdocs\salud_sin_barreras" -Recurse -Force

# Importar la base de datos (si tienes mysql en PATH)
mysql -u root -p < .\backend\db.sql

# Edita `backend/conexion.php` y ajusta usuario/clave/host/DB si es necesario
# Inicia Apache y MySQL desde el panel de XAMPP
```

Si prefieres phpMyAdmin: abre `http://localhost/phpmyadmin` y usa la opción Import para subir `backend/db.sql`.

3. Configurar y ejecutar el frontend

PowerShell:

```powershell
cd frontend
npm install
# para desarrollo
npm start -- --port 4200
```

o (alternativa con Angular CLI):

```bash
ng serve --port 4200
```

4. Acceder a la app

- Frontend: `http://localhost:4200` (o el puerto que configures)
- Backend API (ejemplos): `http://localhost/salud_sin_barreras/pacientes.php`, `doctores.php`, `expedientes.php`, `login.php`.

---

## Scripts y comandos útiles

- `npm start` — inicia el servidor de desarrollo Angular (`ng serve`).
- `npm run build` — construye la app para producción.
- `npm test` — ejecuta tests (si están configurados).
- Copiar backend a XAMPP (PowerShell): `Copy-Item -Path .\backend\* -Destination "C:\xampp\htdocs\salud_sin_barreras" -Recurse -Force`.
- Import DB: `mysql -u root -p < backend/db.sql` o usar phpMyAdmin.

---

## Estructura

```
.
├─ package.json
├─ backend/
│  ├─ conexion.php
│  ├─ db.sql
│  ├─ doctores.php
│  ├─ expedientes.php
│  ├─ login.php
│  ├─ pacientes.php
│  ├─ register.php
│  └─ usuario.php
├─ frontend/
│  ├─ package.json
│  ├─ angular.json
│  ├─ src/
│  │  ├─ index.html
│  │  ├─ main.ts
│  │  └─ app/
│  │     ├─ app.component.ts
│  │     ├─ app.routes.ts
│  │     └─ components/
│  │        ├─ dashboard/
│  │        ├─ login/
│  │        ├─ patients/
│  │        ├─ patient-register/
│  │        ├─ patients-list/
│  │        ├─ doctors/
│  │        └─ medical-records/
│  └─ public/ (assets)
└─ README.md
```

Descripción breve de las carpetas principales:

- `backend/`: endpoints PHP que exponen la API (productos, pacientes, doctores, expedientes, autenticación). Edita `conexion.php` para ajustar credenciales.
- `frontend/`: aplicación Angular (UI). Código fuente en `frontend/src/app` con componentes y rutas.
- `frontend/public` / `frontend/assets`: imágenes y recursos públicos.
- `backend/db.sql`: esquema y semillas demo para poblar la base de datos.

---

## Rutas y comportamiento (frontend)

- `/login` — pantalla de inicio de sesión (`LoginComponent`).
- `/dashboard` — área privada (protegida por `AuthGuard`) con subrutas:
  - `/dashboard/patients/register` — registrar paciente (`PatientRegisterComponent`).
  - `/dashboard/patients/list` — lista de pacientes (solo lectura) (`PatientsListComponent`).
  - `/dashboard/patients/data` — editar / eliminar pacientes (`PatientsComponent`).
  - `/dashboard/doctors` — listado de doctores (`DoctorsComponent`).
  - `/dashboard/medical-records/:id` — historial / expediente por paciente (`MedicalRecordsComponent`).

- `/` — redirige a `/login` por defecto.

## Endpoints (backend)

- `backend/pacientes.php` — CRUD y seed para pacientes.
- `backend/doctores.php` — listar / seed doctores.
- `backend/expedientes.php` — obtener/crear/actualizar expedientes clínicos.
- `backend/login.php` — autenticación.
- `backend/register.php` — registro de usuarios.
- `backend/usuario.php` — consulta de datos del usuario autenticado.

---

## Capturas y recursos

- Logos y activos: `frontend/assets/logo.jpg` y `frontend/public/logo.jpg`.
- Si quieres añadir capturas de pantalla al README, sube las imágenes en `frontend/public` y referencia la ruta en este archivo.

---

## Notas finales

- El proyecto viene con semillas para pacientes, doctores y expedientes (si se detecta falta de datos). Revisa `backend/db.sql` y los scripts PHP si necesitas personalizar los datos iniciales.
- Si vas a desplegar en producción: no uses `root` sin contraseña en la base de datos, protege `conexion.php` y configura CORS/SSL según correspondan.

---

Si quieres, puedo:

- Añadir capturas de pantalla al README usando las imágenes del repositorio.
- Ajustar instrucciones para Linux/macOS.
- Crear un archivo `requirements-frontend.txt` o `package-lock.json` con dependencias exactas.
"# tareas-practicas-Kodakuxa" 
