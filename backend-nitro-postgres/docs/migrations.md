# Database Migrations

This document explains how database migrations work in this project using Drizzle ORM.

## Overview

Database migrations are a way to manage changes to your database schema over time. They allow you to:

- Track changes to your database schema
- Apply changes consistently across different environments
- Roll back changes if needed
- Collaborate with other developers without conflicts

## Migration Files

Migration files are stored in the `src/migrations` directory. Each migration consists of:

- An SQL file with the changes to apply (up migration)
- An SQL file with the changes to revert (down migration)
- A timestamp to ensure migrations are applied in the correct order

## Creating Migrations

To create a new migration, follow these steps:

1. Update your schema in `src/models/schema.ts`
2. Run the migration generation command:

```bash
pnpm migrate:generate
```

This will create new migration files in the `src/migrations` directory based on the changes to your schema.

## Applying Migrations

To apply pending migrations to your database, run:

```bash
pnpm migrate
```

This will apply all pending migrations in the correct order.

## Rolling Back Migrations

To roll back the most recent migration, run:

```bash
pnpm migrate:down
```

This will revert the changes made by the most recent migration.

## Migration History

Drizzle ORM keeps track of applied migrations in a table called `drizzle_migrations` in your database. This table contains:

- The name of each applied migration
- The timestamp when it was applied
- A hash to verify the migration's integrity

## Best Practices

1. **Never modify existing migrations** that have been applied to any environment. Instead, create a new migration to make the desired changes.

2. **Keep migrations small and focused** on a single change or related set of changes.

3. **Test migrations thoroughly** before applying them to production.

4. **Include both "up" and "down" migrations** to allow for rollbacks.

5. **Use descriptive names** for your migrations, such as `create_users_table` or `add_email_to_users`.

6. **Version control your migrations** along with your code.

## Troubleshooting

### Migration Failed

If a migration fails, the database may be left in an inconsistent state. To recover:

1. Check the error message to understand what went wrong
2. Fix the issue in your schema or migration files
3. Try running the migration again

### Conflicts with Other Developers

If multiple developers are working on the same database schema:

1. Always pull the latest changes before creating new migrations
2. Communicate with your team about schema changes
3. Resolve conflicts in migration files before applying them

### Manual Intervention

Sometimes you may need to manually intervene in the migration process:

1. You can directly edit the `drizzle_migrations` table to mark migrations as applied or unapplied
2. You can write custom SQL scripts to fix issues that can't be resolved through the normal migration process

Remember to document any manual interventions for future reference.

