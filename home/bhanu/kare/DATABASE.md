
# How to Sync Your Database Schema

If your database schema is out of sync or you see errors like "Table... does not exist," this guide provides a single, reliable command to fix it. This is a common and expected step after pulling new code that changes the database structure.

**IMPORTANT:** Running `npm run db:reset` will **permanently delete all data** in your database if you need to start fresh. If you just want to apply updates without losing data, this command is still safe to run.

## Step-by-Step Instructions

1.  **Ensure Environment is Configured**
    Make sure your `.env` file at the root of the project (`/home/user/studio/.env`) contains the correct `DATABASE_URL` for your PostgreSQL database.

2.  **Run the Sync Command**
    From your project's terminal (`/home/bhanu/kare`), execute the following command. We are using `db push` because it directly syncs your schema without needing migration files, which is ideal for development.

    ```bash
    npm run db:reset
    ```
    This is an alias for `npx prisma db push`.

This command will automatically:
- Connect to the database specified in your `.env` file.
- Compare your database's current state with the schema defined in `prisma/schema.prisma`.
- Create or update all tables and columns to match the schema.
- Generate a new Prisma Client for your application to use.

After the command completes, your database will be perfectly matched with your application's code. You can now restart your application (`npm run dev`) and the errors will be gone.
