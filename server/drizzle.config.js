import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'data/database.sqlite',
    },
});
//# sourceMappingURL=drizzle.config.js.map