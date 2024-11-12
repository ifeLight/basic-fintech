export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME || 'basic_fintech',
    password: process.env.DATABASE_PASSWORD || 'basic_fintech',
    user: process.env.DATABASE_USER || 'root',
  },
});
