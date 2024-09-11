import express from "express";
import axios from "axios";
import https from "https";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;
const API_KEY_OPEN_WEATHER = process.env.API_KEY_OPEN_WEATHER;
const API_KEY_LYRICS = process.env.API_KEY_LYRICS;
const API_UID_LYRICS = process.env.API_UID_LYRICS;
const DEV_ENV = process.env.DEV_ENV;

if (DEV_ENV) {
  const sunnySong = JSON.parse(
      fs.readFileSync(path.join("public/sunnySong.json"))
    ),
    sunnyQuote = JSON.parse(
      fs.readFileSync(path.join("public/sunnyQuotes.json"))
    ),
    rainyQuote = JSON.parse(
      fs.readFileSync(path.join("public/rainyQuotes.json"))
    ),
    rainySong = JSON.parse(fs.readFileSync(path.join("public/rainySong.json")));

  const getSunnyValues = () => {
    const type = Math.floor(Math.random() * 2);
    var pos;

    if (type === 0) {
      pos = Math.floor(Math.random() * sunnySong.result.length);
      return {
        message: `${sunnySong.result[pos].song} - <em>${sunnySong.result[pos].artist}</em>`,
        author: `Album: ${sunnySong.result[pos].album}`,
      };
    } else {
      pos = Math.floor(Math.random() * sunnyQuote.result.length);
      return {
        message: `"${sunnyQuote.result[pos].quote}"`,
        author: `<em>${sunnyQuote.result[pos].author}</em>`,
      };
    }
  };
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

const getQuote = async (term) => {
  console.log(`Getting quote for ${term}`);
  try {
    const response = await axios.get(
      "https://www.stands4.com/services/v2/quotes.php",
      {
        params: {
          uid: API_UID_LYRICS,
          tokenid: API_KEY_LYRICS,
          searchtype: "Search",
          query: term,
          format: "json",
        },
      }
    );

    var pos = Math.floor(Math.random() * response.data.result.length);

    return {
      message: `"${response.data.result[pos].quote}"`,
      author: `<em>${response.data.result[pos].author}</em>`,
    };
  } catch (error) {
    throw error;
  }
};

const getSong = async (term) => {
  try {
    const response = await axios.get(
      "https://www.stands4.com/services/v2/lyrics.php",
      {
        params: {
          uid: API_UID_LYRICS,
          tokenid: API_KEY_LYRICS,
          units: "metric",
          format: "json",
          term: term,
        },
      }
    );
    var pos = Math.floor(Math.random() * sunnySong.result.length);
    return {
      message: `${response.data.result[pos].song} - <em>${response.data.result[pos].artist}</em>`,
      author: `Album: ${response.data.result[pos].album}`,
    };
  } catch (error) {
    throw error;
  }
};

app.get("/check", async (req, res) => {
  const { latitude } = req.query,
    { longitude } = req.query;

  try {
    const result = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat: latitude,
          lon: longitude,
          units: "metric",
          cnt: 10,
          appid: API_KEY_OPEN_WEATHER,
        },
      }
    );

    const rainCodes = new Uint16Array([
      200, 201, 202, 230, 231, 232, 300, 301, 302, 310, 312, 313, 314, 321, 500,
      501, 502, 503, 504, 511, 520, 521, 522, 531, 600, 601, 602, 611, 612, 613,
      615, 616, 620, 621, 622, 721,
    ]);

    const weather24h = result.data.list;
    var willItRain = false;

    weather24h.forEach((dataPoint) => {
      if (willItRain) return;
      const weatherCode = dataPoint.weather[0].id;
      willItRain = rainCodes.includes(weatherCode);
    });

    const midDay = findMiddayDataPoint(weather24h);

    var quote = Math.floor(Math.random() * 2)
      ? await getQuote(midDay.weather[0].main.toLowerCase())
      : await getSong(midDay.weather[0].main.toLowerCase());

    const { message, author } = quote;
    res.render("check.ejs", {
      message,
      author,
      imgSrc: `https://openweathermap.org/img/wn/${midDay.weather[0].icon}@4x.png`,
      weather: midDay.weather[0].main,
    });
  } catch (error) {
    res.status(error);
  }
});

const findMiddayDataPoint = (dataPoints) => {
  var midDay;
  dataPoints
    .slice()
    .reverse()
    .forEach((dataPoint) => {
      if (midDay) return;
      midDay = dataPoint.dt_txt.includes("12:00:00") ? dataPoint : undefined;
    });
  return midDay;
};

var options;
if (DEV_ENV === true) {
  options = {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
  };
}

var server;

if (DEV_ENV === true) {
  server = https.createServer(options, app);
}

DEV_ENV === false
  ? app.listen(port, () => {
      console.log("Listening on " + port);
    })
  : server.listen(port, () => {
      console.log("Listening https on " + port);
    });
