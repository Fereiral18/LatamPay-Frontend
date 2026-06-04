# Plan de Proyecto — LatamPay

> Billetera digital multi-moneda (LATAM) · Proyecto Final Full Stack — Soy Henry
> Duración: **3 semanas** · Metodología ágil adaptada (2 sprints)

---

## 1. Resumen del proyecto

LatamPay es una billetera digital **simulada** (sin dinero real) enfocada en monedas
latinoamericanas. Permite a cada usuario gestionar múltiples monedas en una única wallet,
comprar/vender y convertir entre monedas con tasas reales, recibir depósitos simulados y
transferir saldo a otras cuentas mediante alias/CBU.

**Stack obligatorio**

| Capa | Tecnología |
| :--- | :--- |
| Backend | Express.js + TypeScript, PostgreSQL, desplegado en Railway |
| Frontend | React + TypeScript (.tsx), Vite, desplegado en Vercel |
| Serverless | Vercel Functions + AWS SES SDK (emails) |
| IA | API de Gemini (`gemini-2.5-flash`) — chatbot asistente |
| Testing | Vitest (lógica crítica) |
| Dev asistido | Antigravity (IDE con IA) |
| Tasas de cambio | ExchangeRate-API (con caching y fallback) |

---

## 2. Equipo y roles

| Integrante | Rol principal | Foco |
| :--- | :--- | :--- |
| Facundo German Rozalez | Backend | API, modelo de datos, lógica de transacciones |
| Maximo Galvez Landers | Frontend | UI, flujo de auth, dashboard |
| Luis Alfredo Fereira Borroso | Frontend + Integraciones | UI, serverless (SES), chatbot Gemini |

> **Nota de balance:** el equipo es backend-light (1 backend, 2 frontend). Recomendación:
> Luis acompaña a Facundo en las integraciones (API de tasas, SES, Gemini) que son
> "backend-ish" pero más acotadas, mientras Maximo lleva el grueso del frontend.

**Ceremonias ágiles**
- **Daily** (15 min, todos los días): ¿qué hice ayer?, ¿qué haré hoy?, ¿qué me bloquea?
- **Sprint Planning** (inicio de cada sprint): objetivos, criterios de aceptación, reparto.
- **Sprint Review** (cierre de sprint): demo del entregable.
- **Retrospective** (cierre de sprint): qué funcionó, qué mejorar.

---

## 3. Línea de tiempo general

```
Semana 1  ──────────────►  SPRINT 1  ──►  DEMO 1
(Fundamentos: DB + auth + despliegues + login/registro)

Semana 2  ──────────────►  SPRINT 2 (parte A)
(Operaciones core + API de tasas + transferencias)

Semana 3  ──────────────►  SPRINT 2 (parte B)  ──►  DEMO FINAL
(Emails SES + chatbot + tests + pulido + despliegue final)
```

> Los **primeros 2 días** son para cerrar decisiones de diseño y modelado (gran parte ya
> está definida: modelo de wallets/balances 1:1, transacciones single-entry append-only,
> ExchangeRate-API con caching). Después de eso, todo es ejecución.

---

## 4. SPRINT 1 — Fundamentos (Semana 1)

**Objetivo:** base sólida desplegada. Al cierre, un usuario puede registrarse, loguearse
y ver un dashboard (aunque esté vacío), con backend y frontend en producción.

### Día 1 — Setup y decisiones
- [ ] Crear repositorio en GitHub con estructura modular: carpetas `backend/` y `frontend/` separadas.
- [ ] Definir convención de commits (ej: Conventional Commits) y estrategia de branches (`main` + ramas por feature).
- [ ] README inicial con secciones placeholder (setup, decisiones de diseño).
- [ ] Cerrar y documentar decisiones de diseño en el README: modelo de datos, transacciones, API de tasas, paleta de colores.
- [ ] Crear cuentas/proyectos: Railway (con PostgreSQL), Vercel, AWS (SES sandbox), Google AI Studio (key Gemini), ExchangeRate-API.

