# Day 2: Express.js RESTful Todo API

A RESTful API for managing todos built with **Node.js** and **Express.js**. It implements complete CRUD operations, pagination via query parameters, asynchronous file persistence with `fs`, and proper HTTP status codes.

---

## 📌 Features

- **RESTful Endpoints**: Full CRUD support (`GET`, `POST`, `PATCH`, `DELETE`).
- **Pagination**: Filter and paginate results with `limit` and `skip` query parameters.
- **Asynchronous File I/O**: Reads and writes to `data.json` asynchronously using `fs.readFile` and `fs.writeFile`.
- **Auto-incrementing IDs**: Automatically generates the next unique `Id` for new items.
- **Default Status**: Newly created todos default to `"status": "to-do"`.
- **Error Handling**: Proper HTTP response status codes (`200 OK`, `404 Not Found`, `500 Internal Server Error`).

---

## 📂 Project Structure

```text
Day-2-node-express/
├── data.json         # JSON database storing todos
├── package.json      # Dependencies and scripts
├── server.js         # Express server & API route handlers
└── README.md         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Navigate to the project directory:
   ```bash
   cd Day-2-node-express
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

- **Standard Start**:
  ```bash
  npm start
  ```
- **Development Mode (with auto-reload via nodemon)**:
  ```bash
  npx nodemon server.js
  ```

The server will start listening at `http://localhost:5000`.

---

## 🌐 API Reference

**Base URL**: `http://localhost:5000`

### 1. Get All Todos (with Pagination)
- **URL**: `/todos`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` *(optional, default: `10`)* - Number of items to return.
  - `skip` *(optional, default: `0`)* - Number of items to skip.
- **Example Request**:
  ```http
  GET /todos?limit=5&skip=0 HTTP/1.1
  Host: localhost:5000
  ```
- **Response (200 OK)**:
  ```json
  [
    {
      "Id": 1,
      "title": "Study Express.js",
      "status": "to-do"
    }
  ]
  ```

---

### 2. Get Todo by ID
- **URL**: `/todos/:id`
- **Method**: `GET`
- **Example Request**:
  ```http
  GET /todos/1 HTTP/1.1
  Host: localhost:5000
  ```
- **Response (200 OK)**:
  ```json
  {
    "Id": 1,
    "title": "Study Express.js",
    "status": "to-do"
  }
  ```
- **Error Response (404 Not Found)**:
  ```text
  todo not found
  ```

---

### 3. Create a New Todo
- **URL**: `/todos`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Build REST API"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "Id": 2,
    "title": "Build REST API",
    "status": "to-do"
  }
  ```

---

### 4. Update Todo Title by ID
- **URL**: `/todos/:id`
- **Method**: `PATCH`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Build REST API with Express"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "Id": 2,
    "title": "Build REST API with Express",
    "status": "to-do"
  }
  ```
- **Error Response (404 Not Found)**:
  ```text
  todo not found
  ```

---

### 5. Delete Todo by ID
- **URL**: `/todos/:id`
- **Method**: `DELETE`
- **Example Request**:
  ```http
  DELETE /todos/2 HTTP/1.1
  Host: localhost:5000
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "todo deleted",
    "deletedId": 2
  }
  ```
- **Error Response (404 Not Found)**:
  ```text
  todo not found
  ```
