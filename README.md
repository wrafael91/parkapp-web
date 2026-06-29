# ParkApp Web

Frontend de un sistema de gestión de parqueadero. Proyecto de portafolio fullstack orientado a vacantes junior en Colombia y remoto USD.

**Live:** `https://parkapp-web.vercel.app` · **API:** `https://parkapp-api.onrender.com`

> **Demo:** usuario `admin` · contraseña `admin123`

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 21 (standalone components) |
| Lenguaje | TypeScript |
| Estado | Signals (`signal`, `computed`) |
| HTTP | `HttpClient` + interceptor JWT |
| Routing | Lazy loading con `loadComponent` |
| Deploy | Vercel |

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Resumen: espacios libres/ocupados, ingresos del día, últimas entradas |
| `/parking` | Registrar entrada y salida de vehículos |
| `/vehicles` | Listado de vehículos; edición de placa (admin) |
| `/spaces` | Grilla visual de espacios en tiempo real |
| `/history` | Historial de parqueo con filtros por fecha, tipo y placa |
| `/reports` | Reporte de turno: entradas, salidas, recaudo, desglose por tipo |
| `/passes` | Mensualidades: crear y eliminar (admin) |
| `/settings` | Total de espacios y tarifas por tipo (admin) |

---

## Correr localmente

### Requisitos
- Node.js 20+
- Angular CLI 21: `npm install -g @angular/cli`

### Pasos

```bash
# 1. Clonar
git clone https://github.com/wrafael91/parkapp-web.git
cd parkapp-web

# 2. Instalar dependencias
npm install

# 3. Desarrollo (apunta al backend local por defecto)
ng serve
```

La API URL de producción está en `src/environments/environment.prod.ts`. Para desarrollo local, editar `src/environments/environment.ts` con `http://localhost:3000`.

### Build de producción

```bash
ng build --configuration production
# Output: dist/parkapp-web/browser/
```

---

## Decisiones técnicas

**Standalone components (Angular 21):** sin NgModules. Cada componente declara sus propias dependencias en `imports: []`, lo que hace la estructura más legible y el tree-shaking más efectivo.

**Signals sobre RxJS para estado local:** `signal()` y `computed()` son más simples de razonar que Observables para estado de UI sincrónico. RxJS queda para operaciones HTTP via `HttpClient`.

**Lazy loading en todas las rutas:** cada página se carga solo cuando el usuario navega a ella, reduciendo el bundle inicial.

**Interceptor JWT centralizado:** en lugar de agregar el header `Authorization` en cada llamada, un interceptor lo inyecta automáticamente en todos los requests autenticados.

**Guard funcional:** `canActivate: [authGuard]` protege rutas sin necesidad de una clase. Si el token no existe o expiró, redirige a `/login`.

**NavbarComponent compartido:** la barra de navegación es un componente standalone reutilizado en todas las páginas. Incluye menú hamburguesa responsivo para móvil (< 800px).

**`isActive()` computado en frontend:** el campo `active` de mensualidades en la DB es estático; el frontend calcula si una mensualidad está vigente comparando `end_date >= new Date()`.

---

## Estructura del proyecto

```
src/app/
├── components/
│   └── navbar/           # Navbar compartida con hamburger menu
├── pages/
│   ├── login/
│   ├── dashboard/
│   ├── parking/
│   ├── vehicles/
│   ├── spaces/
│   ├── history/
│   ├── reports/
│   ├── passes/
│   └── settings/
├── services/
│   ├── api.service.ts    # Todos los llamados HTTP al backend
│   └── auth.service.ts   # JWT: guardar, leer, limpiar token
├── guards/
│   └── auth.guard.ts     # Protege rutas privadas
├── interceptors/
│   └── auth.interceptor.ts  # Inyecta Bearer token en cada request
└── app.routes.ts
```
