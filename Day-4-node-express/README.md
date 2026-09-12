# Authentication & Authorization System (Task 4) 🔐

A robust, modular, and secure **Authentication and Role-Based Authorization (RBAC)** REST API built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **JSON Web Tokens (JWT)**.

---

## 📑 Table of Contents

- [Overview](#-overview)
  - [Authentication vs. Authorization](#authentication-vs-authorization)
- [Architecture & Design](#-architecture--design)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Getting Started](#-getting-started)
- [API Endpoints Documentation](#-api-endpoints-documentation)
  - [1. Register User](#1-register-user)
  - [2. Login User](#2-login-user)
  - [3. Get Current User Profile (Protected - Authentication)](#3-get-current-user-profile-protected---authentication)
  - [4. Admin Dashboard (Protected - Role Authorization)](#4-admin-dashboard-protected---role-authorization)
  - [5. 404 Not Found Handling](#5-404-not-found-handling)
- [Middleware Implementation](#-middleware-implementation)
  - [Authentication Middleware (`isAuthn`)](#authentication-middleware-isauthn)
  - [Role Authorization Middleware (`isAuthorized`)](#role-authorization-middleware-isauthorized)
  - [Error Handling & 404 Middlewares](#error-handling--404-middlewares)
- [Testing Guide (Postman / Thunder Client / cURL)](#-testing-guide-postman--thunder-client--curl)
- [Security Best Practices Implemented](#-security-best-practices-implemented)

---

## 🌟 Overview

This project implements a complete authentication and authorization lifecycle:

- **Authentication (`isAuthn`)**: Verifies **who the user is**. It validates incoming JWT tokens sent in the HTTP `Authorization: Bearer <token>` header, decodes user credentials, and attaches them to `req.user`.
- **Authorization (`isAuthorized`)**: Verifies **what the user is permitted to do**. It restricts access to specific endpoints according to the user's role (e.g. `user` vs. `admin`).

### Authentication vs. Authorization

| Feature             | Authentication (`isAuthn`)                    | Authorization (`isAuthorized`)          |
| :------------------ | :-------------------------------------------- | :-------------------------------------- |
| **Question**        | _"Who are you?"_                              | _"Are you allowed to access this?"_     |
| **Mechanism**       | JWT Token verification & signature validation | Role check against `allowedRoles` array |
| **HTTP Failure**    | `401 Unauthorized`                            | `403 Forbidden`                         |
| **Execution Order** | Runs **first** to identify the user           | Runs **second** after authentication    |

---

## 🏛 Architecture & Design

The application follows a clean **Controller-Service-Repository** pattern with dedicated middleware layers:

- **Routes Layer** (`routes/`): Defines URL endpoints and chains middlewares to controllers.
- **Controller Layer** (`controller/`): Handles HTTP requests, extracts parameters/body, and sends formatted HTTP responses.
- **Service Layer** (`services/`): Encapsulates core business logic (hashing passwords, issuing tokens, database transactions).
- **Model Layer** (`models/`): Defines Mongoose data schemas and validation rules.
- **Middleware Layer** (`middlewares/`): Intercepts requests for authentication, role authorization, 404 catching, and error handling.
- **Configuration Layer** (`config/`): Manages environment variables and database connections.

---

## 💻 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/) (v4.19+)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) ODM
- **Password Encryption**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) (Salt rounds: 10)
- **Token Management**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (JWT)
- **Environment Management**: [dotenv](https://www.npmjs.com/package/dotenv)
- **CORS**: [cors](https://www.npmjs.com/package/cors)

---

## 📁 Project Structure

```text
auth-task/
├── config/
│   ├── db.config.js              # MongoDB connection logic
│   └── env.config.js             # Environment variable loader
├── controller/
│   └── auth.controller.js        # Request/Response handlers for Auth
├── middlewares/
│   ├── errorHandler.middleware.js # Centralized error handler
│   ├── isAuthn.js                # JWT verification (Authentication)
│   ├── isAuthorized.js           # Role-based access control (Authorization)
│   └── notFound.middleware.js     # 404 Route handler
├── models/
│   └── user.model.js             # Mongoose User schema (name, email, password, role)
├── routes/
│   └── auth.route.js             # Auth route definitions (/register, /login, /me, /admin)
├── services/
│   └── auth.service.js           # Business logic: hashing, JWT signing, user creation
├── .env                          # Local environment secrets (not committed to VCS)
├── .env.example                  # Template for required environment variables
├── index.js                      # Application entry point & middleware mounting
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

---

## ⚙ Environment Setup

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/auth_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
```

| Variable         | Description                                   | Example                             |
| :--------------- | :-------------------------------------------- | :---------------------------------- |
| `PORT`           | Server listening port                         | `5000`                              |
| `MONGO_URI`      | MongoDB connection URI string                 | `mongodb://localhost:27017/auth-db` |
| `JWT_SECRET`     | Secret key used to sign and verify JWT tokens | `strong_random_secret_string`       |
| `JWT_EXPIRES_IN` | Token validity duration                       | `1d`, `7d`, `24h`                   |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

- **Development Mode (with auto-reload via Nodemon):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

---

## 📡 API Endpoints Documentation

Base URL: `http://localhost:5000/auth`

### 1. Register User

Registers a new user in the database. Hashes the password using `bcryptjs` before persisting.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**

  ```json
  {
    "name": "Mohamed",
    "email": "user@example.com",
    "password": "Password123",
    "role": "user"
  }
  ```

  _(Note: `role` defaults to `"user"` if omitted. Allowed values: `"user"`, `"admin"`)_

- **Success Response (`201 Created`):**

  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "672f...",
      "name": "Mohamed",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2026-09-11T15:00:00.000Z",
      "updatedAt": "2026-09-11T15:00:00.000Z"
    }
  }
  ```

- **Error Response (`400 Bad Request`):**
  ```json
  {
    "message": "Email already exists"
  }
  ```

---

### 2. Login User

Authenticates user credentials, verifies the hashed password, and returns a signed JWT token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**

  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```

- **Success Response (`200 OK`):**

  ```json
  {
    "message": "User login successful",
    "user": {
      "_id": "672f...",
      "name": "Mohamed",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **Error Response (`400 Bad Request`):**
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

---

### 3. Get Current User Profile (Protected - Authentication)

Protected route accessible by **any authenticated user** with a valid JWT token.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Access:** Protected (Requires valid JWT)
- **Headers:**
  - `Authorization: Bearer <your_jwt_token>`

- **Success Response (`200 OK`):**

  ```json
  {
    "message": "Protected route works successfully ✅",
    "user": {
      "id": "672f...",
      "role": "user",
      "iat": 1726066800,
      "exp": 1726153200
    }
  }
  ```

- **Error Responses (`401 Unauthorized`):**
  - _Missing Header:_
    ```json
    { "message": "Access denied. No token provided" }
    ```
  - _Invalid/Tampered/Expired Token:_
    ```json
    { "message": "Invalid or expired token", "error": "jwt expired" }
    ```

---

### 4. Admin Dashboard (Protected - Role Authorization)

Protected route accessible **only by users having the `admin` role**.

- **URL:** `/auth/admin`
- **Method:** `GET`
- **Access:** Protected & Authorized (Requires `isAuthn` + `isAuthorized(["admin"])`)
- **Headers:**
  - `Authorization: Bearer <admin_jwt_token>`

- **Success Response (`200 OK` when accessed by Admin):**

  ```json
  {
    "message": "Admin authorized route works successfully 👑",
    "user": {
      "id": "672f...",
      "role": "admin",
      "iat": 1726066800,
      "exp": 1726153200
    }
  }
  ```

- **Forbidden Response (`403 Forbidden` when accessed by a regular User):**
  ```json
  {
    "message": "Forbidden: insufficient permissions"
  }
  ```

---

### 5. 404 Not Found Handling

Any unmapped route triggers the custom `notFound` middleware.

- **URL:** `/any-undefined-route`
- **Response (`404 Not Found`):**
  ```json
  {
    "message": "Route /any-undefined-route not found"
  }
  ```

---

## 🛡 Middleware Implementation

### Authentication Middleware (`isAuthn`)

Located in [`middlewares/isAuthn.js`](file:///d:/Mean%20Stack/NTI-Lab-Tasks/auth-task/auth-task/middlewares/isAuthn.js):

1. Safely checks if `req.headers.authorization` exists and begins with `"Bearer "`.
2. Extracts the raw token string.
3. Verifies the signature using `jwt.verify(token, JWT_SECRET)`.
4. Attaches the decoded payload (`id`, `role`) to `req.user`.
5. Calls `next()` to proceed to the controller or authorization middleware.

### Role Authorization Middleware (`isAuthorized`)

Located in [`middlewares/isAuthorized.js`](file:///d:/Mean%20Stack/NTI-Lab-Tasks/auth-task/auth-task/middlewares/isAuthorized.js):

- Uses a **Higher-Order Function** accepting an array of permitted roles (e.g. `isAuthorized(["admin"])`).
- Verifies that `req.user` is present (ensuring `isAuthn` executed first).
- Checks whether `allowedRoles.includes(req.user.role)`.
- If valid, invokes `next()`; otherwise, aborts with a `403 Forbidden` status.

### Error Handling & 404 Middlewares

- `notFound.middleware.js`: Intercepts non-existent routes and returns a formatted `404` JSON message.
- `errorHandler.middleware.js`: Express 4-argument error handler `(err, req, res, next)` catching server exceptions with consistent error responses and status codes.
- **Middleware Order in `index.js`:**
  ```javascript
  app.use("/auth", authRouter);
  app.use(notFound); // 1st: Catch undefined routes
  app.use(errorHandler); // 2nd: Centralized error handling
  ```

---

## 🧪 Testing Guide (Postman / Thunder Client / cURL)

### Step 1: Register an Admin User

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"SecretPassword123","role":"admin"}'
```

### Step 2: Register a Regular User

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Regular User","email":"user@test.com","password":"SecretPassword123","role":"user"}'
```

### Step 3: Login as Regular User & Obtain Token

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"SecretPassword123"}'
```

_Copy the returned `token` value._

### Step 4: Access Protected Profile (`/auth/me`)

```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer <PASTE_USER_TOKEN_HERE>"
```

👉 _Result: `200 OK` with user details._

### Step 5: Try Accessing Admin Route with User Token (`/auth/admin`)

```bash
curl -X GET http://localhost:5000/auth/admin \
  -H "Authorization: Bearer <PASTE_USER_TOKEN_HERE>"
```

👉 _Result: `403 Forbidden: insufficient permissions`._

### Step 6: Login as Admin & Access Admin Route

```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"SecretPassword123"}'

# Access Admin route with Admin token
curl -X GET http://localhost:5000/auth/admin \
  -H "Authorization: Bearer <PASTE_ADMIN_TOKEN_HERE>"
```

👉 _Result: `200 OK: Admin authorized route works successfully 👑`._

---

## 🔒 Security Best Practices Implemented

1. **One-Way Password Hashing**: Passwords are never saved in plain text. Stored with **bcrypt** salt rounds (10).
2. **Data Sanitization**: Sensitive password hashes are stripped (`delete user.password`) before returning user objects to the client.
3. **Safe Bearer Token Parsing**: Guarded against null/undefined `Authorization` headers to eliminate server crashes.
4. **Stateless JWT Sessions**: No server session storage required; authentication scale-out ready.
5. **Role-Based Guards**: Authorization checks prevent privilege escalation.
6. **Centralized Error Handling**: Prevents sensitive database stack traces from leaking to client responses in production.