### Día 2 — Modelo de datos PostgreSQL
- [ ] Definir el esquema completo: tablas `currencies`, `users`, `wallets`, `balances`, `transactions`, `exchange_rates`.
- [ ] Aplicar constraints: `NOT NULL`, `UNIQUE` (email, user_id en wallets, alias, cbu, par wallet+moneda), foreign keys, `CHECK` (amount >= 0, type válido).
- [ ] Crear índices relevantes (wallet_id en balances, from/to_wallet en transactions).
- [ ] Elegir herramienta de acceso a datos (Prisma o `pg` con migraciones SQL) y escribir la migración inicial.
- [ ] Cargar datos semilla (seed) de `currencies`: ARS, COP, VES, USD.
- [ ] Verificar la DB desplegada en Railway con el esquema aplicado.

### Día 3 — Backend: autenticación
- [ ] Setup de Express + TypeScript (tsconfig, estructura de carpetas: routes/controllers/services).
- [ ] Endpoint de registro: validación de input, hash de contraseña (bcrypt/argon2), creación de usuario + su wallet (con alias y CBU simulados) en una transacción.
- [ ] Endpoint de login: verificación de credenciales, emisión de JWT.
- [ ] Middleware de protección de rutas (verifica JWT).
- [ ] Endpoint protegido de prueba (`/me`) que devuelve datos del usuario autenticado.
- [ ] Manejo de errores consistente (status codes, mensajes claros, sin filtrar info sensible).

### Día 4 — Frontend: login y registro
- [ ] Setup de React + TypeScript + Vite. Configurar variables de entorno (URL del backend).
- [ ] Definir la paleta de colores como variables CSS/tokens desde el inicio.
- [ ] Páginas de registro y login (.tsx) conectadas al backend.
- [ ] Manejo de sesión: guardar el token, redirigir tras login, logout.
- [ ] Rutas protegidas en el frontend (redirige a login si no hay sesión).
- [ ] Dashboard básico (puede estar vacío) visible tras autenticación.

### Día 5 — Despliegues y cierre
- [ ] Desplegar backend en Railway, conectado a la DB PostgreSQL, accesible públicamente.
- [ ] Desplegar frontend en Vercel, accesible públicamente, conectado al backend.
- [ ] Verificar el flujo end-to-end en producción: registro → login → dashboard.
- [ ] Configurar CORS correctamente entre Vercel y Railway.
- [ ] Cargar todas las variables de entorno (secrets) en Railway y Vercel — nada hardcodeado.

### Día 6 — Buffer + preparación Demo 1
- [ ] Resolver bugs pendientes y deuda del sprint.
- [ ] Verificar que los commits sean descriptivos y el README esté actualizado.
- [ ] Preparar la presentación: problema → decisiones técnicas → demo en vivo → estado.
- [ ] Ensayar la demo (todos deben poder explicar cualquier parte).

### Definición de Done — Sprint 1
> Aplicación desplegada con autenticación funcional. Usuarios pueden registrarse, acceder
> y ver el dashboard. Modelo de datos completo en Railway. Repositorio modular con README.

**Checklist de rúbrica (Demo 1)**
- [x] Repo GitHub modular + README con setup + commits descriptivos
- [x] Modelo PostgreSQL con tablas, constraints, FKs e índices + decisiones justificadas
- [x] Auth funcional (registro, login, logout, rutas protegidas, hash de contraseñas)
- [x] Backend en Railway + frontend en Vercel, ambos públicos y conectados
- [x] Frontend con login/registro + dashboard básico, TypeScript sin errores de compilación

---

## 5. SPRINT 2 — Funcionalidad core (Semanas 2 y 3)

**Objetivo:** todas las funcionalidades obligatorias operativas, con tasas reales, emails,
chatbot y tests, desplegado y accesible públicamente.

### Semana 2 — Operaciones y tasas

