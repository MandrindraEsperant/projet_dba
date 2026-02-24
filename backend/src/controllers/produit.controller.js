// GET all produits
exports.getProduits = async (req, res) => {
  try {
    const result = await req.db.query("SELECT * FROM produits ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET produit by ID
exports.getProduitById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await req.db.query("SELECT * FROM produits WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Produit non trouvé" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE produit
exports.createProduit = async (req, res) => {
  try {
    const { nom, prix, stock } = req.body;
    

    const result = await req.db.query(
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

// UPDATE produit
exports.updateProduit = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { nom, prix, stock } = req.body;

    const result = await req.db.query(
      `UPDATE produits 
       SET nom = $1, prix = $2, stock = $3
       WHERE id = $4
       RETURNING *`,
      [nom, prix, stock, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Produit non trouvé" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE produit
exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await req.db.query(
      "DELETE FROM produits WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Produit non trouvé" });

    res.json({ message: "Produit supprimé", produit: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};