#!/bin/sh

echo "Waiting for database..."
until nc -z db 5432; do
    sleep 1
done

echo "Database up..."
echo "Running migrations..."
npm run db:migrate

echo "Seeding database..."
npm run db:seed

echo "Starting API..."
npm run dev