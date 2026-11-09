# dztech-store-api

**Student name:** _your name here_

## Description
Backend REST API for the LUMA SPACE e-commerce store built in TD-TP 2 (React + Redux).
It stores products and users in MongoDB, offers registration/login with JWT, protects
product management endpoints (JWT or OAuth 2.0 access token) and limits request rates.

## Technologies
Node.js, Express.js, MongoDB (Atlas / Community), Mongoose, bcryptjs, jsonwebtoken,
jose (OAuth 2.0 / OIDC token verification via JWKS), express-rate-limit, cors, dotenv.

## Project structure
```
src/
  config/db.js            MongoDB connection
  models/                 Product.js, User.js
  controllers/            authController.js, productController.js
  routes/                 auth.js, products.js
  middleware/             auth.js (JWT/OAuth), rateLimiters.js, errorHandler.js
  seed.js                 sample products
  server.js
```

## Database models
**Product:** `name`, `description`, `price`, `category`, `imageUrl`, `stock` (+ optional `badge`, timestamps).
Serialized with `id` instead of `_id` so the React cart (`item.id`) keeps working.

**User:** `name`, `email` (unique), `passwordHash` (bcrypt). The hash is never returned.

## API endpoints
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | /api/auth/register | Register a user | Public |
| POST | /api/auth/login | Login, returns JWT | Public (5 req / 15 min) |
| GET | /api/products | List products | Public |
| GET | /api/products/:id | One product | Public |
| POST | /api/products | Create product | JWT required |
| PUT | /api/products/:id | Update product | JWT required |
| DELETE | /api/products/:id | Delete product | JWT required |

Status codes: 200, 201, 400, 401, 404, 409, 429, 500. Errors always look like `{ "message": "..." }`.

## JWT authentication
1. `POST /api/auth/login` verifies email + password (bcrypt compare).
2. On success the server signs a JWT (HS256, payload `id` and `email`, expires in `JWT_EXPIRES_IN`) with `JWT_SECRET`.
3. The client sends `Authorization: Bearer <JWT_TOKEN>` on protected requests.
4. `middleware/auth.js` extracts and verifies the token: valid → request continues, otherwise → `401`.

## OAuth 2.0
If `OAUTH_ISSUER` and `OAUTH_JWKS_URI` are set, the same middleware also accepts an OAuth 2.0 / OIDC
access token (JWT) from the provider (Auth0, Google...). The signature is verified against the provider's
JWKS, plus issuer and optional audience. Test it in Postman/Thunder Client with
Authorization type **OAuth 2.0** (Authorization Code + PKCE) and send the access token as `Bearer`.

## Rate limiting
- All `/api` routes: 100 requests / 15 minutes / IP
- `POST /api/auth/login`: 5 requests / 15 minutes / IP
- Exceeding the limit returns `429 Too Many Requests`.

## Installation and run
```bash
git clone <repo-url>
cd dztech-store-api
npm install
cp .env.example .env     # then edit .env
npm run seed             # optional: insert sample products
npm run dev              # or: npm start
```

## MongoDB and environment variables
- **Atlas:** create a free cluster, a database user, allow your IP (Network Access), copy the connection string
  and add the database name, e.g. `mongodb+srv://USER:PASS@cluster.mongodb.net/dztech-store`.
- **Local:** `mongodb://127.0.0.1:27017/dztech-store`.

| Variable | Description |
|---|---|
| PORT | Server port (default 3000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Long random secret (e.g. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| JWT_EXPIRES_IN | Token lifetime (default 1h) |
| CLIENT_ORIGIN | React dev origin for CORS (default http://localhost:5173) |
| OAUTH_ISSUER / OAUTH_JWKS_URI / OAUTH_AUDIENCE | Optional OAuth 2.0 settings |

The real `.env` is excluded by `.gitignore`; only `.env.example` is committed.
