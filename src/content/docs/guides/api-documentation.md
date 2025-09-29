---
title: API Documentation
description: API documentation for Paideia LMS
---


# API Documentation

This comprehensive guide documents the RESTful API endpoints for Paideia LMS, including authentication, user management, course operations, and administrative functions.

## 📋 API Overview

Paideia LMS provides a RESTful API built on top of **Elysia.js** with automatic **OpenAPI/Swagger** documentation generation.

### Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

### Authentication
All API endpoints require authentication via JWT tokens in cookies:
```http
Cookie: payload-token=your-jwt-token-here
```

### Response Format
All API responses follow a consistent format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

## 🔐 Authentication Endpoints

### Login
Authenticate a user and receive a JWT token.

**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    },
    "token": "jwt-token-here",
    "exp": 1234567890
  },
  "message": "Login successful"
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `429` - Too many login attempts

### Logout
Invalidate the current user session.

**Endpoint:** `POST /api/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Current User
Get information about the currently authenticated user.

**Endpoint:** `GET /api/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 👥 User Management

### List Users
Retrieve a paginated list of users with optional filtering.

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search in name and email
- `role` (string): Filter by role (`admin`, `instructor`, `student`)
- `sort` (string): Sort field (e.g., `createdAt`, `firstName`)
- `order` (string): Sort order (`asc`, `desc`)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "admin",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Get User by ID
Retrieve detailed information about a specific user.

**Endpoint:** `GET /api/users/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "bio": "User biography",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create User
Create a new user account.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "student",
  "bio": "Student biography",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-user-id",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

### Update User
Update user information.

**Endpoint:** `PATCH /api/users/{id}`

**Request Body:** (partial update supported)
```json
{
  "firstName": "Updated Name",
  "bio": "Updated biography",
  "role": "instructor"
}
```

### Delete User
Delete a user account.

**Endpoint:** `DELETE /api/users/{id}`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 📚 Course Management

### List Courses
Retrieve a paginated list of courses.

**Endpoint:** `GET /api/courses`

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Search in title and description
- `instructor`: Filter by instructor ID
- `difficulty`: Filter by difficulty level
- `status`: Filter by status (`draft`, `published`, `archived`)
- `sort`, `order`: Sorting options

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course-id",
        "title": "Introduction to React",
        "description": "Learn React fundamentals",
        "instructor": {
          "id": "instructor-id",
          "firstName": "John",
          "lastName": "Doe"
        },
        "difficulty": "beginner",
        "duration": 120,
        "status": "published",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Get Course by ID
Retrieve detailed course information.

**Endpoint:** `GET /api/courses/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course-id",
    "title": "Introduction to React",
    "description": "Comprehensive React course",
    "instructor": { /* instructor object */ },
    "difficulty": "beginner",
    "duration": 120,
    "status": "published",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "tags": ["react", "javascript", "frontend"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Course
Create a new course.

**Endpoint:** `POST /api/courses`

**Request Body:**
```json
{
  "title": "Advanced TypeScript",
  "description": "Master TypeScript features",
  "difficulty": "advanced",
  "duration": 180,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "tags": ["typescript", "advanced", "programming"]
}
```

**Response:** Course object with generated ID and timestamps.

### Update Course
Update course information.

**Endpoint:** `PATCH /api/courses/{id}`

**Request Body:** Partial course data.

### Delete Course
Delete a course.

**Endpoint:** `DELETE /api/courses/{id}`

### Publish/Unpublish Course
Change course publication status.

**Endpoint:** `PATCH /api/courses/{id}/status`

**Request Body:**
```json
{
  "status": "published"
}
```

## 📝 Lesson Management

### List Lessons
Get all lessons for a specific course.

**Endpoint:** `GET /api/courses/{courseId}/lessons`

**Response:**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": "lesson-id",
        "title": "React Components",
        "content": "Lesson content...",
        "courseId": "course-id",
        "orderIndex": 1,
        "type": "text",
        "duration": 30,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Create Lesson
Add a new lesson to a course.

**Endpoint:** `POST /api/courses/{courseId}/lessons`

**Request Body:**
```json
{
  "title": "React Hooks",
  "content": "Learn about useState and useEffect",
  "orderIndex": 2,
  "type": "text",
  "duration": 45
}
```

### Update Lesson
Modify lesson information.

**Endpoint:** `PATCH /api/lessons/{id}`

### Delete Lesson
Remove a lesson from a course.

**Endpoint:** `DELETE /api/lessons/{id}`

### Reorder Lessons
Change the order of lessons in a course.

**Endpoint:** `PATCH /api/courses/{courseId}/lessons/order`

**Request Body:**
```json
{
  "lessonOrder": [
    "lesson-id-1",
    "lesson-id-2",
    "lesson-id-3"
  ]
}
```

## 📋 Enrollment Management

### Enroll User in Course
Enroll a student in a course.

**Endpoint:** `POST /api/enrollments`

**Request Body:**
```json
{
  "userId": "student-id",
  "courseId": "course-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "enrollment-id",
    "userId": "student-id",
    "courseId": "course-id",
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "completedAt": null,
    "progress": 0
  }
}
```

### Get User Enrollments
Retrieve all courses a user is enrolled in.

**Endpoint:** `GET /api/users/{userId}/enrollments`

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "enrollment-id",
        "course": {
          "id": "course-id",
          "title": "React Course",
          "instructor": { /* instructor info */ }
        },
        "progress": 75,
        "enrolledAt": "2024-01-01T00:00:00.000Z",
        "completedAt": null
      }
    ]
  }
}
```

### Update Enrollment Progress
Update a user's progress in a course.

**Endpoint:** `PATCH /api/enrollments/{id}/progress`

**Request Body:**
```json
{
  "progress": 85,
  "completedAt": "2024-01-15T10:30:00.000Z"
}
```

### Unenroll User
Remove a user from a course.

**Endpoint:** `DELETE /api/enrollments/{id}`

## 📊 Analytics and Reporting

### Course Analytics
Get analytics data for a specific course.

**Endpoint:** `GET /api/courses/{courseId}/analytics`

**Response:**
```json
{
  "success": true,
  "data": {
    "courseId": "course-id",
    "totalEnrollments": 150,
    "completedEnrollments": 45,
    "averageProgress": 67.5,
    "enrollmentTrends": [
      { "date": "2024-01-01", "count": 5 },
      { "date": "2024-01-02", "count": 8 }
    ],
    "topPerformers": [
      { "userId": "user-1", "progress": 100, "completedAt": "2024-01-10T..." }
    ]
  }
}
```

### System Analytics
Get overall system statistics.

**Endpoint:** `GET /api/analytics/system`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalCourses": 45,
    "totalEnrollments": 3200,
    "activeUsers": 890,
    "completionRate": 68.5,
    "userGrowth": [
      { "month": "2024-01", "users": 1200 },
      { "month": "2024-02", "users": 1250 }
    ]
  }
}
```

