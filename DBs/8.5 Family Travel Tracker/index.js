import express from "express";
import bodyParser from "body-parser";
import db from "./connection.js";

const app = express();
const port = 3000;

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let users;
let currentUserId = 1;
const refreshUsers = async () => {
  const result = await db.query("Select * FROM users");

  users = result.rows && result.rows.length && result.rows;
};

await refreshUsers();
async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries INNER JOIN users ON visited_countries.user_id = $1",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  await refreshUsers();
  var user = users.find((user) => user.id === currentUserId);

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: user.color || "teal",
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];

    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1,$2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add === "new") res.render("new.ejs");
  else {
    currentUserId = parseInt(req.body.user);
    const countries = await checkVisisted();
    var user = users.find((user) => user.id === currentUserId);

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: user.color || "teal",
    });
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const { name, color } = req.body;
  if (
    name !== undefined &&
    name.length > 0 &&
    color !== undefined &&
    color.length > 0
  ) {
    try {
      var result = await db.query(
        "INSERT INTO users (name, color) VALUES ($1,$2) RETURNING id",
        [name, color]
      );

      currentUserId = result.rows[0].id;
      await refreshUsers();
    } catch (err) {
      console.log(err);
    }

    const countries = await checkVisisted();

    var user = users.find((user) => user.id === currentUserId);

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: user.color || "teal",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
