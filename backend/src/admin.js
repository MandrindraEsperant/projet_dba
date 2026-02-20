app.get("/admin/audit", async (req, res) => {
  if (req.session.user.username !== "postgres") {
    return res.status(403).json({ message: "Accès refusé" });
  }

  const pool = new Pool({
    user: req.session.user.username,
    password: req.session.user.password,
  });

  const result = await pool.query("SELECT * FROM audit_log ORDER BY date_action DESC");
  res.json(result.rows);
});