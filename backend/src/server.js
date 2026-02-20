const express = require("express");
const cors = require("cors");
require("dotenv").config();

const produitRoutes = require("./routes/produit.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/produits", produitRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});