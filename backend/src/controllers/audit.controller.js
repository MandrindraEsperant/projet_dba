const { Pool } = require("pg");

// GET all audit logs
exports.getAuditLogs = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  });

  try {
    const result = await pool.query(
      "SELECT * FROM audit_compte ORDER BY date_action DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};

// GET audit log by ID
exports.getAuditLogById = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

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
      "SELECT * FROM audit_compte WHERE id_audit = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Audit log non trouvé" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching audit log by ID:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};

// DELETE audit log by ID
exports.deleteAuditLog = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Non authentifié" });
  }

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
      "DELETE FROM audit_compte WHERE id_audit = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Audit log non trouvé" });

    res.json({
      message: "Audit log supprimé",
      audit: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting audit log:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
};