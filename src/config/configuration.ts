// Purpose: Configuration file for the application.
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME || 'basic_fintech',
    password: process.env.DATABASE_PASSWORD || 'password',
    user: process.env.DATABASE_USER || 'root',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || true,
    logging: process.env.DATABASE_LOGGING === 'true' || false,
    test: {
      host: process.env.DATABASE_TEST_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_TEST_PORT, 10) || 5432,
      name: process.env.DATABASE_TEST_NAME || 'basic_fintech_test',
      password: process.env.DATABASE_TEST_PASSWORD || 'password',
      user: process.env.DATABASE_TEST_USER || 'root',
    },
  },
  jwt: {
    secret: process.env.JWT
      ? process.env.JWT_SECRET
      : 'b8c2f4d8-3c1e-4b4d-8b4d-3c1e4b4d8b4d',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