#### Día 7-8 — Integración API de tasas + caching
- [ ] Servicio de tasas en el backend que consulta ExchangeRate-API (key en variable de entorno).
- [ ] Definir los tipos TypeScript de la respuesta de la API.
- [ ] Lógica de caching: leer de la tabla `exchange_rates`; si la tasa es reciente (ej. < 12h), usarla; si no, consultar la API y actualizar con `ON CONFLICT ... DO UPDATE`.
- [ ] Fallback: si la API falla, usar la última tasa conocida; error solo si no hay ninguna.
- [ ] Documentar la frecuencia de actualización en el README.
- [ ] Verificar que las monedas usadas (ARS, COP, VES, USD) estén soportadas por la API.

#### Día 9-10 — Operaciones de compra, venta e intercambio
- [ ] Servicio de transacciones con ejecución atómica (`BEGIN`/`COMMIT`).
- [ ] Operación de **intercambio** (exchange): valida saldo, obtiene tasa, baja una moneda y sube otra dentro de la misma wallet, registra la transacción.
- [ ] Operaciones de **compra/venta** (buy/sell) con la misma lógica de balances.
- [ ] Operación de **depósito** simulado (deposit): sube un balance sin origen.
- [ ] Operación de **transferencia** (transfer): busca wallet destino por alias/CBU, mueve saldo entre dos wallets atómicamente.
- [ ] Endpoints REST para cada operación, protegidos con auth.
- [ ] Endpoint de historial de transacciones del usuario.

#### Día 11-12 — Frontend de operaciones
- [ ] UI de dashboard mostrando todos los balances del usuario (uno por moneda).
- [ ] Formularios de compra/venta, intercambio, depósito y transferencia conectados al backend.
- [ ] Vista de historial de transacciones.
- [ ] Manejo de estados de carga y errores (saldo insuficiente, alias inexistente, etc.).
- [ ] Mostrar la tasa aplicada antes de confirmar cada operación.

#### Día 13 — Buffer semana 2
- [ ] Probar todos los flujos end-to-end en producción.
- [ ] Resolver bugs y casos edge (montos cero/negativos, monedas inválidas, saldo justo).

### Semana 3 — Emails, IA, tests y entrega

#### Día 14-15 — Emails con AWS SES
- [ ] Función serverless en Vercel con AWS SES SDK.
- [ ] Disparar email de confirmación tras cada transacción exitosa con todos los detalles (tipo, montos, monedas, tasa, timestamp).
- [ ] En transferencias, enviar a emisor y receptor.
- [ ] Verificar recepción real de los emails (recordar que SES en sandbox solo envía a direcciones verificadas).
- [ ] Manejar el caso de que el email falle sin romper la transacción (el email es posterior al commit).

#### Día 16-17 — Chatbot Gemini + tests Vitest
- [ ] Endpoint de chatbot en el backend que llama a Gemini (key en variable de entorno).
- [ ] System prompt con el contexto de la plataforma (operaciones, monedas, tasas).
- [ ] Defensa anti-prompt-injection: prompt defensivo, delimitación del input como dato, validación de longitud.
- [ ] UI de chat en el frontend (informativo, no ejecuta operaciones).
- [ ] Suite de tests con Vitest — **mínimo 10 tests significativos**: cálculos de balance, validaciones de transacción, conversión de moneda, fallback de tasas.

#### Día 18-19 — Pulido y despliegue final
- [ ] Revisión de código: limpiar `any` de TypeScript, separar responsabilidades, nombres claros.
- [ ] Revisar PRs, organizar branches.
- [ ] Completar el README: instrucciones de setup local, decisiones de diseño justificadas (modelo de wallets/balances, transacciones, caching).
- [ ] Verificar el despliegue completo en producción sin errores.
- [ ] Pasar los datos seed necesarios para la demo (usuarios de prueba con saldo).

