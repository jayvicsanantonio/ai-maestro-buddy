import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  uid: text('uid').primaryKey(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
  onboardingCompleted: integer('onboarding_completed', {
    mode: 'boolean',
  })
    .notNull()
    .default(false),
  // We'll store complex objects as JSON strings for simplicity in SQLite
  skill: text('skill').notNull(), // { tempo_stability: number, confidence: number }
  preferences: text('preferences').notNull(), // { coach_style: string, difficulty: number }
  character: text('character').notNull(), // { color: string, accessory: string, eyeStyle: string }
});

export const sessions = sqliteTable('sessions', {
  sessionId: text('session_id').primaryKey(),
  uid: text('uid')
    .notNull()
    .references(() => students.uid),
  updatedAt: text('updated_at').notNull(),
  data: text('data').notNull(), // Full SessionData as JSON
});
