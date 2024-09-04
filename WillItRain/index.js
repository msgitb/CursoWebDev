import express from "express";
import axios from "axios";
import https from "https";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const URL_API = `https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&cnt=6&appid=${API_KEY}`;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/check", (req, res) => {
  console.log(req.query);
  const { latitude } = req.query,
    { longitude } = req.query;
  res.status(200).send(`latitude=${latitude} longitude=${longitude}`);
});

const options = {
  key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
};

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log("Listening on " + port);
});
