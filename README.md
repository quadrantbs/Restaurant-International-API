[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15564722&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

---

# Restaurant International API Documentation

## Endpoints

### List of Available Endpoints

- **POST /add-user**
- **POST /login**
- **POST /cuisines**
- **POST /categories**
- **GET /cuisines**
- **GET /categories**
- **GET /pub/cuisines**
- **GET /cuisines/:id**
- **PUT /categories/:id**
- **PUT /cuisines/:id**
- **DELETE /cuisines/:id**
- **GET /pub/cuisines/:id**
- **PATCH /cuisines/:id/img-url**

---

### 1. POST /add-user

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <your access token>"
}
```

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

- **201 - Created**

  ```json
  {
    "id": "integer",
    "email": "string"
  }
  ```

- **400 - Bad Request**
  ```json
  {
    "message": "email is required"
  }
  ```
  or
  ```json
  {
    "message": "email must be in email format"
  }
  ```
  or
  ```json
  {
    "message": "email taken"
  }
  ```
  or
  ```json
  {
    "message": "password is required"
  }
  ```

---

### 2. POST /login

**Request:**

**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

- **200 - OK**

  ```json
  {
    "access_token": "string"
  }
  ```

- **400 - Bad Request**

  ```json
  {
    "message": "email is required"
  }
  ```

  or

  ```json
  {
    "message": "password is required"
  }
  ```

- **401 - Unauthorized**
  ```json
  {
    "message": "invalid email or password"
  }
  ```

---

### 3. POST /cuisines

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": "integer",
  "imgUrl": "string",
  "categoryId": "integer",
  "authorId": "integer"
}
```

**Responses:**

- **201 - Created**

  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer"
  }
  ```

- **400 - Bad Request**
  ```json
  {
    "message": "name can't be null"
  }
  ```
  or
  ```json
  {
    "message": "name can't be empty"
  }
  ```
  or
  ```json
  {
    "message": "description can't be null"
  }
  ```
  or
  ```json
  {
    "message": "description can't be empty"
  }
  ```
  or
  ```json
  {
    "message": "price needs to be a number"
  }
  ```
  or
  ```json
  {
    "message": "price at least 0"
  }
  ```
  or
  ```json
  {
    "message": "price can't be null"
  }
  ```
  or
  ```json
  {
    "message": "price can't be empty"
  }
  ```
  or
  ```json
  {
    "message": "imgUrl can't be null"
  }
  ```
  or
  ```json
  {
    "message": "imgUrl can't be empty"
  }
  ```
  or
  ```json
  {
    "message": "imgUrl needs to be an Url"
  }
  ```
  or
  ```json
  {
    "message": "categoryId needs to be a number"
  }
  ```
  or
  ```json
  {
    "message": "categoryId can't be null"
  }
  ```
  or
  ```json
  {
    "message": "categoryId can't be empty"
  }
  ```
  or
  ```json
  {
    "message": "authorId needs to be a number"
  }
  ```
  or
  ```json
  {
    "message": "authorId can't be null"
  }
  ```
  or
  ```json
  {
    "message": "authorId can't be empty"
  }
  ```

---

### 4. POST /categories

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Body:**

```json
{
  "name": "string"
}
```

**Responses:**

- **201 - Created**

  ```json
  {
    "id": "integer",
    "name": "string"
  }
  ```

- **400 - Bad Request**
  ```json
  {
    "message": "name can't be null"
  }
  ```
  or
  ```json
  {
    "message": "name can't be empty"
  }
  ```
  or
  ```json
  {
    "message": "name already exists"
  }
  ```

---

### 5. GET /cuisines

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response (200 - OK):**

```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "integer",
  "imgUrl": "string",
  "categoryId": "integer",
  "authorId": "integer"
}
```

---

### 6. GET /categories

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response (200 - OK):**

```json
{
  "id": "integer",
  "name": "string"
}
```

---

### 7. GET /pub/cuisines

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response (200 - OK):**

```json
{
  "id": "integer",
  "name": "string"
}
```

---

### 8. GET /cuisines/:id

**Request:**

**Params:**

```json
{
  "id": "integer (required)"
}
```

**Response:**

- **200 - OK**

  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer"
  }
  ```

