
app.post("/logout", (req, res) => {
  if (!req.session) {
    return res.status(400).json({ message: "Pas de session active" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }

    res.clearCookie("connect.sid"); // Supprime le cookie de session
    res.json({ message: "Déconnexion réussie" });
  });
});