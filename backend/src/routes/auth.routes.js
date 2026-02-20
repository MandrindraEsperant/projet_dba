const express = require("express");
const router = express.Router();

const { login, logout } = require("../controllers/auth.controller");

// Route de connexion
router.post("/login", login);

// Route de déconnexion
router.post("/logout", logout);

module.exports = router;