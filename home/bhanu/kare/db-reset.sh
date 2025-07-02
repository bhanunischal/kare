#!/bin/bash
# This script ensures the database is in sync with the Prisma schema by pushing the schema state.
# It is the recommended command for development environments.
echo "Running 'npx prisma db push' to sync the database schema..."
npx prisma db push
