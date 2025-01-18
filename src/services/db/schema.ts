import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
    'users',
    {
        id: varchar('id', {
            length: 255,
        })
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        email: varchar('email', {
            length: 255,
        }).notNull(),
        normalizedEmail: varchar('normalized_email', {
            length: 255,
        }).notNull(),
        emailVerified: boolean('email_verified').default(false),
        agreedToTerms: boolean('agreed_to_terms').default(false),
        hashedPassword: varchar('hashed_password').default('').notNull(),
        googleId: varchar('google_id', {
            length: 255,
        }),
        name: varchar('name', {
            length: 255,
        }),
        picture: varchar('picture', {
            length: 255,
        }),
    },
    table => {
        return {
            normalizedEmailIdx: uniqueIndex('normalized_email_idx').on(table.normalizedEmail),
        };
    }
);

export const emailVerificationCodes = pgTable('email_verification_codes', {
    id: serial('id').primaryKey(),
    code: varchar('code', {
        length: 8,
    }).notNull(),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),

    userId: varchar('user_id')
        .notNull()
        .references(() => users.id),
});

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),

    userId: varchar('user_id')
        .notNull()
        .references(() => users.id),
});

export const usersRelations = relations(users, ({ many }) => ({
    emailVerificationCodes: many(emailVerificationCodes),
    sessions: many(sessions),
}));

export const emailVerificationCodesRelations = relations(emailVerificationCodes, ({ one }) => ({
    users: one(users, {
        fields: [emailVerificationCodes.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    users: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));
