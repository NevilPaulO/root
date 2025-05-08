-- Migration: 0000_initial_schema (down)
-- Created at: 2023-01-01T00:00:00.000Z
-- Description: Revert initial database schema

-- Drop indexes
DROP INDEX IF EXISTS "comments_post_id_idx";
DROP INDEX IF EXISTS "comments_user_id_idx";
DROP INDEX IF EXISTS "posts_published_idx";
DROP INDEX IF EXISTS "posts_user_id_idx";

-- Drop tables
DROP TABLE IF EXISTS "comments";
DROP TABLE IF EXISTS "posts";
DROP TABLE IF EXISTS "users";

