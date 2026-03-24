// const pool = require("../config/db");
const { Pool } = require("pg");
// GET all compte
exports.getcompte = async (req, res) => {
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });
  try {
    const result = await pool.query("SELECT * FROM compte ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comptes:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};

// GET compte by ID
exports.getCompteById = async (req, res) => {
  const { id } = req.params;
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    const result = await pool.query("SELECT * FROM compte WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compte non trouvé" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching compte by ID:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};

// CREATE compte
exports.createCompte = async (req, res) => {
  const { n_compte, nom_client, solde } = req.body;
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    const existingCompte = await pool.query(
      "SELECT * FROM compte WHERE n_compte = $1",
      [n_compte]
    );

    if (existingCompte.rows.length > 0) {
      return res.status(400).json({ message: "Le numéro de compte existe déjà" });
    }
    const result = await pool.query(
      `INSERT INTO compte (n_compte, nom_client, solde)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [n_compte, nom_client, solde]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating compte:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};

// UPDATE compte
exports.updateCompte = async (req, res) => {
  const { id } = req.params;
  const { n_compte, nom_client, solde } = req.body;
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    // Vérifier si le nouveau numéro de compte est déjà utilisé par un AUTRE compte
    const existingCompte = await pool.query(
      "SELECT * FROM compte WHERE n_compte = $1 AND id != $2",
      [n_compte, id]
    );

    if (existingCompte.rows.length > 0) {
      return res.status(400).json({ message: "Le numéro de compte existe déjà" });
    }

    const result = await pool.query(
      `UPDATE compte 
       SET n_compte = $1, nom_client = $2, solde = $3
       WHERE id = $4
       RETURNING *`,
      [n_compte, nom_client, solde, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compte non trouvé" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating compte:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};

// DELETE compte
exports.deleteCompte = async (req, res) => {
  const { id } = req.params;
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    const result = await pool.query(
      "DELETE FROM compte WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Compte non trouvé" });

    res.json({ message: "Compte supprimé", compte: result.rows[0] });
  } catch (error) {
    console.error("Error deleting compte:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};