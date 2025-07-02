
# How to Reset and Recreate Your Database

If your database schema is out of sync, corrupted, or needs to be updated with new tables, this guide provides a single, reliable command to completely reset it.

**IMPORTANT:** This process will **permanently delete all data** in your database and recreate it from scratch based on the latest schema. This is required when making schema changes, such as adding new fields like `motherEmail` or `fatherEmail` to the `Child` model.

## Step-by-Step Instructions

1.  **Ensure Environment is Configured**
    Make sure your `.env` file at the root of the project (`/home/user/studio/.env`) contains the correct `DATABASE_URL` for your PostgreSQL database.

2.  **Run the Reset Command**
    From your project's terminal (`/home/user/studio`), execute the following command:
    ```bash
    npx prisma migrate reset
    ```

3.  **Confirm the Reset**
    Prisma will ask you to confirm because this action cannot be undone.
    - Type `y` and press `Enter` to proceed.

This command will automatically:
- Drop the database.
- Create a new, empty database.
- Apply the schema from `prisma/schema.prisma` to create all tables (`Daycare`, `User`, `Child`, `Staff`, etc.).
- Generate a new Prisma Client for your application to use.

After the command completes, your database will be fresh, empty, and perfectly matched with your application's code. You can now restart your application and begin with a clean slate.
