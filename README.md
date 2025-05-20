# Nexus AI

An AI chat application built with React and Node.js that uses Clerk for authentication and Google's Gemini AI for generating responses.

## Features

- User authentication with Clerk
- AI chat functionality using Google's Gemini API
- Image analysis capabilities
- Code assistance

## Technologies Used

- Frontend: React, Vite
- Backend: Node.js, Express
- Authentication: Clerk
- Image Processing: ImageKit
- AI: Google Gemini API
- Database: MongoDB

## Setup Instructions

1. Clone the repository
2. Install dependencies:
3. Set up environment variables in `.env` files
4. Start the backend:
5. Start the frontend:


## Environment Variables

### Frontend (.env)
- VITE_CLERK_PUBLISHABLE_KEY
- VITE_IMAGE_KIT_ENDPOINT
- VITE_IMAGE_KIT_PUBLIC_KEY
- VITE_GEMINI_PUBLIC_KEY
- VITE_API_URL

### Backend (.env)
- MONGO
- CLIENT_URL
- IMAGE_KIT_ENDPOINT
- IMAGE_KIT_PUBLIC_KEY
- IMAGE_KIT_PRIVATE_KEY
- CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
