import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import createError from "http-errors";
import AuthService from "./services/AuthService.js";
import controllers from "./routes/index.js";
import CookieService from "./services/CookieService.js";
import { debug } from "console";
import db from "./controllers/connection.js";

const NODE_ENV = process.env.NODE_ENV;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getToken = (req) => {
  return req.cookies[CookieService.ID_TOKEN_COOKIE.name];
};
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`${NODE_ENV} ${req.method} ${req.path}`, req.body);
  return next();
});

app.get("/", (req, res) => {
  const idToken = getToken(req);
  if (!idToken) {
    console.log("No ID Token found, sending login page");
    return res.render("index.ejs");
  }
  return res.redirect("/profile");
});

app.use("/api", controllers);

app.use(async (req, res, next) => {
  debug("CHECKING ID TOKEN COOKIE");
  const idToken = getToken(req);
  if (!idToken) {
    console.log("No id token provided");
    return res.sendStatus(401);
  }

  // Extract user information from ID token
  try {
    const authService = new AuthService();
    const userData = await authService.getUserData(idToken);
    res.locals.user = userData;
    console.log("ID token valid");
    return next();
  } catch (err) {
    console.error("ID token invalid", err);
    res.clearCookie(
      CookieService.ID_TOKEN_COOKIE.name,
      CookieService.ID_TOKEN_COOKIE.cookie
    );
    return res.sendStatus(401);
  }
});

app.get("/profile", async (req, res, next) => {
  try {
    const { email, name, picture, sub } = res.locals.user;

    if (!(await db.verifyUserExists(sub))) {
      debug("User not found in DB, registering");
      debug(await db.registerUser(sub, email, name));
    } else {
      debug("User found in DB, retrieving todos");
      var todos = await db.listAllTODOS(sub);
    }
    return res.render("profile", { email, name, picture, todos });
  } catch (err) {
    console.error("Error sending profile page", err);
    return next(err);
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/api/auth/logout");
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

export default app;
