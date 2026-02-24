const express = require("express");
const router = express.Router();

const { login, logout, getUsers, createUser, updateUserPermissions, deleteUser } = require("../controllers/auth.controller");

// Route de connexion
router.post("/login", login);

// Route de déconnexion
router.post("/logout", logout);

// Gestion des utilisateurs
router.get("/users", getUsers);
router.post("/create-user", createUser);
router.put("/users/:username/permissions", updateUserPermissions);
router.delete("/users/:username", deleteUser);

module.exports = router;