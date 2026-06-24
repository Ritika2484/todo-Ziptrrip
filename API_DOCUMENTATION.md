# API Documentation

**Base URL:** `http://localhost:3001/api/todos`

All responses are JSON. All success responses include `"success": true`.  
All error responses include `"success": false` and a `"message"` string.

---

## Data Model

```json
{
  "id":          "uuid-v4-string",
  "title":       "string (required)",
  "description": "string (default: \"\")",
  "priority":    "low | medium | high (default: \"medium\")",
  "completed":   false,
  "dueDate":     "ISO 8601 string | null",
  "createdAt":   "ISO 8601 string",
  "updatedAt":   "ISO 8601 string"
}
```

---

## Endpoints

---

### 1. Create a Todo

**`POST /api/todos`**

Creates a new todo. Assigns a UUID, timestamps, and defaults.

#### Request Body

```json
{
  "title":       "Review onboarding docs",
  "description": "Read through the HR welcome pack.",
  "priority":    "high",
  "dueDate":     "2026-07-01T00:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ Yes | Non-empty. Max 200 chars. |
| `description` | string | No | Defaults to `""` |
| `priority` | `low` \| `medium` \| `high` | No | Defaults to `"medium"` |
| `dueDate` | ISO 8601 string \| null | No | Defaults to `null` |

#### Response — `201 Created`

```json
{
  "success": true,
  "data": {
    "id":          "3f2e1d0c-...",
    "title":       "Review onboarding docs",
    "description": "Read through the HR welcome pack.",
    "priority":    "high",
    "completed":   false,
    "dueDate":     "2026-07-01T00:00:00.000Z",
    "createdAt":   "2026-06-24T17:00:00.000Z",
    "updatedAt":   "2026-06-24T17:00:00.000Z"
  }
}
```

#### Error Responses

| Status | Condition |
|---|---|
| `400` | Title missing, priority invalid, dueDate not a valid ISO string |

```json
{
  "success": false,
  "message": "Title is required and must be a non-empty string.",
  "errors":  ["Title is required and must be a non-empty string."]
}
```

---

### 2. Get All Todos

**`GET /api/todos`**

Returns all todos. Supports optional filtering and sorting via query parameters.

#### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Case-insensitive title contains match |
| `status` | `active` \| `completed` | Filter by completion status |
| `priority` | `low` \| `medium` \| `high` | Filter by priority |
| `sortBy` | `createdAt` \| `dueDate` \| `priority` | Sort field |
| `sortDir` | `asc` \| `desc` | Sort direction (default: `asc`) |

#### Example Request

```
GET /api/todos?status=active&priority=high&sortBy=dueDate&sortDir=asc
```

#### Response — `200 OK`

```json
{
  "success": true,
  "count":   2,
  "data": [
    {
      "id":          "seed-001",
      "title":       "Review Ziptrrip onboarding docs",
      "description": "Read through all the onboarding material.",
      "priority":    "high",
      "completed":   false,
      "dueDate":     "2026-06-26T17:00:00.000Z",
      "createdAt":   "2026-06-24T17:00:00.000Z",
      "updatedAt":   "2026-06-24T17:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Todo

**`GET /api/todos/:id`**

Returns a single todo by its UUID.

#### Path Parameters

| Parameter | Description |
|---|---|
| `id` | The UUID of the todo |

#### Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "id":          "seed-003",
    "title":       "Complete the Todo app assignment",
    "description": "Build the full-stack CRUD Todo application.",
    "priority":    "high",
    "completed":   false,
    "dueDate":     "2026-06-29T17:00:00.000Z",
    "createdAt":   "2026-06-24T17:00:00.000Z",
    "updatedAt":   "2026-06-24T17:00:00.000Z"
  }
}
```

#### Error Responses

| Status | Condition |
|---|---|
| `404` | No todo found with the given ID |

```json
{
  "success": false,
  "message": "Todo with id \"abc-123\" not found."
}
```

---

### 4. Update a Todo

**`PUT /api/todos/:id`**

Partially updates a todo. Only provided fields are changed.  
`id` and `createdAt` are immutable and cannot be overwritten.  
`updatedAt` is automatically set to the current timestamp.

#### Path Parameters

| Parameter | Description |
|---|---|
| `id` | The UUID of the todo |

#### Request Body (all fields optional)

```json
{
  "title":       "Updated title",
  "description": "Updated description",
  "priority":    "low",
  "completed":   true,
  "dueDate":     "2026-07-15T00:00:00.000Z"
}
```

#### Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "id":          "seed-003",
    "title":       "Updated title",
    "description": "Updated description",
    "priority":    "low",
    "completed":   true,
    "dueDate":     "2026-07-15T00:00:00.000Z",
    "createdAt":   "2026-06-24T17:00:00.000Z",
    "updatedAt":   "2026-06-24T18:30:00.000Z"
  }
}
```

#### Error Responses

| Status | Condition |
|---|---|
| `400` | Title is empty string, priority is invalid value, dueDate is invalid |
| `404` | No todo found with the given ID |

---

### 5. Delete a Todo

**`DELETE /api/todos/:id`**

Permanently removes a todo from storage.

#### Path Parameters

| Parameter | Description |
|---|---|
| `id` | The UUID of the todo |

#### Response — `200 OK`

```json
{
  "success": true,
  "message": "Todo deleted successfully."
}
```

#### Error Responses

| Status | Condition |
|---|---|
| `404` | No todo found with the given ID |

---

## Health Check

**`GET /health`**

A quick endpoint to verify the server is running.

#### Response — `200 OK`

```json
{
  "status":    "ok",
  "timestamp": "2026-06-24T17:00:00.000Z"
}
```

---

## Error Response Shape

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message.",
  "errors":  ["Optional array of individual validation messages"]
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — validation failed |
| `404` | Not Found — resource does not exist |
| `500` | Internal Server Error — unexpected failure |
