//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import e from "express";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, "localhost", () => {
  console.log("Server running on port 3000...");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
  if (req.body.password === "ILoveProgramming")
    res.sendFile(__dirname + "/public/secret.html");
  else {
    res.sendFile(__dirname + "/public/index.html");
  }
});
