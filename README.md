# Book Review API

A RESTful API built with Node.js and Express for a Book Review system. This API provides endpoints for user authentication, managing books, and submitting/managing reviews.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing with Postman/cURL](#testing-with-postmancurl)
- [Design Decisions and Assumptions](#design-decisions-and-assumptions)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)

## Features

- User authentication with JWT
- Book management (add, list, get details, update, delete)
- Review system (submit, update, delete reviews)
- Search functionality for books by title or author
- Pagination for book listings and reviews
- Input validation and error handling
- Rate limiting to prevent abuse

## Tech Stack

- **Node.js** with **Express.js** - Backend framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** (JSON Web Tokens) - Authentication
- **Joi** - Input validation
- **Helmet** - Security headers
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety
- **Express Rate Limit** - API rate limiting

## Database Schema

### User
- **username** (String, unique, required) - User's display name
- **email** (String, unique, required) - User's email address
- **password** (String, required, hashed) - User's password (stored securely)
- **createdAt** (Date) - When the user account was created
- **updatedAt** (Date) - When the user account was last updated

### Book
- **title** (String, required) - Book title
- **author** (String, required) - Book author
- **genre** (String) - Book genre/category
- **description** (String) - Book description
- **createdAt** (Date) - When the book was added
- **updatedAt** (Date) - When the book was last updated

### Review
- **bookId** (ObjectId, ref: 'Book', required) - Reference to the book
- **userId** (ObjectId, ref: 'User', required) - Reference to the user who wrote the review
- **rating** (Number, required, 1-5) - Rating given to the book
- **comment** (String) - Review comment/text
- **createdAt** (Date) - When the review was submitted
- **updatedAt** (Date) - When the review was last updated

### Entity Relationship Diagram

```
+---------------+       +---------------+       +---------------+
|     User      |       |     Book      |       |    Review     |
+---------------+       +---------------+       +---------------+
| _id           |       | _id           |       | _id           |
| username      |       | title         |       | bookId        |----+
| email         |       | author        |       | userId        |--+ |
| password      |       | genre         |       | rating        |  | |
| createdAt     |       | description   |       | comment       |  | |
| updatedAt     |       | createdAt     |       | createdAt     |  | |
+---------------+       | updatedAt     |       | updatedAt     |  | |
        ^               +---------------+       +---------------+  | |
        |                      ^                                   | |
        |                      |                                   | |
        +----------------------+-----------------------------------+ |
                               |                                     |
                               +-------------------------------------+
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository: