const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");

router.get("/", produitController.getProduits);
router.post("/", produitController.createProduit);

module.exports = router;