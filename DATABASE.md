# Integrating with a PostgreSQL Backend

This guide provides step-by-step instructions for connecting the Child Care Ops application to a real PostgreSQL database using Prisma ORM.

## 1. Set Up a PostgreSQL Database

First, you need a PostgreSQL database. You can use a cloud provider like [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or run your own instance on a server.

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

## 3. The Definitive Fix for the `Schema engine error`

If `npx prisma db push` consistently fails with a `Schema engine error` and a `Prisma failed to detect the libssl/openssl version` warning, it means Prisma's query engine is incompatible with the system libraries in your development environment. This often happens in specific Linux environments (like this one) that use alternatives to OpenSSL, such as LibreSSL.

**The Fix:** Use a Compatible Prisma Engine

The solution is to tell Prisma to use a more portable query engine that doesn't rely on the system's specific libraries. This is done by adding `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` to your `prisma/schema.prisma` file. **I have already made this change for you.**

### Applying the Fix

After I've applied the fix to your schema, you need to force Prisma to download this new engine.

Run these commands from your project's root directory (`/home/user/studio`):

```bash
# In your Firebase Studio project directory:

# 1. A thorough way to ensure a clean slate for the Prisma client
rm -rf node_modules/@prisma
rm -rf node_modules/.prisma

# 2. Re-run npm install to download and link the correct Prisma engine
npm install
```
This process ensures that `npm` re-evaluates the `binaryTargets` in your schema and installs the compatible engine.

### Push the Schema

Now that the compatible engine is installed, you can generate the client and push the schema.

```bash
# In your Firebase Studio project directory:
npx prisma generate
npx prisma db push
```

If the push is successful, your database tables will be created, and the `Schema engine error:` will be resolved.

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
