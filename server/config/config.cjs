const envKey = process.env.DIRECT_URL ? "DIRECT_URL" : "DATABASE_URL";

if (!process.env[envKey]) {
  throw new Error("Set DATABASE_URL or DIRECT_URL before running Sequelize CLI commands.");
}

const common = {
  use_env_variable: envKey,
  dialect: "postgres",
  logging: false,
  migrationStorageTableName: "schema_migrations",
  migrationTimestamps: true,
  define: {
    underscored: true,
    freezeTableName: true,
  },
};

module.exports = {
  development: { ...common },
  test: { ...common },
  staging: { ...common },
  production: {
    ...common,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
