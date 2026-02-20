const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");

// CRUD complet
router.get("/", produitController.getProduits);          // GET all
router.get("/:id", produitController.getProduitById);    // GET by ID
router.post("/", produitController.createProduit);       // CREATE
router.put("/:id", produitController.updateProduit);     // UPDATE
router.delete("/:id", produitController.deleteProduit);  // DELETE

module.exports = router;