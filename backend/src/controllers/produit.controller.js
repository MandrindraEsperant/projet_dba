const pool = require("../config/db");

// GET all produits
exports.getProduits = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produits ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE produit
exports.createProduit = async (req, res) => {
  try {
    const { nom, prix, stock } = req.body;

    const result = await pool.query(
      `INSERT INTO produits (nom, prix, stock)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nom, prix, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};