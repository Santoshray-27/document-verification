const { z } = require('zod');

const envSchema = z.object({
  PORT: z.string().default('4000'),
  JWT_SECRET: z.string().default('supersecret_change_in_production'),
  NODE_ENV: z.string().default('development'),
  WORKER_URL: z.string().default('http://127.0.0.1:8001')
});

const env = envSchema.parse(process.env);

module.exports = { env };
