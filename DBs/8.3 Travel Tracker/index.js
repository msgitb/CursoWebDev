import express from "express";
import bodyParser from "body-parser";
import db from "./connection.js";

const app = express();
const port = 3000;

db.connect(async (err) => {
  if (err) throw err;
});

var error;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var countries = [];

const populateCountries = async () => {
  try {
    await db.connect();
  } catch (err) {}
  const result = await db.query("Select country_code from visited_countries");
  countries = result.rows.map((item) => item.country_code);
};

const checkCountryCode = async (country) => {
  try {
    await db.connect();
  } catch (err) {}

  const query = `SELECT country_code from countries WHERE UPPER(country_name) LIKE UPPER($1)`;
  const result = await db.query(query, [country]);
  if (result.rows.length === 0) return undefined;
  else return result.rows[0].country_code;
};

const addCountryCode = async (code) => {
  try {
    await db.connect();
  } catch (err) {}

  const query = `INSERT INTO visited_countries (country_code) VALUES ('${code}')`;
  console.log(query);
  var result;
  try {
    result = await db.query(query);
    error = undefined;
  } catch (err) {
    console.log(err);
    error = err.toString();
    if (err.toString() === "error: value too long for type character(2)")
      error = "country not found!";
    else if (
      err.toString() ===
      'error: duplicate key value violates unique constraint "visited_countries_country_code_key"'
    ) {
      error = "country is already inserted";
    }
  }
  console.log(result);
};

await populateCountries();

app.get("/", async (req, res) => {
  console.log(countries);

  res.render("index.ejs", {
    total: countries.length,
    countries,
  });
});

app.post("/add", async (req, res) => {
  if (req.body.country.length === 2) await addCountryCode(req.body.country);
  else {
    await addCountryCode(await checkCountryCode(req.body.country));
  }
  await populateCountries();

  res.render("index.ejs", {
    total: countries.length,
    countries,
    error,
  });
});

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
});
