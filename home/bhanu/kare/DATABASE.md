
# How to Sync Your Database Schema

If your application isn't working because of a database error like "Table... does not exist," or a field is missing, it means your database schema is out of sync with the application code. This is an expected step after making changes to the `prisma/schema.prisma` file (e.g., adding the `plan` field to the `Daycare` model).

## The Fix: One Command

This command will read your `prisma/schema.prisma` file and update your database to match it, creating any missing tables and columns.

**IMPORTANT: You must run this command *before* starting the development server with `npm run dev` whenever you see this type of database error.**

**From your project's terminal (`/home/bhanu/kare`), execute the following command:**
```bash
npm run db:reset
```

That's it! The command will automatically:
- Connect to the database specified in your `.env` file.
- Compare your database's current state with the schema defined in `prisma/schema.prisma`.
- Apply the necessary changes to create all the required tables and fields.
- Generate a new Prisma Client for your application to use.

After the command completes, your database will be perfectly matched with your application's code. You can now restart your application (`npm run dev`) and continue working.
