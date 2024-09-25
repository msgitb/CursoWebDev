import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: "avnadmin",
  password: process.env.password,
  host: "pg-marcelo-marcelo.d.aivencloud.com",
  port: 24646,
  database: "auth",
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.ca,
  },
};

const client = new pg.Client(config);

export default client;
