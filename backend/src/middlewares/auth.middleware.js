exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non autorisé" });
  }
  next();
};