#### Día 20-21 — Preparación Demo Final
- [ ] Ensayar la presentación: narrativa problema → solución → demo → impacto.
- [ ] Preparar recursos visuales para público técnico y no técnico.
- [ ] Definir guion de la demo en vivo (registro → operaciones → email → chatbot).
- [ ] Plan B por si falla algo en vivo (capturas/video de respaldo).
- [ ] Todos deben poder responder preguntas sobre cualquier parte del proyecto.

### Definición de Done — Sprint 2
> Aplicación con todas las funcionalidades obligatorias operativas, desplegada y accesible
> públicamente.

**Checklist de rúbrica (Demo Final)**
- [x] Funcionalidad core: 3+ monedas, compra/venta e intercambio con tasas reales
- [x] Integración API de tasas + caching documentado + fallback con última tasa conocida
- [x] Emails de confirmación con AWS SES por cada transacción, con todos los detalles
- [x] Chatbot Gemini con system prompt apropiado + validaciones anti-injection
- [x] 10+ tests Vitest significativos que pasan, sobre lógica crítica
- [x] Despliegue completo funcional (Railway + Vercel) sin errores en producción
- [x] Código organizado, TypeScript correcto, decisiones documentadas en README

---

## 6. Reparto de trabajo sugerido

| Área | Responsable principal | Apoyo |
| :--- | :--- | :--- |
| Modelo de datos + migraciones | Facundo | — |
| Auth (backend) | Facundo | Luis |
| Operaciones / transacciones | Facundo | Luis |
| Integración API de tasas | Luis | Facundo |
| Serverless + AWS SES | Luis | — |
| Chatbot Gemini | Luis | Maximo |
| Tests Vitest | Facundo | Luis |
| Frontend auth + dashboard | Maximo | — |
| Frontend operaciones + historial | Maximo | Luis |
| UI/UX + paleta + estilos | Maximo | — |
| Despliegues (Railway/Vercel) | Facundo | Maximo |
| README + documentación | Todos | — |

---

## 7. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| AWS SES en sandbox solo envía a emails verificados | Demo de emails falla | Verificar las direcciones de prueba con anticipación; tenerlo listo desde el día 14 |
| API de tasas no cubre alguna moneda LATAM | Operaciones rotas | Verificar soporte real de monedas el día 7 con una llamada de prueba |
| Equipo backend-light (1 persona) | Cuello de botella | Luis toma integraciones; priorizar lo obligatorio sobre lo adicional |
| Bugs de consistencia en transacciones | Saldos corruptos | Atomicidad con `BEGIN`/`COMMIT` + `CHECK (amount >= 0)` + tests |
| Demo en vivo falla | Mala nota en presentación | Video/capturas de respaldo; usuarios seed con saldo precargado |
| Subir secrets al repo por error | Seguridad | Variables de entorno desde el día 1; `.gitignore` con `.env` |

---

## 8. Funcionalidades: obligatorias vs. adicionales

**Obligatorias (prioridad absoluta — sin esto no se aprueba):**
- Gestión multi-moneda (mínimo 3)
- Compra y venta de monedas con tasas reales
- Intercambio entre monedas
- Emails de confirmación con AWS SES
- Chatbot con Gemini
- Tests con Vitest
- Despliegue funcional

**Adicionales (solo si sobra tiempo, nunca antes de lo obligatorio):**
- Depósitos simulados y transferencias entre cuentas (alias/CBU)
- Historial de pagos / análisis de movimientos
- Notificaciones push
- Crear presupuesto

> Regla de oro: **las personalizaciones son adicionales a la funcionalidad central, jamás
> en lugar de ella.** Si el tiempo aprieta, se recortan los adicionales primero.

---

## 9. Convenciones del equipo

- **Commits:** descriptivos, en presente (`add login endpoint`, `fix balance calc`).
- **Branches:** una rama por feature, PR a `main` revisado por al menos otro integrante.
- **TypeScript:** evitar `any`; tipar respuestas de API y modelos de datos.
- **Secrets:** siempre en variables de entorno, nunca en el código ni en el repo.
- **Definición de Done por tarea:** código + test (si aplica) + funciona en producción + mergeado.