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

Run the following command in your terminal:

```bash
npx prisma db push
```

This command will:
1.  Connect to your database using the `DATABASE_URL` from your `.env` file.
2.  Compare the Prisma schema to the state of the database.
3.  Create all the necessary tables and columns to match the schema.

## 4. Generate Prisma Client

After creating the tables, you need to generate the Prisma Client. This is a type-safe query builder that you will use in your application code to interact with the database.

Run this command:

```bash
npx prisma generate
```

You only need to run this command again if you make changes to your `prisma/schema.prisma` file.

## 5. Using the Prisma Client

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
