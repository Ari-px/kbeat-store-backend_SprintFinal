# Backend - KBeat Store

Backend desarrollado con Node.js, Express, MongoDB, Mongoose y JWT.

## Instalación

```bash
cd backend
npm install
```

Crear un archivo `.env` copiando `.env.example`.

```bash
cp .env.example .env
```

## Ejecutar

```bash
npm run dev
```

## Cargar datos de prueba

```bash
npm run seed
```

Usuarios demo:

- Admin: `admin@kbeat.com` / `123456`
- Cliente: `cliente@kbeat.com` / `123456`

## Endpoints principales

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/products`
- POST `/api/products`
- GET `/api/categories`
- POST `/api/categories`
- GET `/api/cart`
- POST `/api/cart/add`
- GET `/api/favorites`
- POST `/api/orders`
