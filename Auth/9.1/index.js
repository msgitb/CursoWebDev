import express from "express";
import bodyParser from "body-parser";
import { debug } from "console";
import db from "./connection.js";
import { hostname } from "os";
const app = express();
const port = 3000;

await db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1,$2)",
      [username, password]
    );
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [username, password]
    );
    if (result.rowCount > 0) return res.render("secrets.ejs");
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
