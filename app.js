require("dotenv").config();
const express           = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const cors              = require("cors");
const mongoose          = require("mongoose");
const schema            = require("./schemas/schema");
const root              = require("./resolvers/Resolver");
const authMiddleware    = require("./middleware/auth"); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

const mongoData = process.env.DATABASE_URL;
mongoose.connect(mongoData);
const database  = mongoose.connection;

database.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});