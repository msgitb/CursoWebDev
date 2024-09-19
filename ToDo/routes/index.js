import express from "express";
import AuthController from "../controllers/AuthController.js";

const controllers = express.Router();
controllers.use("/auth", AuthController);

export default controllers;
