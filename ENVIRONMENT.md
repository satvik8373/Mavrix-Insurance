# Environment Variables

A concise guide to configure environment variables for both client and server.

## Server (Node/Express)

Required for email sending and MongoDB. Create `server/.env` locally and set the same keys in your Vercel Server project.

### Variables
- `MONGODB_URI` (required for DB mode): MongoDB connection string. If not set, the app uses file-based storage.
- `DATABASE_NAME` (optional, default: `insuretrack`): MongoDB database name.
- `SMTP_HOST` (optional, default: `smtp.gmail.com`): SMTP host for sending emails.
- `SMTP_PORT` (optional, default: `587`): SMTP port.
- `EMAIL_USER` (required): SMTP username (sender email).
- `EMAIL_PASSWORD` (required): SMTP password or App Password.
- `REMINDER_DAYS` (optional, default: `7`): Days before expiry to send reminders.
- `PORT` (local only, default: `5000`): Local server port. Ignored on Vercel.
- `NODE_ENV` (auto on Vercel): Typically `production` on Vercel.

### Example: `server/.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority
DATABASE_NAME=insuretrack
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
REMINDER_DAYS=7
NODE_ENV=development
```

### Vercel (Server)
Add these in the Vercel dashboard (Project → Settings → Environment Variables) or via CLI:
```
vercel env add MONGODB_URI
vercel env add DATABASE_NAME
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add REMINDER_DAYS
```
Note: Do NOT set `PORT` on Vercel.

---

## Client (React)

Used to point the frontend to the deployed API. Create `client/.env` locally and set the same key in your Vercel Client project.

### Variables
- `REACT_APP_API_URL` (required): Base URL of your deployed API (no trailing slash), e.g. `https://<your-api>.vercel.app`.

### Example: `client/.env`
```
# Local: point to local server
REACT_APP_API_URL=http://localhost:5000
```

### Vercel (Client)
Add in the Vercel dashboard for the client project:
```
vercel env add REACT_APP_API_URL
```
Set the value to your deployed server URL, e.g. `https://mavrix-insurance-a9fv4685o-satvik8373s-projects.vercel.app`.

---

## Notes
- Client variables must be prefixed with `REACT_APP_` to be available in the React app.
- After changing environment variables on Vercel, redeploy to apply changes.
- CORS: The server currently enables CORS globally. If you restrict origins later, include your client domain(s).
