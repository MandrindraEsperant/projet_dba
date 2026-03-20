const express = require("express");
const router = express.Router();
const compteController = require("../controllers/compte.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// CRUD complet
router.get("/", isAuthenticated, compteController.getcompte);          // GET all
router.get("/:id", isAuthenticated, compteController.getCompteById);    // GET by ID
router.post("/", isAuthenticated, compteController.createCompte);       // CREATE
router.put("/:id", isAuthenticated, compteController.updateCompte);     // UPDATE
router.delete("/:id", isAuthenticated, compteController.deleteCompte);  // DELETE

module.exports = router; 