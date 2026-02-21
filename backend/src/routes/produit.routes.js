const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// CRUD complet
router.get("/", isAuthenticated, produitController.getProduits);          // GET all
router.get("/:id", isAuthenticated, produitController.getProduitById);    // GET by ID
router.post("/", isAuthenticated, produitController.createProduit);       // CREATE
router.put("/:id", isAuthenticated, produitController.updateProduit);     // UPDATE
router.delete("/:id", isAuthenticated, produitController.deleteProduit);  // DELETE

module.exports = router;