import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// Describes the "users" table. Column names/types here are what drizzle-kit
// uses to create (and later update) the actual table in sqlite.db.

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});
