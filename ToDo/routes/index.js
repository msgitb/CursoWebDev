import express from "express";
import AuthController from "../controllers/AuthController.js";
import Todo from "../controllers/todo.js";

const controllers = express.Router();
controllers.use("/auth", AuthController);
controllers.use("/todo", Todo);
export default controllers;
