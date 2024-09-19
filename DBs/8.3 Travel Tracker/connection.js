import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: "avnadmin",
  password: process.env.password,
  host: "pg-marcelo-marcelo.d.aivencloud.com",
  port: 24646,
  database: "world",
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.ca,
  },
};

const db = new pg.Client(config);

export default db;
