import express from "express";
const app = express();
const port = 3000;

app.post("/register", (req, res)=>{
  console.log(req);
  res.sendStatus(201);
});

app.get("/", (req, res) => {
  res.send("<h1>Hellow</h1>");
});

app.put("/about", (req, res) => {
  res.send("<h1>About Me</h1><p>My name is Angela</p>");
});

app.get("/contact", (req, res) => {
  res.send("<h1>Contact Me</h1><p>Phone: +44123456789</p>");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
