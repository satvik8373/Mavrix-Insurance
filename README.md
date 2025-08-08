# Insurance Alert System - Monorepo

A comprehensive insurance reminder system with separate client and server applications for easy deployment on Vercel.

## Project Structure

```
├── client/          # React frontend application
├── server/          # Node.js backend API
├── package.json     # Root package.json for monorepo management
└── README.md        # This file
```

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both client and server in development mode:**
   ```bash
   npm run dev
   ```

   This will start:
   - Client on http://localhost:3000
   - Server on http://localhost:5000

### Individual Commands

- **Client only:**
  ```bash
  npm run dev:client
  ```

- **Server only:**
  ```bash
  npm run dev:server
  ```

- **Build both:**
  ```bash
  npm run build
  ```

## Deployment

### Client Deployment (Vercel)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

   The client will be deployed as a static site with React routing.

### Server Deployment (Vercel)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

   The server will be deployed as serverless functions.

### Environment Variables

Make sure to set up the following environment variables in your Vercel project:

#### Server Environment Variables:
- `MONGODB_URI` - MongoDB connection string
- `EMAIL_USER` - Email account username
- `EMAIL_PASS` - Email account password
- `EMAIL_HOST` - SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)

#### Client Environment Variables:
- `REACT_APP_API_URL` - URL of your deployed server API

## Features

### Client Features
- React-based Progressive Web App (PWA)
- Responsive design for mobile and desktop
- Real-time data management
- File upload and CSV processing
- Email log tracking
- Settings management

### Server Features
- RESTful API endpoints
- MongoDB integration
- Automated email reminders
- Cron job scheduling
- File-based fallback storage
- CORS support

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/insurance` - Get all insurance data
- `POST /api/insurance` - Add new insurance entry
- `PUT /api/insurance/:id` - Update insurance entry
- `DELETE /api/insurance/:id` - Delete insurance entry
- `POST /api/upload` - Upload CSV file
- `GET /api/logs` - Get email logs
- `POST /api/send-reminder/:id` - Send manual reminder

## Development

### Adding Dependencies

- **Client dependencies:**
  ```bash
  cd client && npm install <package-name>
  ```

- **Server dependencies:**
  ```bash
  cd server && npm install <package-name>
  ```

### Code Structure

- **Client:** Standard Create React App structure
- **Server:** Express.js with modular architecture
- **Database:** MongoDB with fallback to file storage
- **Email:** Nodemailer with SMTP configuration

## Troubleshooting

### Common Issues

1. **Port conflicts:** Make sure ports 3000 and 5000 are available
2. **MongoDB connection:** Ensure your MongoDB URI is correct
3. **Email configuration:** Verify SMTP settings and credentials
4. **CORS issues:** Check that the client is pointing to the correct server URL

### Logs

- Client logs appear in the browser console
- Server logs appear in the terminal where you started the server
- Vercel deployment logs are available in the Vercel dashboard

## License

This project is licensed under the MIT License.
