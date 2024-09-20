import express from "express";
import { debug } from "console";
import AuthService from "../services/AuthService.js";
import CookieService from "../services/CookieService.js";
import db from "./connection.js";

const Todo = express.Router();

const getToken = (req) => {
  return req.cookies[CookieService.ID_TOKEN_COOKIE.name];
};

Todo.post("/", async (req, res) => {
  try {
    const authService = new AuthService();
    const userData = await authService.getUserData(getToken(req));
    res.locals.user = userData;
    debug(req.body);
    try {
      if (req.body.action === "add") {
        await db.addTODO(userData.sub, req.body.content);
      } else if (req.body.action === "edit") {
      }
      res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
    res.clearCookie(
      CookieService.ID_TOKEN_COOKIE.name,
      CookieService.ID_TOKEN_COOKIE.cookie
    );
    return res.sendStatus(401);
  }
});

Todo.post("/:id", async (req, res) => {
  debug("Hitting /api/todos/:id");
  try {
    const authService = new AuthService();
    const userData = await authService.getUserData(getToken(req));
    res.locals.user = userData;
    debug(req.params.id);
    debug(req.body);
    try {
      if (req.body.action === "delete") {
        debug("Hitting delete");
        console.log(await db.updateTODODelete(req.params.id, true));
      } else if (req.body.action === undefined) {
        if (req.body.checkbox === "on") {
          const done = req.body.checkbox === "on" ? true : false;
          console.log(await db.updateTODODone(req.params.id, done));
        } else if (req.body.content) {
          console.log(
            await db.updateTODOContent(req.params.id, req.body.content)
          );
        } else {
          console.log(await db.updateTODODone(req.params.id, false));
        }
      }
      res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
    res.clearCookie(
      CookieService.ID_TOKEN_COOKIE.name,
      CookieService.ID_TOKEN_COOKIE.cookie
    );
    return res.sendStatus(401);
  }
});

export default Todo;
