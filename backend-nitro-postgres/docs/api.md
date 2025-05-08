# API Documentation

This document provides detailed information about the API endpoints available in this application.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Most endpoints require authentication using a JWT token. To authenticate:

1. Obtain a token by logging in via the `/api/auth/login` endpoint
2. Include the token in the `Authorization` header of your requests:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "Specific error message",
  "data": {} // Optional additional error data
}
```

Common status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., resource already exists)
- `500` - Internal Server Error

## Endpoints

### Authentication

#### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "your_jwt_token"
}
```

#### Get current user

```
GET /api/auth/me
```

Headers:
```
Authorization: Bearer your_jwt_token
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Posts

#### Get all posts

```
GET /api/posts
```

Query parameters:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Number of posts per page

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post content...",
      "userId": 1,
      "published": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "author": {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### Get a post by ID

```
GET /api/posts/:id
```

Path parameters:
- `id` - Post ID

Response:
```json
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content...",
  "userId": 1,
  "published": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "author": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Create a post

```
POST /api/posts
```

Headers:
```
Authorization: Bearer your_jwt_token
```

Request body:
```json
{
  "title": "Post Title",
  "content": "Post content...",
  "published": false
}
```

Response:
```json
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content...",
  "userId": 1,
  "published": false,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update a post

```
PUT /api/posts/:id
```

Headers:
```
Authorization: Bearer your_jwt_token
```

Path parameters:
- `id` - Post ID

Request body:
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "published": true
}
```

Response:
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "userId": 1,
  "published": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Delete a post

```
DELETE /api/posts/:id
```

Headers:
```
Authorization: Bearer your_jwt_token
```

Path parameters:
- `id` - Post ID

Response:
```json
{
  "message": "Post deleted successfully"
}
```

## Pagination

Endpoints that return lists of resources support pagination through the following query parameters:

- `page` - Page number (1-based)
- `limit` - Number of items per page

The response includes a `pagination` object with the following properties:

```json
"pagination": {
  "total": 100,  // Total number of items
  "page": 1,     // Current page
  "limit": 10,   // Items per page
  "pages": 10    // Total number of pages
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for all `/api` routes.

