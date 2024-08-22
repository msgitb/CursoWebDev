import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import {dirname} from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/public/index.html");
});

app.post("/submit", (req, res)=>{
  const first = req.body.street, second = req.body.pet; 
  res.send("<h1>Your Band Name is:</h1><h2>"+ first + second + "🤘</h2>");
});