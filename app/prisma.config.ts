import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config();

export default defineConfig({
  schema: './infra/prisma/schema.prisma',
  migrations: {
    path: './infra/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
});
