require("dotenv").config();
const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const cors = require("cors");
const mongoose = require("mongoose");
const schema = require("./schemas/schema");
const root = require("./resolvers/Resolver");

// ✅ Importar jsonwebtoken
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const mongoData = process.env.DATABASE_URL;
mongoose.connect(mongoData);
const database = mongoose.connection;

database.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

app.all("/graphql", (req, res) => {
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      user = jwt.verify(token, JWT_SECRET);
      req.user = user;
    } catch (err) {
      console.warn("Token inválido:", err.message);
      return res.status(401).json({ error: "Token inválido" });
    }
  }

  return createHandler({
    schema,
    rootValue: root,
    context: { user },
  })(req, res);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});