
# How to Sync Your Database Schema

If your application shows an error like "Table... does not exist," it means your local database is out of sync with the application's code. This is an expected step after making changes to the `prisma/schema.prisma` file.

## The Fix: One Command for Development

For development, the recommended way to sync your database is with the `db push` command. It directly applies your schema to the database without creating migration files, which is ideal for a fast development loop.

**From your project's terminal (`/home/bhanu/kare`), execute the following command:**
```bash
npm run db:reset
```

This command is now an alias for `npx prisma db push`. It will automatically:
- Connect to the database specified in your `.env` file.
- Compare your database's current state with the schema in `prisma/schema.prisma`.
- Create any missing tables and columns to make them match.
- Generate a new Prisma Client for your application to use.

After the command completes, your database will be perfectly synchronized with your code. You can restart your application (`npm run dev`), and the errors will be gone.
