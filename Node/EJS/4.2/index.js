import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var filled = false;
var nameLenght = 0;
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  filled = false;
  res.render("index.ejs", { filled });
});

app.post("/submit", (req, res) => {
  filled = true;
  nameLenght = req.body["fName"].length + req.body["lName"].length;
  res.render("index.ejs", { filled, nameLenght });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
