# MERN Stack Todo App with Authentication

A full-stack todo list application built with MongoDB, Express, React, and Node.js. Features include task management and authentication with both local accounts and Google OAuth.

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB running locally or a MongoDB Atlas account

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/todo-app
   SESSION_SECRET=your_secure_session_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
   
   Note: To get Google OAuth credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Set up OAuth consent screen
   - Create credentials (OAuth client ID)
   - Add authorized redirect URIs (http://localhost:5000/auth/google/callback)

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. The application should now be running:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Features
- User authentication (local and Google OAuth)
- Create, read, update, and delete tasks
- Task completion tracking
- User-specific task lists

## Technology Stack
- MongoDB: Database
- Express: Backend framework
- React: Frontend library
- Node.js: Runtime environment
- Passport.js: Authentication 