# Integrating with a PostgreSQL Backend

This guide provides step-by-step instructions for connecting the Child Care Ops application to a real PostgreSQL database using Prisma ORM. This will replace the current mock data with a persistent, production-ready backend.

## 1. Set Up a PostgreSQL Database

First, you need a PostgreSQL database. You have several options:

*   **Local Development (Docker):** This is great for getting started quickly. Create a `docker-compose.yml` file with a PostgreSQL service.
*   **Cloud Provider:** For a real deployment, use a managed database service. Popular choices include:
    *   [Supabase](https://supabase.com/)
    *   [Neon](https://neon.tech/)
    *   [Railway](https://railway.app/)
    *   Google Cloud SQL, Amazon RDS, or Azure Database for PostgreSQL.

Once your database is created, you will get a **Database Connection URL**. It will look something like this:
`postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

## 2. Configure Environment Variables

Create a file named `.env` in the root of your project (if it doesn't exist). This file is for storing sensitive information like your database connection string.

Add your Database Connection URL to it:

```env
# .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Important:** The `.gitignore` file in this project is already configured to ignore `.env` files, so your credentials will not be committed to version control.

## 3. Create Database Tables

Prisma has already been initialized in this project. The database schema, which defines all your tables and columns, is located in the `prisma/schema.prisma` file. This file is the single source of truth for your database structure.

Now, you can use the Prisma CLI to create the tables in your PostgreSQL database based on this schema.

**Important:** Make sure you are in the root directory of your project (e.g., `~/studio`) before running the next command.

Run the following command in your terminal:

```bash
npx prisma db push
```

This command will:
1.  Connect to your database using the `DATABASE_URL` from your `.env` file.
2.  Compare the Prisma schema to the state of the database.
3.  Create all the necessary tables and columns to match the schema.

---

## 4. Troubleshooting

If you encounter a `Schema engine error` or other connection issues when running `npx prisma db push`, it's almost always an issue with the database connection or permissions. Here are the most common things to check:

### a. Verify Your Connection URL

Carefully check every part of the `DATABASE_URL` in your `.env` file. A small typo can cause the connection to fail.
-   **USER:** Is the username correct?
-   **PASSWORD:** Are there any special characters that need to be URL-encoded?
-   **HOST:** Is the host address correct? For AWS RDS, it will look something like `your-instance.random-chars.region.rds.amazonaws.com`.
-   **PORT:** Is the port correct? (Usually `5432` for PostgreSQL).
-   **DATABASE:** Is the database name correct?

### b. Database User Permissions

The database user specified in your connection string must have sufficient privileges to create and alter tables in the database.
- **Required Permissions:** The user needs `CREATE` and `USAGE` on the schema (usually `public`).
- **How to Grant:** Connect to your database as a superuser (like `postgres`) and run the following SQL commands:
  ```sql
  -- Replace 'your_user' with the user from your connection string
  -- Replace 'your_database' with the database from your connection string
  GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
  GRANT ALL ON SCHEMA public TO your_user;
  ```
This ensures your user can manage the schema as Prisma needs.

### c. Network Access / Firewall Rules (Very Common)

Cloud databases like AWS RDS are secure by default and reject all incoming traffic. You must explicitly allow your IP address to connect.
- **Check Security Groups (AWS):**
  1. Go to your RDS instance in the AWS Console.
  2. Find the "Connectivity & security" tab.
  3. Click on the active **VPC security group**.
  4. Go to the "Inbound rules" tab.
  5. Ensure there is a rule that allows traffic on the PostgreSQL port (5432) from **your IP address**. You can add a new rule with "Type: PostgreSQL" and "Source: My IP".

### d. Enforce SSL/TLS Connection

Some cloud databases require a secure SSL connection. You can enforce this by adding `?sslmode=require` to the end of your database connection string in the `.env` file. This often resolves SSL/TLS-related `Schema engine error` issues.

**Example:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

### e. Test Connection with `psql`

If `prisma db push` still fails, you can test your database connection and permissions directly from the command line using `psql`, the standard PostgreSQL client. This often provides more specific error messages than Prisma.

Run the following command from your project's root directory. You must replace `YOUR_DATABASE_URL_HERE` with the full database connection URL from your `.env` file.

```bash
# Example: psql "postgresql://user:pass@host:port/db?sslmode=require" -c "SELECT 1;"
psql "YOUR_DATABASE_URL_HERE" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

**What to look for:**
*   **Success:** If the connection and basic permissions are correct, you will see a `table_name` header followed by a list of tables (if any exist) and a row count, like `(0 rows)`. This means the connection is working.
*   **Failure:** If there's a problem, `psql` will give a specific error. Look for clues in the message:
    *   `psql: error: connection to server ... failed: FATAL: password authentication failed for user "..."`: The password in your `.env` file is incorrect.
    *   `psql: error: connection to server ... failed: timeout expired`: Your IP address is likely not allowed in the database's firewall or security group rules.
    *   `psql: error: connection to server ... failed: Connection refused`: The database server is not running or not accessible on that port.

This direct test will help you pinpoint the exact environmental issue.

---

## 5. Generate Prisma Client

After creating the tables, you need to generate the Prisma Client. This is a type-safe query builder that you will use in your application code to interact with the database.

Run this command:

```bash
npx prisma generate
```

You only need to run this command again if you make changes to your `prisma/schema.prisma` file.

## 6. Using the Prisma Client

A pre-configured Prisma Client instance is available at `src/lib/prisma.ts`. You can import it into your server-side files (Server Components, API Routes, Server Actions) to query the database.

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

---

## 7. Fixing Prisma `libssl` and Schema Engine Errors on Ubuntu

If you are consistently seeing `Schema engine error` along with `Prisma failed to detect the libssl/openssl version`, it means Prisma's query engine cannot establish a secure connection to your database. This is common on fresh Ubuntu servers that may not have all the necessary development libraries installed.

Follow these steps **on your Ubuntu server** to install the required packages and force Prisma to use them.

### Step 1: Update Package Lists

First, ensure your server's package manager has the latest list of available software.

```bash
sudo apt update
```

### Step 2: Install OpenSSL Development and PostgreSQL Client Libraries

This is the most critical step. It installs the `libssl-dev` package, which contains the header files that Prisma needs to correctly compile its engine against OpenSSL. It also installs the standard PostgreSQL client, which ensures all necessary communication libraries are present.

```bash
sudo apt install -y libssl-dev postgresql-client
```

### Step 3: Clean and Reinstall Prisma in Your Project

Now, back in your **project's terminal in Firebase Studio**, you need to clear out the old, problematic Prisma engine and reinstall it. This will force `npm` to download a new engine that can link against the libraries you just installed on your server.

Run these commands from your project's root directory (`/home/user/studio`):

```bash
# Remove the old Prisma engine binaries
rm -rf node_modules/.prisma

# A thorough way to ensure a clean slate for the client
rm -rf node_modules/@prisma/client

# Re-run npm install to download and link the correct Prisma engine
npm install
```

### Step 4: Generate Prisma Client and Push the Schema

After the re-installation is complete, generate the Prisma client and try pushing the database schema again.

```bash
npx prisma generate
npx prisma db push
```

Following these steps should resolve the underlying library issue and allow Prisma to connect to your database successfully.
