# Deployment Guide: Visually

This guide will walk you through deploying **Visually** to the web using **Vercel** (Frontend + Backend) and **Neon** (Database).

## Prerequisites
- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account.
- A [Neon](https://neon.tech) account.

---

## Step 1: Database Setup (Neon)

1.  **Create a Project**: Log in to Neon and create a new project (e.g., `visually-db`).
2.  **Get Connection String**:
    - On the Dashboard, look for the **Connection Details**.
    - Copy the **Connection String** (it looks like `postgresql://neondb_owner:...`).
    - **Save this for later!**
3.  **Initialize Database**:
    - Go to the **SQL Editor** in Neon.
    - Copy the contents of `schema.sql` from this repository.
    - Paste it into the editor and click **Run**.
    - *Success Check*: You should see `users` and `history` tables in the "Tables" sidebar.

---

## Step 2: Deploy to Vercel

1.  **Push Code**: Ensure your latest code (including `api/` folder and `vercel.json`) is pushed to your GitHub repository.
2.  **Import Project**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your `visually` repository and click **Import**.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should auto-detect `Vite`. If not, select it.
    - **Root Directory**: Leave as `./`.
4.  **Environment Variables**:
    - Expand the **Environment Variables** section.
    - Add the following variables:
        - `DATABASE_URL`: Paste the Neon connection string you copied earlier.
        - `JWT_SECRET`: Enter a long, random string (e.g., `my-super-secret-key-123`).
5.  **Deploy**:
    - Click **Deploy**.
    - Wait for the build to finish (usually 1-2 minutes).

---

## Step 3: Verification

1.  **Visit your URL**: Vercel will give you a domain (e.g., `visually.vercel.app`).
2.  **Register**:
    - Click "Register" on the login screen.
    - Enter a Username, Email, and Password (min 8 chars).
    - Click "Create Account".
3.  **Check History**:
    - Once logged in, click the **History** button in the top navigation bar.
    - Navigate around the app (CPU, L1, etc.) and reopen History to see your actions logged.

---

## Troubleshooting

- **Registration Fails?**
    - Check Vercel Logs: Go to your project -> **Logs** tab. Look for errors in the `/api/auth/register` function.
    - Check Database: Ensure the `users` table exists in Neon.
- **History Empty?**
    - Ensure you are logged in (not Guest mode).
    - Check if the `history` table exists in Neon.
