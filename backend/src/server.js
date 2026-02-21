const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();


const authRoutes = require("./routes/auth.routes");
const produitRoutes = require("./routes/produit.routes");
const auditController = require("./routes/audit.routes");

const app = express();

app.use(cors()); 
app.use(express.json());

app.use(
  session({
    secret: "monsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 heure
    },
  })
);
 
app.use("/api/produits", produitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/audit", auditController);

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});