- **404 - Not Found**
  ```json
  {
    "message": "Cuisine with id :id is not found"
  }
  ```

---

### 9. PUT /categories/:id

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Params:**

```json
{
  "id": "integer (required)"
}
```

**Response:**

- **200 - OK**

  ```json
  {
    "id": "integer",
    "name": "string"
  }
  ```

- **404 - Not Found**
  ```json
  {
    "message": "Category with id :id is not found"
  }
  ```

---

### 10. PUT /cuisines/:id

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Params:**

```json
{
  "id": "integer (required)"
}
```

**Response:**

- **200 - OK**

  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer"
  }
  ```

- **404 - Not Found**

  ```json
  {
    "message": "Cuisine with id :id is not found"
  }
  ```

- **400 - Bad Request**

  ```json
  {
    "message": "name can't be null"
  }
  ```

  or

  ```json
  {
    "message": "name can't be empty"
  }
  ```

  or

  ```json
  {
    "message": "description can't be null"
  }
  ```

  or

  ```json
  {
    "message": "description can't be empty"
  }
  ```

  or

  ```json
  {
    "message": "price needs to be a number"
  }
  ```

  or

  ```json
  {
    "message": "price at least 0"
  }
  ```

  or

  ```json
  {
    "message": "price can't be null"
  }
  ```

  or

  ```json
  {
    "message": "price can't be empty"
  }
  ```

  or

  ```json
  {
    "message": "imgUrl can't be null"
  }
  ```

  or

  ```json
  {
    "message": "imgUrl can't be empty"
  }
  ```

  or

  ```json
  {
    "message": "imgUrl needs to be an Url"
  }
  ```

  or

  ```json
  {
    "message": "categoryId needs to be a number"
  }
  ```

  or

  ```json
  {
    "message": "categoryId can't be null"
  }
  ```

  or

  ```json
  {
    "message": "categoryId can't be empty"
  }
  ```

  or

  ```json
  {
    "message": "authorId needs to be a number"
  }
  ```

  or

  ```json
  {
    "message": "authorId can't be null"
  }
  ```

  or

  ```json
  {
    "message": "authorId can't be empty"
  }
  ```

---

### 11. DELETE /cuisines/:id

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Params:**

```json
{
  "id": "integer (required)"
}
```

**Response:**

- **200 - OK**

  ```json
  {
    "message": "Cuisine with id :id deleted"
  }
  ```

- **404 - Not Found**
  ```json
  {
    "message": "Cuisine with id :id is not found"
  }
  ```

---

### 12. GET /pub/cuisines/:id

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Params:**

```json
{
  "id": "integer (required)"
}
```

**Response:**

- **200 - OK**

  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer"
  }
  ```

- **404 - Not Found**
  ```json
  {
    "message": "Cuisine with id :id is not found"
  }
  ```

---

### 13. PATCH /cuisines/:id/img-url

**Request:**

**Headers:**

```json
{
  "Authorization": "Bearer <access_token>",
}
```

**Params:**

```json
{
  "id": "integer (required)"
}
```

**Body:**

```json
{
  "imgUri": "file"
}
```

**Response:**

- **200 - OK**

  ```json
  {
    "message": "Image uploaded successfully"
  }
  ```

- **400 - Bad Request**

  ```json
  {
    "message": "imgUri is required"
  }
  ```

- **404 - Not Found**

  ```json
  {
    "message": "Cuisine with id :id is not found"
  }
  ```

- **401 - Unauthorized**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### Global Error Handling

**Response (500 - Internal Server Error):**

```json
{
  "message": "ISE"
}
```
