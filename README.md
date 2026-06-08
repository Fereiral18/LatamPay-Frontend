# LatamPay 💸

> Billetera digital multi-moneda para administrar finanzas desde cualquier parte de LATAM, con compra, venta e intercambio de divisas latinoamericanas.

**LatamPay** permite a los usuarios gestionar saldos en múltiples monedas (Argentina, Colombia y Venezuela), comprar y vender divisas aplicando tasas de cambio reales, e intercambiar entre monedas dentro de la misma cuenta. Incluye confirmación por email tras cada operación y un chatbot asistente con IA.

> ⚠️ **Todas las transacciones son simuladas. No se usa dinero real. Los balances son ficticios.**

---

## 📑 Tabla de contenidos

- [Características](#-características)
- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos](#-requisitos)
- [Instalación y setup local](#-instalación-y-setup-local)
- [Variables de entorno](#-variables-de-entorno)
- [Arquitectura](#-arquitectura)
- [Modelo de datos](#-modelo-de-datos)
- [Decisiones de diseño](#-decisiones-de-diseño)
- [Deploy](#-deploy)
- [Testing](#-testing)
- [Equipo](#-equipo)

---

## ✨ Características

- **Gestión multi-moneda**: saldos independientes en ARS (Argentina), COP (Colombia) y VES (Venezuela).
- **Compra / venta de monedas**: aplicando tasas de cambio reales obtenidas de una API externa.
- **Intercambio entre monedas**: conversión de una divisa a otra dentro de la misma cuenta.
- **Autenticación**: registro, login, logout y rutas protegidas con JWT.
- **Emails de confirmación**: cada transacción exitosa dispara un email vía AWS SES.
- **Chatbot asistente**: consultas sobre la plataforma usando Gemini (`gemini-2.5-flash`).

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Backend** | Express.js + TypeScript |
| **Base de datos** | PostgreSQL (Railway) |
| **Frontend** | React + TypeScript (`.tsx`) + Vite |
| **Serverless** | Vercel Functions + AWS SES SDK (emails) |
| **IA** | Google Gemini API (`gemini-2.5-flash`) |
| **Tasas de cambio** | ExchangeRate-API |
| **Testing** | Vitest |
| **Deploy** | Railway (backend + DB) · Vercel (frontend + functions) |

---

## 📋 Requisitos

Para levantar el proyecto localmente necesitás:

- **Node.js** `>= 18.x` (declarado en `engines` del backend)
- **npm** `>= 9.x` (el equipo usa npm — hay `package-lock.json` en ambos repos)
- **PostgreSQL** `>= 14` corriendo localmente, o una instancia de Railway
- Una **cuenta de Railway** (backend + base de datos)
- Una **cuenta de Vercel** (frontend + funciones serverless)
- Credenciales de **AWS** con permisos de **SES** (verificar el remitente/dominio en SES)
- Una **API key de ExchangeRate-API** ([exchangerate-api.com](https://www.exchangerate-api.com/))
- Una **API key de Google Gemini** ([Google AI Studio](https://aistudio.google.com/))

---

## 🚀 Instalación y setup local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO_GITHUB>
cd LatamPay
```

> El repo está dividido en dos carpetas hermanas: `LatamPay-Backend/` y `LatamPay-Frontend/`.

### 2. Backend

```bash
cd LatamPay-Backend
npm install

# Copiar el archivo de ejemplo de variables de entorno y completarlo
cp .env.example .env

# Aplicar el esquema y los datos semilla en la base de datos
# (no hay un script npm; se ejecutan los SQL directamente con psql)
psql "$DATABASE_URL" -f sql/schema.sql
psql "$DATABASE_URL" -f sql/seed.sql

# Levantar el servidor en modo desarrollo (ts-node-dev con --respawn)
npm run dev
```

El backend quedará disponible en `http://localhost:3000` (puerto por defecto definido en `src/config/index.ts`; se puede sobrescribir con la variable `PORT`).

### 3. Frontend

```bash
cd ../LatamPay-Frontend
npm install

# Copiar el archivo de ejemplo de variables de entorno y completarlo
cp .env.example .env

# Levantar el frontend en modo desarrollo
npm run dev
```

El frontend quedará disponible en `http://localhost:5173` (puerto por defecto de Vite).

### 4. Funciones serverless (emails)

Las funciones de envío de email se ejecutan en Vercel y viven en un **repositorio aparte** (separado del frontend y del backend). Para probarlas localmente, clonar ese repo y desde ahí:

```bash
npm install -g vercel
npm install
vercel dev
```

---

## 🔐 Variables de entorno

### Backend (`backend/.env`)

```env
# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173      # usado para CORS

# Base de datos PostgreSQL (Railway)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Autenticación
JWT_SECRET=tu_string_secreto_de_al_menos_32_caracteres   # el backend valida con Zod un mínimo de 32 chars
JWT_EXPIRES_IN=1d

# Tasas de cambio
EXCHANGERATE_API_KEY=tu_api_key_de_exchangerate_api

# Chatbot (Gemini)
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
```

### Frontend (`frontend/.env`)

```env
# URL pública del backend (en local apunta a localhost)
VITE_API_URL=http://localhost:3000
```

> En Vite, **solo las variables con prefijo `VITE_`** quedan expuestas al cliente. Nunca pongas claves secretas en el frontend.

### Funciones serverless / AWS SES (Vercel)

```env
AWS_ACCESS_KEY_ID=tu_access_key_id_de_iam
AWS_SECRET_ACCESS_KEY=tu_secret_access_key_de_iam
AWS_REGION=us-east-1                      # región donde está configurado SES
SES_FROM_EMAIL=latampaypf@gmail.com       # dirección verificada en SES (sandbox: el destinatario también debe estarlo)
```

> ⚠️ Nunca commitees archivos `.env`. Asegurate de que estén en `.gitignore` y mantené un `.env.example` con las claves vacías como referencia.

---

## 🏗 Arquitectura

LatamPay está organizado como un **monorepo** con backend y frontend separados:

```
latampay/
├── backend/                 # API REST — Express + TypeScript
│   ├── src/
│   │   ├── routes/          # Definición de endpoints
│   │   ├── controllers/     # Reciben request / devuelven response
│   │   ├── services/        # Lógica de negocio (transacciones, tasas, etc.)
│   │   ├── repositories/    # Acceso a datos (PostgreSQL)
│   │   ├── middlewares/     # Auth (JWT), validaciones, manejo de errores
│   │   ├── config/          # Conexión a DB, variables, clientes externos
│   │   └── index.ts         # Punto de entrada
│   ├── tests/               # Tests con Vitest
│   └── .env.example
│
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/           # Login, Registro, Dashboard, etc.
│   │   ├── components/      # Componentes reutilizables
│   │   ├── services/        # Llamadas al backend (axios/fetch)
│   │   ├── context/         # Estado global (auth, etc.)
│   │   └── main.tsx
│   └── .env.example
│
├── serverless/              # Repo aparte — Vercel Functions (emails con AWS SES)
│   └── api/
│
└── README.md
```

### Capas del backend (principios SOLID)

El backend sigue una arquitectura por capas para mantener responsabilidades separadas, facilitar el testing y permitir escalabilidad:

1. **Routes** → definen las rutas HTTP y las conectan a un controller.
2. **Controllers** → orquestan el request/response, delegan la lógica a los services.
3. **Services** → contienen la lógica de negocio (cálculo de balances, conversión de monedas, validaciones). Es la capa que más se testea.
4. **Repositories** → único punto de acceso a la base de datos. Aíslan PostgreSQL del resto de la app.

Esta separación respeta el **Single Responsibility Principle** (cada capa tiene una única razón para cambiar) y el **Dependency Inversion Principle** (los services dependen de abstracciones de repositorio, no de detalles de la base), lo que hace el código más testeable y escalable.

### Integración de tasas de cambio (con caching)

Las tasas se obtienen de **ExchangeRate-API**. Como las tasas fiat se actualizan a diario (no en tiempo real), se cachean del lado del backend para no gastar el cupo gratuito de requests y mejorar la latencia.

- **Estrategia de cache**: persistencia en la tabla `exchange_rates` de PostgreSQL con TTL de **12 horas**. Antes de pegarle a la API se consulta la tabla; si la última actualización es más reciente que el TTL, se devuelve ese valor; si no, se llama a la API y se hace `INSERT ... ON CONFLICT (from_currency, to_currency) DO UPDATE`.
- **Fallback ante error**: si la API falla, se usa la última tasa conocida cacheada en `exchange_rates`. Solo se devuelve error al cliente si tampoco existe una tasa previa en la tabla.

### Emails (AWS SES)

El envío de emails se hace mediante una **Vercel Function** que usa el **AWS SES SDK**. Cada transacción exitosa dispara un email de confirmación con: tipo de operación, montos, monedas y timestamp.

### Chatbot (Gemini)

El chatbot consulta la API de Gemini (`gemini-2.5-flash`) **a través de un endpoint del backend** que protege la API key. Recibe un *system prompt* con el contexto de la plataforma y es **solo informativo** (no ejecuta operaciones que muevan fondos). Incluye mitigaciones básicas contra *prompt injection*.

---

## 🗄 Modelo de datos

El modelo relacional en PostgreSQL se compone de cinco tablas:

```
USERS ||--|| WALLETS        (1:1) cada usuario tiene una wallet
WALLETS ||--o{ BALANCES     (1:N) una wallet agrupa un balance por moneda
WALLETS ||--o{ TRANSACTIONS (1:N) una wallet registra sus transacciones
CURRENCIES ||--o{ BALANCES  cada balance está denominado en una moneda
CURRENCIES ||--o{ TRANSACTIONS
```

| Tabla | Campos principales |
| :--- | :--- |
| **users** | `id` (PK, UUID), `email` (UNIQUE), `password_hash`, `name`, `role` (`user`/`admin`), `created_at` |
| **wallets** | `id` (PK, UUID), `user_id` (FK → users, UNIQUE), `cbu` (UNIQUE), `alias` (UNIQUE), `created_at` |
| **currencies** | `code` (PK, ej. ARS/COP/VES), `name`, `type` (`fiat`/`crypto`), `decimals` |
| **balances** | `id` (PK, UUID), `wallet_id` (FK), `currency_code` (FK), `amount` (NUMERIC(19,8), CHECK ≥ 0) |
| **transactions** | `id` (PK, UUID), `type` (`deposit`/`withdraw`/`transfer`/`swap`), `status`, `from_wallet_id`, `to_wallet_id`, `from_currency`, `to_currency`, `from_amount`, `to_amount`, `exchange_rate`, `created_at` |
| **exchange_rates** | `id` (PK), `from_currency` (FK), `to_currency` (FK), `rate`, `created_at`, `updated_at` — UNIQUE (`from_currency`, `to_currency`) |

**Constraints e índices relevantes:**

- `users.email` → `UNIQUE`
- `balances` → `UNIQUE (wallet_id, currency_code)` (un único saldo por moneda por wallet)
- Todas las FK con `NOT NULL` donde corresponda
- Índices sugeridos: `balances(wallet_id)`, `transactions(wallet_id, created_at)` para consultas de historial

> **Notas adicionales:** `password_hash` se guarda como `bcrypt` (`bcryptjs` con cost 10 — visible en los seeds como `$2b$10$...`). El código `VES` corresponde al **Bolívar Soberano** (ISO 4217), la moneda vigente de Venezuela. Los IDs son `UUID` generados desde la app.

---

## 🧠 Decisiones de diseño

### Modelo de wallets / balances

Optamos por un modelo donde cada usuario tiene una **única wallet (relación 1:1)**, y esa wallet agrupa **múltiples balances, uno por cada moneda (relación 1:N)**. Cada balance es una fila independiente en la tabla `balances`, identificada por la combinación única de wallet y moneda.

Elegimos representar cada moneda como una **fila** (en lugar de columnas fijas) por dos razones:

1. **Normalización**: evitamos una tabla con columnas dispersas y mantenemos un único lugar donde vive el saldo de cada moneda.
2. **Escalabilidad**: agregar una moneda nueva no requiere modificar el esquema (`ALTER TABLE`), solo insertar una fila. El modelo soporta N monedas sin cambios estructurales.

Descartamos el modelo de múltiples wallets por usuario porque ninguna funcionalidad del proyecto lo requiere: el intercambio entre monedas ocurre dentro de la misma wallet, moviendo valor entre filas de balances.

### Sistema de transacciones

Usamos un modelo **single-entry**: una única tabla `transactions` donde cada fila describe un movimiento completo (wallet, monedas y montos de cada lado, tasa aplicada y timestamp). Los balances se actualizan directamente dentro de la **misma transacción de base de datos**.

Evaluamos *double-entry bookkeeping* (estándar de la industria por su auditabilidad), pero lo descartamos para este proyecto porque su implementación con multi-moneda agrega complejidad significativa que excede el alcance de tres semanas, sin beneficio proporcional para un sistema simulado.

Garantizamos consistencia con dos decisiones:

- **Append-only**: las transacciones nunca se modifican ni borran; una corrección genera una transacción compensatoria.
- **Atomicidad**: la actualización de balances y el registro de la transacción suceden juntos dentro de una transacción de DB (o no suceden).

### API de tasas de cambio

Usamos **ExchangeRate-API** porque soporta las monedas latinoamericanas de la plataforma (ARS, COP, VES), a diferencia de APIs basadas en el Banco Central Europeo (como Frankfurter) que solo cubren algunas monedas de la región. Su plan gratuito (1500 requests/mes, actualización diaria) es suficiente, ya que las tasas fiat no requieren actualización en tiempo real.

---

## ☁️ Deploy

### Backend + Base de datos → Railway

1. Crear un proyecto en [Railway](https://railway.app/) y agregar un servicio **PostgreSQL**.
2. Conectar el repositorio de GitHub y seleccionar el directorio `LatamPay-Backend/`.
3. Configurar las **variables de entorno** (ver sección anterior). Railway provee `DATABASE_URL` automáticamente al vincular la base.
4. Aplicar el esquema y los datos semilla la primera vez, conectándose a la DB de Railway con `psql`:
   ```bash
   psql "$DATABASE_URL" -f sql/schema.sql
   psql "$DATABASE_URL" -f sql/seed.sql
   ```
5. URL pública del backend: _pendiente — completar tras el primer deploy en Railway_.

### Frontend + Funciones serverless → Vercel

1. Importar el repositorio del frontend en [Vercel](https://vercel.com/) y seleccionar `LatamPay-Frontend/`.
2. Framework preset: **Vite**.
3. Configurar las variables de entorno del frontend (`VITE_API_URL` apuntando al backend de Railway).
4. Importar **por separado** el repo de las Vercel Functions y configurar ahí las credenciales de AWS SES.
5. URL pública del frontend: _pendiente — completar tras el primer deploy en Vercel_.

> Asegurate de que el `FRONTEND_URL` del backend (CORS) coincida con la URL de Vercel en producción.

---

## 🧪 Testing

Los tests están escritos con **Vitest** y cubren la lógica crítica del negocio: cálculos de balance, validaciones de transacciones y conversiones de moneda.

```bash
cd LatamPay-Backend
npm test              # modo watch (vitest por defecto)
npm run test:run      # corre la suite completa una sola vez (útil en CI)
```

---

## 👥 Equipo

**LatamPay** — equipo consultor.
📧 latampaypf@gmail.com

| Nombre | Rol |
| :--- | :--- |
| Galvez Landers, Maximo | Frontend |
| Rozalez, Facundo German | Backend |
| Fereira Borroso, Luis Alfredo | Frontend |

> **Misión:** La constancia y el compromiso son la base sobre la que construimos LatamPay. No esperamos que las necesidades surjan; innovamos para resolverlas antes de que se conviertan en problemas.

---

<!-- [COMPLETAR: licencia, capturas de pantalla, link al video de la demo, etc. — opcional] -->