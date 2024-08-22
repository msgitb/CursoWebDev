import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

var date = new Date();
var app = express();

var message = [
  "a weekday, it's time to work hard!",
  "the weekend, it's time to have fun!",
];

app.listen(3000, "localhost", () => {
  console.log("listening on 3000...");
});

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs", {
    message: date.getDay() < 5 || date.getDay() !== 0 ? message[0] : message[1],
  });
});
