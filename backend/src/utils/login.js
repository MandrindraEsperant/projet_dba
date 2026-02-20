const { Pool } = require("pg");
const session = require("express-session");

app.use(session({
  secret: "monsecret",
  resave: false,
  saveUninitialized: false
}));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userPool = new Pool({
      user: username,
      host: "localhost",
      database: "administration_db",
      password: password,
      port: 5432,
    });

    await userPool.query("SELECT 1"); // Test connexion

    req.session.user = {
      username,
      password,
    };

    res.status(200).json({ message: "Connexion réussie" });

  } catch (err) {
    res.status(401).json({ message: "Identifiants PostgreSQL invalides" });
  }
});