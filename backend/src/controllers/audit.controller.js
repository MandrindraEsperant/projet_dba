// const pool = require("../config/db");
const { Pool } = require("pg");
// GET all audit logs
exports.getAuditLogs = async (req, res) => {
  
  const pool = new Pool({
    user: req.session.user.username,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: req.session.user.password,
    port: process.env.DB_PORT,
  })
  try {
    const result = await pool.query(
      "SELECT * FROM audit_log ORDER BY date_action DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET audit log by ID
exports.getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = new Pool({
      user: req.session.user.username,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: req.session.user.password,
      port: process.env.DB_PORT,
    })
    const result = await pool.query(
      "SELECT * FROM audit_log WHERE id_audit = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Audit log non trouvé" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE audit log by ID
exports.deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = new Pool({
      user: req.session.user.username,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: req.session.user.password,
      port: process.env.DB_PORT,
    })

    const result = await pool.query(
      "DELETE FROM audit_log WHERE id_audit = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Audit log non trouvé" });

    res.json({
      message: "Audit log supprimé",
      audit: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};