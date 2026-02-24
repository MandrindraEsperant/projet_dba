const { Pool } = require("pg");

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non autorisé; connectez-vous d'abord" });
  }

  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  req.db = pool;
  next();
};
