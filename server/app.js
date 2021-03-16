require("dotenv").config();

import express from "express";

import userRepo from "./repositories/user";

const app = express();
const port = process.env.PORT;

app.get("/:id", async function (req, res) {
  const user = await userRepo.fetchUser(req.params.id);
  res.json(user);
});

app.delete("/:id", async function (req, res) {
  const user = await userRepo.deleteUser(req.params.id);
  res.json(user);
});

app.get("/fetchUserWithoutDecorator/:id", async function (req, res) {
  const user = await userRepo.fetchUserWithoutDecorator(req.params.id);
  res.json(user);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
