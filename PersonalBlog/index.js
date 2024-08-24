import bodyParser from "body-parser";
import e from "express";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import morgan from "morgan";
import fs from "fs";
import path from "path";

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

var app = express();

var entries = [
  {
    id: 0,
    title: "Primeiro post",
    message:
      "Este nao é um post muito extenso, é só mesmo para efeitos de teste!",
    date: new Date("11/10/23"),
  },
  {
    id: 1,
    title: "Segundo post",
    message: "Bla bla bla diz nada de jeito...",
    date: new Date("10/10/23"),
  },
  {
    id: 2,
    title: "Terceiro post",
    message:
      "Este também nao é um post muito extenso, mas tem uma mensagem um bocadinho maior, se bem que é capaz de nao ser satisfatória o suficiente uma vez que não diz nada de jeito...",
    date: new Date(),
  },
];

function comparator(a, b) {
  if (a.date < b.date) {
    return 1;
  } else return -1;
}

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

entries.sort(comparator);

app.get("/", (req, res) => {
  if (req.query.search) {
    var searchResult = [];

    entries.forEach((el) => {
      if (
        el.title
          .toLocaleLowerCase()
          .includes(req.query.search.toLocaleLowerCase())
      ) {
        searchResult.push(el);
      }
    });

    if (searchResult.length === 0) searchResult = undefined;
    res.render("index.ejs", {
      entries: searchResult,
    });
    return;
  }
  res.render("index.ejs", {
    entries,
  });
});

app.get("/newpost", (req, res) => {
  res.render("index.ejs", {
    newPost: true,
  });
});

app.get("/viewpost", (req, res) => {
  var postToView = entries.find((el) => {
    return el.id.toString() === req.query.id;
  });

  res.render("index.ejs", {
    entry: postToView,
  });
});

app.get("/editpost", (req, res) => {
  var postToView = entries.find((el) => {
    return el.id.toString() === req.query.id;
  });

  res.render("index.ejs", {
    entry: postToView,
    edit: true,
  });
});

app.get("/deletepost", (req, res) => {
  var position;
  entries.find((el) => {
    position = entries.indexOf(el);
    return el.id === parseInt(req.query.id);
  });
  entries.splice(position, 1);

  res.render("index.ejs", {
    entries,
  });
});

app.post("/editpost", (req, res) => {
  var position;
  entries.find((el) => {
    position = entries.indexOf(el);
    return el.id === parseInt(req.body.id);
  });
  req.body.id = parseInt(req.body.id);
  req.body.date = new Date();
  entries[position] = { ...req.body };
  res.render("index.ejs", {
    entry: entries[position],
  });
});

app.post("/newpost", (req, res) => {
  var newEntry = req.body;
  newEntry.date = new Date();
  newEntry.id = entries.length;
  entries.push({ ...newEntry });

  res.render("index.ejs", { entries });
});

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(3000, "localhost", (err) => {
  if (err) throw err;
  console.log("Listening on 3000...");
});
