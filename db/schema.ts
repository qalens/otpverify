import { integer, pgTable, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    firstName: varchar({ length: 100 }).notNull(),
    lastName: varchar({ length: 100 }).notNull(),
    // hashed password (nullable to allow legacy rows during migration)
    password: varchar({ length: 255 }),
    otp: varchar({ length: 6 }),
    verified: boolean().default(false).notNull(),
    createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
});