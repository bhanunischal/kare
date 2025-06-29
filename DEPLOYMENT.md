# Deploying to an Ubuntu Server

This guide provides step-by-step instructions for deploying and running this Next.js application on a standard Ubuntu server.

## Prerequisites

Before you begin, ensure your Ubuntu server has the following installed:
*   **Node.js**: Version 20.x or later is recommended.
*   **npm** (or yarn/pnpm): This is the package manager for Node.js.
*   **Git**: To clone your project from your GitHub repository.
*   **Access to your PostgreSQL database**: Your server must be able to connect to your PostgreSQL database.

## Step 1: Clone Your Repository

Connect to your Ubuntu server via SSH and clone your project from GitHub.

```bash
# Replace with your repository URL
git clone https://github.com/your-username/your-repo-name.git

# Navigate into the project directory
cd your-repo-name
```

## Step 2: Install Dependencies

Install all the required npm packages.

```bash
npm install
```

## Step 3: Configure Environment Variables

The application requires environment variables for the database connection and base URL. Create a `.env` file in the root of your project directory:

```bash
nano .env
```

Add the following content to the file. **Make sure to replace the placeholder values with your actual credentials.**

```env
# 1. Database URL
# This is the connection string for your PostgreSQL database.
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host:5432/your_db_name"

# 2. Public Base URL
# This is the public URL where your application will be accessible.
# It is crucial for generating correct links (e.g., in emails).
NEXT_PUBLIC_BASE_URL="http://app1.nischal.ca:9002"
```
Save and close the file (in `nano`, press `CTRL+X`, then `Y`, then `Enter`).

## Step 4: Sync the Database Schema

This command updates your PostgreSQL database to match the schema defined in `prisma/schema.prisma`. You only need to run this command when you've made changes to the database schema.

```bash
npx prisma db push
```
This command will read your `.env` file for the `DATABASE_URL` and apply the necessary changes.

## Step 5: Build the Application

Create an optimized production build of your Next.js application.

```bash
npm run build
```

## Step 6: Run the Application

Start the Next.js production server.

```bash
npm run start
```
This will start the application on port 9002 as configured in `package.json`.

## Step 7 (Recommended): Use a Process Manager

Running `npm run start` directly will stop the server if you close your terminal. For long-term operation, you should use a process manager like `pm2`.

**Install PM2 (if you haven't already):**
```bash
sudo npm install -g pm2
```

**Start your app with PM2:**
```bash
pm2 start npm --name "child-care-ops" -- run start
```

Your application is now running! You can view it by navigating to `http://app1.nischal.ca:9002` in your browser.

**Useful PM2 Commands:**
*   `pm2 list`: View the status of all running applications.
*   `pm2 stop child-care-ops`: Stop your application.
*   `pm2 restart child-care-ops`: Restart your application (e.g., after pulling new code).
*   `pm2 logs child-care-ops`: View the application logs.
