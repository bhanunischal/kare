# Integrating with a PostgreSQL Backend

This guide provides step-by-step instructions for connecting the Child Care Ops application to a real PostgreSQL database using Prisma ORM. This will replace the current mock data with a persistent, production-ready backend.

## 1. Set Up a PostgreSQL Database

First, you need a PostgreSQL database. You can use a cloud provider like [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or run your own instance on a server like you are doing with Ubuntu.

Once your database is created, you will get a **Database Connection URL**. It will look something like this:
`postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

## 2. Configure Environment Variables

Create a file named `.env` in the root of your project (if it doesn't exist). This file is for storing sensitive information like your database connection string.

Add your Database Connection URL to it. It's often a good idea to add `?sslmode=require` for cloud connections.

```env
# .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

**Important:** The `.gitignore` file in this project is already configured to ignore `.env` files, so your credentials will not be committed to version control.

## 3. Fixing Persistent `Schema engine error` on Ubuntu

If you can connect to your database with a command-line tool like `psql` but `npx prisma db push` consistently fails with a `Schema engine error` and a `Prisma failed to detect the libssl/openssl version` warning, it means Prisma's query engine cannot establish a secure connection. This is a common environmental issue on fresh Ubuntu servers.

Follow these steps precisely to fix it.

### Step 1: Install Required Libraries on Your Ubuntu Server

First, SSH into your Ubuntu server that is running PostgreSQL. Run the following commands to update its package list and install the necessary development headers for OpenSSL and the PostgreSQL client.

```bash
# SSH into your Ubuntu server and run these:
sudo apt update
sudo apt install -y libssl-dev postgresql-client
```
These libraries are essential for Prisma's engine to compile and connect correctly.

### Step 2: Rebuild Prisma in Your Project

This is the most critical step. After installing the libraries on your server, you must force Prisma to re-evaluate the environment and download the correct engine.

Return to your **Firebase Studio terminal** and run these commands from your project's root directory (`/home/user/studio`):

```bash
# In your Firebase Studio project directory:

# 1. Remove the old Prisma engine binaries
rm -rf node_modules/.prisma

# 2. A thorough way to ensure a clean slate for the client
rm -rf node_modules/@prisma/client

# 3. Re-run npm install to download and link the correct Prisma engine
npm install
```
This process ensures that `npm` detects the newly available system libraries and installs the compatible Prisma engine.

### Step 3: Generate Prisma Client and Push the Schema

Now that the environment is fixed and the correct engine is installed, you can generate the client and push the schema.

```bash
# In your Firebase Studio project directory:
npx prisma generate
npx prisma db push
```

If the push is successful, your database tables will be created.

---

## 4. Test Database Connection (Optional)

If you are still facing issues, you can test your database connection URL directly from the Studio terminal using `psql`. This can provide more specific error messages than Prisma.

**Important:** This command may prompt you to install `psql` inside the development environment. It's safe to proceed.

Replace `YOUR_DATABASE_URL_HERE` with the full URL from your `.env` file and run:
```bash
# Example: psql "postgresql://user:pass@host:port/db?sslmode=require" -c "SELECT 1;"
psql "YOUR_DATABASE_URL_HERE" -c "SELECT 1;"
```
- **Success:** The output `(1 row)` means the connection is working.
- **Failure:** The command will print a specific error (e.g., `password authentication failed`, `timeout expired`). This can help you debug your connection string or firewall rules.

## 5. Using the Prisma Client

Once your tables are created and the client is generated, a pre-configured Prisma Client instance is available at `src/lib/prisma.ts`. You can import it into your server-side files (Server Components, API Routes, Server Actions) to query the database.

**Example (fetching children for a daycare):**

```typescript
// in a server component or action
import prisma from '@/lib/prisma';

async function getChildrenForDaycare(daycareId: string) {
  const children = await prisma.child.findMany({
    where: {
      daycareId: daycareId,
    },
  });
  return children;
}
```
