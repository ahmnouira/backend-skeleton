const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5555,
  jwtSecret: process.env.JWT_SECRET || "secret",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.MONGO_PORT || "3333") +
      "/backendskeleton",
};

export default config;
