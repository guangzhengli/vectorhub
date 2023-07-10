# Supabase

## Register a Supabase account
https://supabase.com

## Create a new project

get the database url

## Create a new table
Run this in your database:

```sql
-- Enable the pgvector extension to work with embedding vectors
create extension vector;
```

```shell
npx prism migrate dev
```