## 📁 File Management

### Upload File
Upload a file to the system.

**Endpoint:** `POST /api/files/upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
```form-data
file: [file object]
courseId: [optional course ID for association]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file-id",
    "filename": "document.pdf",
    "url": "https://storage.example.com/files/document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### List Files
Get a list of uploaded files.

**Endpoint:** `GET /api/files`

**Query Parameters:**
- `page`, `limit`: Pagination
- `courseId`: Filter by course
- `type`: Filter by file type

### Download File
Download a file by ID.

**Endpoint:** `GET /api/files/{id}/download`

**Response:** File content with appropriate headers.

### Delete File
Delete a file from storage.

**Endpoint:** `DELETE /api/files/{id}`

## 🔧 Administrative Endpoints

### System Health
Check system health and status.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "storage": "available",
    "uptime": 3600000,
    "version": "1.0.0"
  }
}
```

### System Settings
Get or update system configuration.

**Endpoint:** `GET /api/settings`

**Response:**
```json
{
  "success": true,
  "data": {
    "maxFileSize": 10485760,
    "allowedFileTypes": ["pdf", "doc", "docx", "ppt", "pptx"],
    "registrationEnabled": true,
    "maintenanceMode": false
  }
}
```

### Database Status
Get database statistics and information.

**Endpoint:** `GET /api/database/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "collections": [
      { "name": "users", "count": 1250 },
      { "name": "courses", "count": 45 },
      { "name": "lessons", "count": 180 }
    ],
    "totalSize": "256 MB",
    "lastBackup": "2024-01-01T02:00:00.000Z"
  }
}
```

## 🚨 Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED` - Valid authentication required
- `INVALID_CREDENTIALS` - Email/password combination invalid
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `VALIDATION_ERROR` - Request data validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server internal error

## 🔒 Security Considerations

### Authentication
- All endpoints require JWT authentication
- Tokens are transmitted via secure HTTP-only cookies
- Automatic token expiration and renewal

### Authorization
- Role-based access control (RBAC)
- Field-level permissions
- Resource ownership validation

### Rate Limiting
- API endpoints are rate-limited
- Different limits for different endpoints
- Burst protection mechanisms

### Input Validation
- All inputs are validated using Zod schemas
- SQL injection prevention
- XSS protection measures

## 📚 API Client Libraries

### JavaScript/TypeScript
```typescript
// Using Elysia.js Eden client
import { treaty } from '@elysiajs/eden'

const api = treaty('https://your-domain.com')

// Example usage
const courses = await api.api.courses.get()
const user = await api.api.users.post({
  email: 'user@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe'
})
```

### Python
```python
import requests

base_url = "https://your-domain.com/api"
headers = {"Cookie": "payload-token=your-jwt-token"}

response = requests.get(f"{base_url}/courses", headers=headers)
courses = response.json()

new_course = requests.post(f"{base_url}/courses", headers=headers, json={
    "title": "Python Basics",
    "description": "Learn Python fundamentals"
})
```

### cURL Examples
```bash
# Get courses
curl -H "Cookie: payload-token=your-token" \
     https://your-domain.com/api/courses

# Create user
curl -X POST \
     -H "Cookie: payload-token=your-token" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"pass","firstName":"John","lastName":"Doe"}' \
     https://your-domain.com/api/users
```

## 🧪 Testing the API

### Swagger Documentation
Visit `/api/swagger` for interactive API documentation:
```
https://your-domain.com/api/swagger
```

### Postman Collection
Import the provided Postman collection for comprehensive API testing.

### API Health Check
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "storage": "available"
  }
}
```

## 📈 API Versioning

Paideia LMS follows semantic versioning for its API:
- **Major versions** (`v2`, `v3`): Breaking changes
- **Minor versions** (`v1.1`, `v1.2`): New features
- **Patch versions** (`v1.0.1`): Bug fixes

Current API version: **v1**

## 🔄 Webhooks (Future)

Planned webhook functionality:
- Course completion notifications
- Assignment submission alerts
- User registration events
- System maintenance notifications

## 📞 Support

For API-related questions or issues:

- **Documentation**: This API reference
- **Interactive Docs**: `/api/swagger`
- **Support Email**: api-support@your-domain.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/hananoshikayomaru/paideia/issues)

---

This API documentation provides everything developers need to integrate with Paideia LMS programmatically.
