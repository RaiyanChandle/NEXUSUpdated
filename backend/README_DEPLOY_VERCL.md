# Deploying Express Backend on Vercel

## 1. Ensure Project Structure
- Your backend entry file should be named `index.js` (or update `vercel.json` if different).
- All dependencies should be listed in `package.json`.

## 2. Add `vercel.json`
This file is already added:
```json
{
  "version": 2,
  "builds": [
    { "src": "index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.js" }
  ]
}
```

## 3. Environment Variables
- Set `VITE_FRONTEND_URL` and any other secrets in the Vercel dashboard under Project Settings → Environment Variables.

## 4. Prisma/Database
- Ensure your database is accessible from Vercel (cloud DB recommended).
- Set your `DATABASE_URL` in Vercel environment variables.

## 5. Deploy
- Push your code to GitHub/GitLab.
- Import the repo in Vercel and select the `backend` folder as the root.
- Set build output to `backend` if prompted.

## 6. Test
- After deployment, visit your Vercel backend URL to verify it works (e.g., `/` should return `Hello World!`).

---
For more: https://vercel.com/docs/concepts/functions/serverless-functions
