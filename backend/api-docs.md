# API Endpoints Documentation

## Base URL

`http://localhost:5000`

## User Endpoints

### Register User

- **Method**: POST
- **Path**: `/api/auth/register`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "A",
    "gender": "male",
    "profilePicture": "https://example.com/profile.jpg",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "phoneNumber": "+1234567890",
    "role": "user"
  }
  ```
- **Response**: `{ "message": "Account created successfully." }`

### Login User

- **Method**: POST
- **Path**: `/api/auth/login`
- **Description**: Authenticate user and set session cookie
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `{ "message": "Logged in successfully." }` (cookie set)

### Get Current User

- **Method**: GET
- **Path**: `/api/auth/me`
- **Description**: Retrieve authenticated user's data
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "message": "User fetched successfully",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "middleName": "A",
      "gender": "male",
      "profilePicture": "https://example.com/profile.jpg",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "role": "user",
      "createdAt": "2023-10-01T00:00:00.000Z",
      "updatedAt": "2023-10-01T00:00:00.000Z"
    }
  }
  ```

### Sign Out

- **Method**: POST
- **Path**: `/api/auth/sign-out`
- **Description**: Clear session cookie
- **Response**: `{ "message": "Successfully signed out" }`

## Pet Endpoints

### Create Pet

- **Method**: POST
- **Path**: `/api/pets/`
- **Description**: Create a new pet record
- **Request Body**:
  ```json
  {
    "name": "Buddy",
    "species": "Dog",
    "breed": "Golden Retriever",
    "age": 3,
    "availability: "available",
    "weight": 25.5,
    "owner": "507f1f77bcf86cd799439011"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Pet created successfully.",
    "pet": {
      "_id": "507f191e810c19729de860ea",
      "name": "Buddy",
      "species": "Dog",
      "breed": "Golden Retriever",
      "age": 3,
      "weight": 25.5,
      "owner": "507f1f77bcf86cd799439011"
    }
  }
  ```
