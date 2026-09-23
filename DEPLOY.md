# Deployment Guide

This project consists of a Node/Express backend and a Next.js frontend. They must be deployed separately, but in a specific order since they depend on each other's URLs.

## Deployment Order
1. Deploy the Backend to Render first to get its URL.
2. Deploy the Frontend to Vercel using the backend's URL.
3. Update the Backend's `ALLOWED_ORIGIN` with the frontend's final URL and redeploy.

## Step 1: Backend Deployment (Render)
1. Log in to your Render dashboard and create a **New Web Service**.
2. Connect this GitHub repository.
3. Set the following configuration:
   - **Root Directory:** `server/`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `ALLOWED_ORIGIN`: Leave this blank or set a temporary value for now. You will update it later once the frontend URL is known.
5. Deploy the service and note the final assigned URL (e.g., `https://your-backend.onrender.com`).

## Step 2: Frontend Deployment (Vercel)
1. Log in to your Vercel dashboard and click **Add New... > Project**.
2. Import this GitHub repository.
3. Set the following configuration:
   - **Root Directory:** `client/` (You can edit this during the import step)
   - **Framework Preset:** Next.js (should be auto-detected)
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: The Render URL from Step 1 with the API path appended (e.g., `https://your-backend.onrender.com/api/canvases`).
5. Deploy the project and note the final Vercel URL (e.g., `https://your-frontend.vercel.app`).

## Step 3: Final Backend Configuration
1. Go back to your Render dashboard for the backend service.
2. Update the `ALLOWED_ORIGIN` environment variable to match your exact Vercel URL (e.g., `https://your-frontend.vercel.app`).
3. Trigger a manual deploy of the backend for the CORS changes to take effect.
