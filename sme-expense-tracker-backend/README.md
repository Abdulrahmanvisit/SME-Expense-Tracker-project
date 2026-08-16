# SME Expense Tracker Backend

This backend provides a production-ready API for storing and managing SME expense data in MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv for environment configuration

## Project Structure

```text
sme-expense-tracker-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── expenseController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   ├── Expense.js
│   │   └── Profile.js
│   ├── routes/
│   │   ├── expenseRoutes.js
│   │   └── profileRoutes.js
│   ├── utils/
│   │   └── asyncHandler.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Software engineering standards used

- SOC (Separation of Concerns): routes, controllers, models, middleware, and config are kept separate.
- KISS (Keep It Simple, Stupid): the API is kept minimal and focused on the core expense use case.
- DRY (Don't Repeat Yourself): shared async error handling and consistent response patterns are centralized.
- Single Responsibility Principle: each module handles one concern only.
- Fail-safe validation: controller logic validates required fields before writing to the database.

## Getting started

1. Copy `.env.example` to `.env`.
2. Update MongoDB connection values.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Default API routes

- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/expenses/:id`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/profile`
- `PUT /api/profile`

## Notes

This backend is designed to be the production-ready layer for the frontend app. The current frontend still works with localStorage, but the API layer allows real persistence, multi-device access, and future expansion.
