
# How to Sync Your Database Schema

If your application isn't working because of a database error like "Table... does not exist," or "Unknown argument...", it means your database schema is out of sync with the application code. This guide provides a single, reliable command to fix this.

This is a common and expected step after making changes to the `prisma/schema.prisma` file (e.g., adding a new field to a model).

## The Fix: One Command

This command will read your `prisma/schema.prisma` file and update your database to match it, creating any missing tables and columns. It is the correct method for this development environment.

**From your project's terminal (`/home/bhanu/kare`), execute the following command:**
```bash
npm run db:reset
```

That's it! The command now correctly runs `prisma db push`, which will automatically:
- Connect to the database specified in your `.env` file.
- Compare your database's current state with the schema defined in `prisma/schema.prisma`.
- Apply the necessary changes (add/remove tables and columns) to sync them.
- Generate a new Prisma Client for your application to use.

After the command completes, your database will be perfectly matched with your application's code. You can now restart your application (`npm run dev`) and continue working without database errors.
