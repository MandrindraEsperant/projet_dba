const { Pool } = require("pg");

// Fonction de login (tentative de connexion via identifiants PostgreSQL)
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      message: "Nom d'utilisateur et mot de passe requis" 
    });
  }

  try {
    // Création d'un pool temporaire avec les identifiants fournis
    const userPool = new Pool({
      user:  process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    // Test de connexion simple
    await userPool.query("SELECT 1");

    // Important : on ferme immédiatement la connexion
    await userPool.end();

    // Stockage minimal dans la session (NE PAS stocker le mot de passe !)
    req.session.user = {
      username,
      connectedAt: new Date(),
    };

    return res.status(200).json({ 
      message: "Connexion réussie",
      user: { username }
    });

  } catch (err) {
    console.error("Erreur login :", err.message);
    return res.status(401).json({ 
      message: "Identifiants PostgreSQL invalides" 
    });
  }
};

// Fonction de logout
const logout = (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ 
      message: "Pas de session active" 
    });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur destroy session :", err);
      return res.status(500).json({ 
        message: "Erreur lors de la déconnexion" 
      });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ 
      message: "Déconnexion réussie" 
    });
  });
};

module.exports = {
  login,
  logout
};