
# How to Sync Your Database Schema

If your application isn't working because of a database error like "Table... does not exist," it means your database schema is out of sync with the application code. This guide provides a single, reliable command to fix this.

This is a common and expected step after pulling new code that changes the database structure (e.g., adding the `Daycare` or `Staff` models).

## The Fix: One Command

This command will read your `prisma/schema.prisma` file and update your database to match it, creating any missing tables and columns.

**From your project's terminal (`/home/user/studio/kare`), execute the following command:**
```bash
npm run db:reset
```

That's it! The command (which now runs `prisma db push`) will automatically:
- Connect to the database specified in your `.env` file.
- Compare your database's current state with the schema defined in `prisma/schema.prisma`.
- Apply the necessary changes to create all the required tables.
- Generate a new Prisma Client for your application to use.

After the command completes, your database will be perfectly matched with your application's code. You can now restart your application (`npm run dev`) and continue working.
