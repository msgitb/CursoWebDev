import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
const API_URL = "https://secrets-api.appbrewery.com/random";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL);
    res.render("index.ejs", {
      secret: result.data.secret,
      user: result.data.username,
    });
  } catch (error) {
    res.render("index.ejs", {
      secret: error.response.data,
      user: error.response.statuscode,
    });
  }
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
