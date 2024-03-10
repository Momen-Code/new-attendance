export default () => ({
  NODE_ENV: 'prod',
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    url: process.env.MONGODB_URL,
  },
  access: {
    ADMIN_PUBLIC_KEY: process.env.ADMIN_PUBLIC_KEY,
    ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY,
  },
});
